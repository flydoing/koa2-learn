<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="!isSend"
        @back="handleBack"
        listenBack>
    <div class="disease-report-edit">
      <item @click="handleClass"
            :hasClick="canEdit">
        <div slot="main">班级</div>
        <div slot="remark"
             v-html="clsTxt"></div>
      </item>
      <item @click="handleUser"
            :hasClick="canEdit">
        <div slot="main">学生</div>
        <div slot="remark"
             v-html="userTxt"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">上报原因</div>
        <div slot="remark">
          <span v-for="(item, i) in reasons"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.reason}"
                @click="handleReason(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <div class="category-title"></div>
      <item :hasClick="false">
        <div slot="main">缺勤开始日期</div>
        <div slot="remark"
             v-html="form.time"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">缺勤开始上时辰</div>
        <div slot="remark">
          <span v-for="(item, i) in periods"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.startPeriod}"
                @click="handleStartPeriod(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">缺勤结束日期</div>
        <div slot="remark"
             v-html="form.time"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">缺勤结束时辰</div>
        <div slot="remark">
          <span v-for="(item, i) in periods"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.endPeriod}"
                @click="handleEndPeriod(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">缺勤天数</div>
        <input slot="remark"
               placeholder="必填"
               v-model="form.absentDays" />
      </item>
      <div class="category-title"></div>
      <item @click="handleSymptom"
            :hasClick="!isSend">
        <div slot="main">症状</div>
        <div slot="remark"
             class="ellipsis"
             v-html="symTxt"></div>
      </item>
      <item v-if="hasFever"
            :hasClick="false">
        <div slot="main">体温是否高于38摄氏度</div>
        <div slot="remark">
          <span v-for="(item, i) in whether"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.isHighTemp}"
                @click="handleHighTemp(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item v-if="hasFever"
            :hasClick="false">
        <div slot="main">是否伴随咽痛症状</div>
        <div slot="remark">
          <span v-for="(item, i) in whether"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.isSoreThroat}"
                @click="handleSoreThroat(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">无症状隔离</div>
        <div slot="remark">
          <span v-for="(item, i) in insulations"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.isInsulate}"
                @click="handleInsulate(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">症状发生日期</div>
        <div slot="remark"
             v-html="form.time"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">症状发生时辰</div>
        <div slot="remark">
          <span v-for="(item, i) in periods"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.happenedPeriod}"
                @click="handleHappenedPeriod(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <item @click="handlePathogeny"
            :hasClick="!isSend">
        <div slot="main">病因</div>
        <div slot="remark"
             class="ellipsis"
             v-html="pgyTxt"></div>
      </item>
      <div class="category-title"></div>
      <item :hasClick="false">
        <div slot="main">是否续报</div>
        <div slot="remark">
          <span v-for="(item, i) in whether"
                class="dr-choice"
                :key="i"
                :class="{'active': item.value === form.isResubmit}"
                @click="handleResubmit(item)"><i class="ico ico-radio"></i><label v-html="item.name"></label></span>
        </div>
      </item>
      <div class="button button-common"
           v-if="form.id && form.send === '0'"
           @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          cls: null,
          user: null,
          reason: '1',
          time: DateUtils.format(new Date(), 'yyyy-MM-dd'),
          startPeriod: '1',
          endPeriod: '2',
          absentDays: '',
          isInsulate: '1',
          happenedPeriod: '1',
          symptoms: [],
          pathogenys: [],
          isHighTemp: '0', // temperature
          isSoreThroat: '0',
          sRemark: '', // 其他症状备注
          pRemark: '', // 其他病因备注
          isResubmit: '1',
          tmp: ''
        },
        reasons: [
          {
            name: '因病缺勤',
            value: '1'
          },
          {
            name: '带病上课',
            value: '3'
          }
        ],
        periods: [
          {
            name: '上午',
            value: '1'
          },
          {
            name: '下午',
            value: '2'
          }
        ],
        whether: [
          {
            name: '是',
            value: '1'
          },
          {
            name: '否',
            value: '0'
          }
        ],
        insulations: [
          {
            name: '是',
            value: '1'
          },
          {
            name: '否',
            value: '2'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      }),
      title() {
        return this.form.id ? '编辑' : '新建'
      },
      canEdit() {
        return this.form.id === undefined
      },
      isSend() {
        return this.form.id && this.form.send === '1'
      },
      hasFever() {
        if (Check.isRealArray(this.form.symptoms)) {
          let fever = this.form.symptoms.filter(v => {
            return v.status === '2'
          })[0]
          return !Check.isNullObject(fever)
        }
        return false
      },
      clsTxt() {
        return this.form.cls ? this.form.cls.name : ''
      },
      userTxt() {
        return this.form.user ? this.form.user.name : ''
      },
      symTxt() {
        if (Check.isRealArray(this.form.symptoms)) {
          return this.form.symptoms
            .map(v => {
              return v.content || v.name
            })
            .join('、')
        }
        return ''
      },
      pgyTxt() {
        if (Check.isRealArray(this.form.pathogenys)) {
          return this.form.pathogenys
            .map(v => {
              return v.content || v.name
            })
            .join('、')
        }
        return ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      fetchData() {
        if (this.attendance.form) {
          this.form = { ...this.attendance.form }
          if (this.attendance.cls) {
            let cls = this.form.cls || {}
            if (this.attendance.cls.groupId !== cls.groupId) {
              this.form.user = null
            }
            this.form.cls = this.attendance.cls
            this.deleteAttendanceProp('cls')
          }
          let user = this.getStorage('_1237_select_user_cache')
          if (user) {
            this.form.user = user
          }
          if (this.attendance.symptoms) {
            this.form.symptoms = this.attendance.symptoms
            if (!this.hasFever) {
              this.form.isHighTemp = '0'
              this.form.isSoreThroat = '0'
            } else {
              let fever = this.form.symptoms.filter(v => {
                return v.status === '2'
              })[0]
              this.form.tmp = fever.tmp
            }
            this.deleteAttendanceProp('symptoms')
          }
          if (this.attendance.pathogenys) {
            this.form.pathogenys = this.attendance.pathogenys
            this.deleteAttendanceProp('pathogenys')
          }
        } else if (this.attendance.cache) {
          let cache = this.attendance.cache
          this.form = {
            id: cache.id,
            cls: { groupId: cache.groupId, name: cache.groupName || 'class' },
            user: { userId: cache.userId, name: cache.userName || 'user' },
            reason: cache.fabscause,
            time: DateUtils.format(cache.fabsbegdt, 'yyyy-MM-dd'),
            startPeriod: cache.fabsbegsw || '1',
            endPeriod: cache.fabsendsw || '2',
            absentDays: cache.fabsday,
            isInsulate: cache.finsulate,
            happenedPeriod: cache.fabshappsxw || '1',
            symptoms: [],
            pathogenys: [],
            tmp: cache.fifoverTitle,
            isHighTemp: cache.fifover38, // temperature
            isSoreThroat: cache.ffeverwithsympt,
            sRemark: cache.remark, // 其他症状备注
            pRemark: cache.noReasonRemark, // 其他病因备注
            isResubmit: cache.fresubmit,
            send: cache.send
          }
          this.deleteAttendanceProp('cache')
          Api.getSymptomsAndPathogenys().then(res => {
            if (!Check.isNullString(cache.sickleaveids)) {
              let svMap = new Map()
              let sValues = cache.sickleaveids.split(',')
              sValues.map(v => {
                svMap.set(v, v)
              })
              if (res.data && Check.isRealArray(res.data.sickReasons)) {
                res.data.sickReasons.map(v => {
                  let sym = svMap.get(v.value)
                  if (sym) {
                    if (v.status === '2') {
                      v.content = `${v.name} ${cache.fifoverTitle}`
                      v.tmp = cache.fifoverTitle
                    } else {
                      v.content = v.status === '5' ? cache.remark : ''
                    }
                    this.form.symptoms.push(v)
                  }
                })
              }
            }
            if (!Check.isNullString(cache.centerSickLeaveId)) {
              let pvMap = new Map()
              let pValues = cache.centerSickLeaveId.split(',')
              pValues.map(v => {
                pvMap.set(v, v)
              })
              if (res.data && Check.isRealArray(res.data.centerSickReasons)) {
                res.data.centerSickReasons.map(v => {
                  let pgy = pvMap.get(v.value)
                  if (pgy) {
                    v.content = v.status === '7' ? cache.noReasonRemark : ''
                    this.form.pathogenys.push(v)
                  }
                })
              }
            } else {
              if (res.data && Check.isRealArray(res.data.centerSickReasons)) {
                this.form.pathogenys = res.data.centerSickReasons.filter(v => {
                  return v.value === ''
                })
              }
            }
          })
        }
      },
      handleClass(item) {
        this.setAttendance({ form: this.form })
        this.routePush({ name: 'selectClass1237' })
      },
      handleUser() {
        if (!this.form.cls) {
          this.$message({ message: '请选择班级', type: 'warning' })
          return false
        }
        this.setAttendance({ form: this.form })
        this.routePush({
          name: 'selectStudent1237',
          query: { groupId: this.form.cls.groupId }
        })
      },
      handleReason(item) {
        if (this.isSend) {
          return false
        }
        this.form.reason = item.value
      },
      handleStartPeriod(item) {
        if (this.isSend) {
          return false
        }
        this.form.startPeriod = item.value
      },
      handleEndPeriod(item) {
        if (this.isSend) {
          return false
        }
        this.form.endPeriod = item.value
      },
      handleInsulate(item) {
        if (this.isSend) {
          return false
        }
        this.form.isInsulate = item.value
      },
      handleHappenedPeriod(item) {
        if (this.isSend) {
          return false
        }
        this.form.happenedPeriod = item.value
      },
      handleSymptom() {
        this.setAttendance({ form: this.form, symptoms: this.form.symptoms })
        this.routePush({ name: 'selectSymptom1237' })
      },
      handlePathogeny() {
        this.setAttendance({ form: this.form, pathogenys: this.form.pathogenys })
        this.routePush({ name: 'selectPathogeny1237' })
      },
      handleHighTemp(item) {
        if (this.isSend) {
          return false
        }
        this.form.isHighTemp = item.value
      },
      handleSoreThroat(item) {
        if (this.isSend) {
          return false
        }
        this.form.isSoreThroat = item.value
      },
      handleVisit(item) {
        if (this.isSend) {
          return false
        }
        this.form.isVisit = item.value
      },
      handleResubmit(item) {
        if (this.isSend) {
          return false
        }
        this.form.isResubmit = item.value
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (!form.cls) {
          that.$message({ message: '请选择班级', type: 'warning' })
          return false
        }
        if (!form.user) {
          that.$message({ message: '请选择学生', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.absentDays)) {
          that.$message({ message: '缺勤天数不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.symptoms)) {
          that.$message({ message: '请选择症状', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.pathogenys)) {
          that.$message({ message: '请选择病因', type: 'warning' })
          return false
        }

        let symIds = form.symptoms
          .map(v => {
            return v.value
          })
          .join(',')
        let pgyIds = form.pathogenys
          .map(v => {
            return v.value
          })
          .join(',')
        let item = form.pathogenys.filter(v => {
          return v.value === ''
        })[0]
        let otherSym = form.symptoms.filter(v => {
          return v.status === '5'
        })[0]
        let otherPgy = form.pathogenys.filter(v => {
          return v.status === '7'
        })[0]

        let time = DateUtils.format_0800(form.time)
        let postData = {
          schoolId: that.currentGroup.parentId,
          groupId: form.cls.groupId,
          userId: form.user.userId,
          fabscause: form.reason,
          fabsbegdt: time,
          fabsbegsw: form.startPeriod,
          fabsenddt: time,
          fabsendsw: form.endPeriod,
          fabsday: form.absentDays,
          finsulate: form.isInsulate,
          fabshappdt: time,
          fabshappsxw: form.happenedPeriod,
          sickleaveids: symIds,
          sickleaveTitle: that.symTxt,
          fifover38: form.isHighTemp,
          fifoverTitle: form.tmp,
          ffeverwithsympt: form.isSoreThroat,
          remark: otherSym ? otherSym.content : '',
          fifvisit: item ? '0' : '1',
          centerSickLeaveId: item ? '' : pgyIds,
          centerSickLeaveTitle: that.pgyTxt,
          noReasonRemark: otherPgy ? otherPgy.content : '',
          fresubmit: form.isResubmit,
          createBy: that.userId,
          send: '0'
        }

        if (form.id) {
          postData.id = form.id
        }

        Api.saveDiseaseReport(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.deleteAttendanceProp('form')
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该上报记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.removeDiseaseReport({
            id: this.form.id,
            schoolId: this.currentGroup.parentId
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.deleteAttendanceProp('form')
            this.routeBack()
          })
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteAttendanceProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .disease-report-edit {
    .dr-choice {
      cursor: pointer;
      &:first-child {
        margin-right: rem(10);
      }
      &.active {
        @include fc;
        .ico-radio {
          @include fch;
        }
      }
      label {
        cursor: pointer;
      }
    }
    .ico-radio {
      font-size: rem(15);
    }
  }
</style>
