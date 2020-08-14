<template>
  <page title="新建教师评估"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="teacher-appraisal-create">
      <item :hasClick="false"
            class="full-input">
        <input placeholder="评估名称"
               v-model="form.name" />
      </item>
      <item @click="handleRange">
        <div slot="main">评估范围</div>
        <div slot="remark"
             v-html="rangeTxt"></div>
      </item>
      <item class="ta-time"
            :hasClick="false">
        <div slot="main">开始时间</div>
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item class="ta-time"
            :hasClick="false">
        <div slot="main">截止时间</div>
        <div slot="after">
          <el-date-picker v-model="form.deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item>
        <div slot="main">允许自评</div>
        <div slot="after">
          <i-switch :value="isSelfEvaluate"
                    @click="handleSelfEvaluate"></i-switch>
        </div>
      </item>
      <item>
        <div slot="main">自动显示自评答案</div>
        <div slot="after">
          <i-switch :value="isSelfAnswer"
                    @click="handleSelfAnswer"></i-switch>
        </div>
      </item>
      <item @click="handleCase">
        <div slot="main">评估方案</div>
        <div slot="remark"
             v-html="caseTxt"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          deadline: '',
          startTime: '',
          selfEvaluate: '1',
          selfAnswer: '1',
          ranges: [],
          aplCase: null
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      }),
      isSelfAnswer() {
        return this.form.selfAnswer === '1'
      },
      isSelfEvaluate() {
        return this.form.selfEvaluate === '1'
      },
      rangeTxt() {
        let rs = this.form.ranges.filter(v => {
          return Check.isRealArray(v.appraisers)
        })
        return rs
          .map(v => {
            return v.name
          })
          .join('、')
      },
      caseTxt() {
        return this.form.aplCase ? this.form.aplCase.title : '请选择'
      }
    },
    methods: {
      ...mapActions(['setTeacherAppraisal', 'modifyChannelMessage']),
      fetchData() {
        const that = this
        if (that.appraisal.form) {
          that.form = { ...that.appraisal.form }

          if (Check.isRealArray(that.appraisal.ranges)) {
            that.form.ranges = that.appraisal.ranges
            that.setTeacherAppraisal({ ranges: [] })
          }

          if (that.appraisal.aplCase) {
            that.form.aplCase = that.appraisal.aplCase
            that.setTeacherAppraisal({ aplCase: null })
          }
        } else {
          that.form.startTime = DateUtils.format(new Date(), DateUtils.YMD_HM)
        }
      },
      handleSelfEvaluate() {
        let obj = this.form.selfEvaluate
        this.form.selfEvaluate = obj === '1' ? '0' : '1'
      },
      handleSelfAnswer() {
        let obj = this.form.selfAnswer
        this.form.selfAnswer = obj === '1' ? '0' : '1'
      },
      handleRange() {
        this.setTeacherAppraisal({ form: this.form, ranges: this.form.ranges })
        this.routePush({ name: 'selectRange1178' })
      },
      handleCase() {
        this.setTeacherAppraisal({ form: this.form, aplCase: this.form.aplCase })
        this.routePush({ name: 'selectCase1178' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '评估名称不能为空', type: 'warning' })
          return false
        }

        let rs = this.form.ranges.filter(v => {
          return Check.isRealArray(v.appraisers)
        })
        if (!Check.isRealArray(rs)) {
          that.$message({ message: '请选择评估范围', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.startTime)) {
          that.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (!form.aplCase) {
          that.$message({ message: '请选择评估方案', type: 'warning' })
          return false
        }

        let groupIds = []
        rs.map(v => {
          let values = v.appraiseds.map(a => {
            return a.value
          })
          v.appraisers.map(a => {
            let userIds = []
            if (Check.isRealArray(a.members)) {
              a.members.map(u => {
                userIds.push(u.userId)
              })
            }
            groupIds.push({
              type: v.value,
              groupId: a.groupId,
              appraisers: userIds,
              objectTypes: values
            })
          })
        })

        let postData = that.constructionMessage({
          title: form.name,
          groupIds: groupIds,
          startTime: DateUtils.format_0800(form.startTime),
          deadline: DateUtils.format_0800(form.deadline),
          selfAppraisal: form.selfEvaluate,
          selfVisible: form.selfAnswer,
          projectId: form.aplCase.id
        })

        Api.commitTeacherApsl(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          if (res.message) {
            that.modifyChannelMessage(res.message)
          }
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setTeacherAppraisal({ form: null, objects: [], roles: [], classes: [] })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .teacher-appraisal-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .ta-time input {
      min-width: initial !important;
    }
  }
</style>
