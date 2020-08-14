<template>
  <page title="新建请假"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="leave-create">
      <item @click="handleMember">
        <div slot="main">请假人</div>
        <div slot="remark"
             v-html="memberTxt"></div>
      </item>
      <item @click="handleType">
        <div slot="main">类型</div>
        <div slot="remark"
             v-html="typeTxt"></div>
      </item>
      <item v-if="needApprove"
            @click="handleApprover">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-html="approverTxt"></div>
      </item>
      <item class="lv-time"
            :hasClick="false">
        <div slot="main">开始时间</div>
        <div slot="after">
          <template v-if="timeForNode">
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :clearable="false"></el-date-picker>
            <el-dropdown trigger="click"
                         @command="handleStartNode">
              <div class="el-dropdown-link">
                &#12288;<span class="lv-class-node"
                      v-html="sNodeTxt"></span>
              </div>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <el-dropdown-item class="menu-item"
                                  v-for="(item,i) in classNodes"
                                  :key="i"
                                  :command="item">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            :clearable="false"></el-date-picker>
          </template>
        </div>
      </item>
      <item class="lv-time"
            :hasClick="false">
        <div slot="main">结束时间</div>
        <div slot="after">
          <template v-if="timeForNode">
            <el-date-picker v-model="form.endTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :clearable="false"></el-date-picker>
            <el-dropdown trigger="click"
                         @command="handleEndNode">
              <div class="el-dropdown-link">
                &#12288;<span class="lv-class-node"
                      v-html="eNodeTxt"></span>
              </div>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <el-dropdown-item class="menu-item"
                                  v-for="(item,i) in classNodes"
                                  :key="i"
                                  :command="item">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <el-date-picker v-model="form.endTime"
                            prefix-icon="x"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            :clearable="false"></el-date-picker>
          </template>
        </div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic','open']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          user: null,
          type: null,
          approvers: [],
          startTime: '',
          endTime: '',
          sNode: '',
          eNode: '',
          illCondition: null
        },
        classNodes: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId',
        leave: 'getLeave'
      }),
      approveMeta() {
        return this.filterMeta('m_student_leave_isapprove')
      },
      timeMeta() {
        return this.filterMeta('m_leave_time_type')
      },
      needApprove() {
        return this.approveMeta && this.approveMeta.obj === '1'
      },
      timeForNode() {
        return (this.timeMeta && this.timeMeta.obj === '1') || !this.timeMeta
      },
      typeTxt() {
        let type = this.form.type
        if (type && type.value !== '3') {
          let cndn = this.form.illCondition
          let pgy = cndn.pathogeny

          let symptoms = []
          cndn.symptoms.forEach((v, i) => {
            if (v.flag === '1') {
              symptoms.push({ ...v, name: `${v.name} ${cndn.temperature}` })
            } else {
              symptoms.push(v)
            }
          })

          let txt = symptoms
            .map(v => {
              return v.content || v.name
            })
            .join('、')
          if (!Check.isNullString(pgy.content)) {
            return `${type.name}：${txt}${pgy.name}（${pgy.content}）`
          } else {
            return `${type.name}：${txt}（${pgy.name}）`
          }
        } else if (type) {
          return type.name
        }
        return ''
      },
      memberTxt() {
        return this.form.user ? this.form.user.name : ''
      },
      approverTxt() {
        let aps = this.form.approvers
        return aps.length > 0
          ? aps
              .map(v => {
                return v.name
              })
              .join('、')
          : ''
      },
      sNodeTxt() {
        return this.form.sNode ? this.form.sNode.name : '选择课时'
      },
      eNodeTxt() {
        return this.form.eNode ? this.form.eNode.name : '选择课时'
      }
    },
    methods: {
      ...mapActions(['setLeave']),
      fetchData() {
        const that = this
        if (that.leave.form) {
          that.form = { ...that.leave.form }

          let apvs = that.leave.users
          if (Check.isRealArray(apvs)) {
            that.form = { ...that.form, approvers: apvs }
          }

          let tp = that.leave.type
          if (Check.isObject(tp)) {
            that.form = { ...that.form, type: tp }
          }

          let user = that.leave.user
          if (Check.isObject(user)) {
            that.form = { ...that.form, user: user }
          }

          let cndn = that.leave.illCondition
          if (Check.isObject(cndn)) {
            that.form = { ...that.form, illCondition: cndn }
          }
        } else {
          let pattern = that.timeForNode ? DateUtils.YMD : DateUtils.YMD_HM
          that.form.startTime = DateUtils.format(new Date(), pattern)
          that.form.endTime = DateUtils.format(new Date(), pattern)
          that.editorMessage.isPrivate = '1'
        }

        Api.getClassHours(that.currentGroup.groupId).then(res => {
          that.classNodes = res.times
        })
      },
      filterMeta(type) {
        const that = this
        let school = that.getSchool(that.currentGroup.parentId)
        let meta = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === school.groupId
        })[0]
        return meta
      },
      handleType() {
        this.setLeave({ form: this.form, type: this.form.type, illCondition: this.form.illCondition })
        this.routePush({ name: 'studentLeaveType1235' })
      },
      handleStartNode(node) {
        this.form.sNode = node
      },
      handleEndNode(node) {
        this.form.eNode = node
      },
      handleMember(item) {
        this.setLeave({ form: this.form, user: this.form.user })
        this.routePush({ name: 'selectLeaveMember1235', query: { type: '4' } })
      },
      handleApprover() {
        this.setLeave({ form: this.form, users: this.form.approvers, isStudent: true })
        this.routePush({ name: 'selectMember1235' })
      },
      handleSubmit() {
        const that = this

        let form = this.form
        if (!form.user) {
          that.$message({ message: '请选择请假人', type: 'warning' })
          return false
        }

        if (!form.type) {
          that.$message({ message: '请选择请假类型', type: 'warning' })
          return false
        }
        if (that.needApprove && !Check.isRealArray(form.approvers)) {
          that.$message({ message: '审批人不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '请假内容不能为空', type: 'warning' })
          return false
        }

        let startTime = form.startTime
        let endTime = form.endTime
        let timeDatas = []
        if (Check.isNullString(startTime)) {
          that.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(endTime)) {
          that.$message({ message: '结束时间不能为空', type: 'warning' })
          return false
        }

        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
          that.$message({ message: '开始时间不能大于结束时间', type: 'warning' })
          return false
        }

        if (that.timeForNode) {
          if (!form.sNode) {
            that.$message({ message: '请选择开始课时', type: 'warning' })
            return false
          }

          if (!form.eNode) {
            that.$message({ message: '请选择结束课时', type: 'warning' })
            return false
          }

          let sValue = form.sNode.sectionIndex
          let eValue = form.sNode.sectionIndex
          if (new Date(startTime).getTime() === new Date(endTime).getTime() && sValue > eValue) {
            that.$message({ message: '开始课时不能大于结束课时', type: 'warning' })
            return false
          }

          startTime = `${startTime} ${form.sNode.start}`
          endTime = `${endTime} ${form.eNode.end}`
          timeDatas = [{ value: form.sNode.sectionIndex, type: 'start', name: form.sNode.name }, { value: form.eNode.sectionIndex, type: 'end', name: form.eNode.name }]
        }

        let lvData = {
          userId: form.user.userId,
          name: form.user.name,
          type: form.type.value,
          data: that.typeTxt,
          extension: this.editorMessage.content
        }

        let cndn = form.illCondition
        if (Check.isObject(cndn)) {
          lvData.categoryIds = cndn.symptoms
            .map(v => {
              return v.id
            })
            .join(',')
          lvData.diagnosisCauseId = cndn.pathogeny.id
          lvData.sickData = cndn.symptoms
            .map(v => {
              if (v.flag === '1') {
                return `${v.name}（${cndn.temperature}）`
              }
              return v.name
            })
            .join('、')
          lvData.diagnosis = cndn.pathogeny.content || cndn.pathogeny.name
          lvData.temperature = cndn.temperature.replace('℃', '')
          if (!Check.isNullString(cndn.pathogeny.content)) {
            lvData.diagnosisCauseText = cndn.pathogeny.content
          }
        }

        let apvs = form.approvers.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'to'
          }
        })
        let users = this.editorMessage.toUsers || []
        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1235',
          groupId: that.currentGroup.groupId,
          table: {
            data: [JSON.stringify(lvData)]
          },
          times: [{ setTime: DateUtils.format_0800(startTime), type: 'start' }, { setTime: DateUtils.format_0800(endTime), type: 'end' }],
          msgType: '1',
          datas: timeDatas,
          toUsers: [...apvs, ...users],
          extension: '3'
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.setLeave({ form: that.form })
          that.editorMessage = {}
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
          this.editorMessage = {}
          this.setLeave({ form: null })
        })
      }
    }
  }
</script>
<style lang="scss">
  .leave-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .lv-class-node {
      cursor: pointer;
    }

    .lv-time input {
      min-width: initial !important;
    }
  }
</style>
