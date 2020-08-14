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
      <item class="lv-time"
            :hasClick="false">
        <div slot="main">开始时间</div>
        <div slot="after">
          <template v-if="timeForNode">
            <el-date-picker v-model="tchForm.startTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            @change="getApprovers"
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
            <el-date-picker v-model="tchForm.startTime"
                            prefix-icon="x"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            @change="getApprovers"
                            :clearable="false"></el-date-picker>
          </template>
        </div>
      </item>
      <item class="lv-time"
            :hasClick="false">
        <div slot="main">结束时间</div>
        <div slot="after">
          <template v-if="timeForNode">
            <el-date-picker v-model="tchForm.endTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            @change="getApprovers"
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
            <el-date-picker v-model="tchForm.endTime"
                            prefix-icon="x"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            @change="getApprovers"
                            :clearable="false"></el-date-picker>
          </template>
        </div>
      </item>
      <item @click="handleApprover">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-html="approverTxt"></div>
      </item>
      <item @click="handleExecutor">
        <div slot="main">备案人</div>
        <div slot="remark"
             v-html="executorTxt"></div>
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
        tchForm: {
          user: null,
          type: null,
          approvers: [],
          executors: [],
          startTime: '',
          endTime: '',
          sNode: '',
          eNode: '',
          editMeta: {
            obj: 1
          }
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
      timeMeta() {
        return this.filterMeta('m_leave_time_type')
      },
      timeForNode() {
        return this.timeMeta && this.timeMeta.obj === '1'
      },
      typeTxt() {
        return this.tchForm.type ? this.tchForm.type.name : ''
      },
      editApprover() {
        return this.tchForm.editMeta.obj === '1'
      },
      memberTxt() {
        return this.tchForm.user ? this.tchForm.user.name : ''
      },
      approverTxt() {
        let aps = this.tchForm.approvers
        return aps.length > 0 ? `${aps.length}位成员` : ''
      },
      executorTxt() {
        let exts = this.tchForm.executors
        return exts.length > 0 ? `${exts.length}位成员` : ''
      },
      sNodeTxt() {
        return this.tchForm.sNode ? this.tchForm.sNode.name : '选择课时'
      },
      eNodeTxt() {
        return this.tchForm.eNode ? this.tchForm.eNode.name : '选择课时'
      }
    },
    methods: {
      ...mapActions(['setLeave', 'deleteLeaveProp']),
      fetchData() {
        const that = this
        this.editorMessage.isPrivate = '1'
        if (that.leave.tchForm) {
          that.tchForm = { ...that.leave.tchForm }

          let apvs = that.leave.approvers
          if (Check.isRealArray(apvs)) {
            that.tchForm = { ...that.tchForm, approvers: apvs }
            this.deleteLeaveProp('approvers')
          }

          let exts = that.leave.executors
          if (exts) {
            that.tchForm = { ...that.tchForm, executors: exts }
            this.deleteLeaveProp('executors')
          }

          let tp = that.leave.type
          if (Check.isObject(tp)) {
            that.tchForm = { ...that.tchForm, type: tp }
            this.deleteLeaveProp('type')
          }

          if (this.leave.editApprover) {
            this.deleteLeaveProp('editApprover')
          }

          let user = that.leave.user
          if (Check.isObject(user)) {
            that.tchForm = { ...that.tchForm, user: user }
            this.deleteLeaveProp('user')
          }
        } else {
          let pattern = that.timeForNode ? DateUtils.YMD : DateUtils.YMD_HM
          that.tchForm.startTime = DateUtils.format(new Date(), pattern)
          that.tchForm.endTime = DateUtils.format(new Date(), pattern)
          that.getApprovers()

          Api.getSettingData(this.groupId).then(res => {
            if (res.metaDatas) {
              this.tchForm.editMeta = res.metaDatas[0]
            }
            this.tchForm.executors = res.persons || []
          })
        }

        if (that.timeForNode) {
          Api.getClassHours(that.currentGroup.groupId).then(res => {
            that.classNodes = res.times
          })
        }

        that.editorMessage.isPrivate = '1'
      },
      filterMeta(type) {
        const that = this
        let school = that.getSchool(that.currentGroup.parentId)
        let meta = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === school.groupId
        })[0]
        return meta
      },
      getApprovers() {
        let form = this.tchForm
        if ((this.timeForNode && form.sNode && form.eNode && form.startTime && form.endTime) || (!this.timeForNode && form.startTime && form.endTime)) {
          let sTime = form.startTime
          let eTime = form.endTime
          if (this.timeForNode) {
            sTime = `${sTime} ${form.sNode.start}`
            eTime = `${eTime} ${form.eNode.end}`
          }
          Api.getRuleDatas(this.groupId, null, DateUtils.format(sTime, 'yyyyMMddhhmmss'), DateUtils.format(eTime, 'yyyyMMddhhmmss')).then(res => {
            this.tchForm.approvers = res.teacherLeavePersons || []
          })
        }
      },
      handleType() {
        this.setLeave({ tchForm: this.tchForm, type: this.tchForm.type })
        this.routePush({ name: 'teacherLeaveType1235' })
      },
      handleStartNode(node) {
        this.tchForm.sNode = node
        this.getApprovers()
      },
      handleEndNode(node) {
        this.tchForm.eNode = node
        this.getApprovers()
      },
      handleMember(item) {
        this.setLeave({ tchForm: this.tchForm, user: this.tchForm.user })
        this.routePush({ name: 'selectLeaveMember1235' })
      },
      handleApprover() {
        this.setLeave({ tchForm: this.tchForm, isApprover: true, approvers: this.tchForm.approvers, editApprover: this.editApprover })
        this.routePush({ name: 'selectHandler1235' })
      },
      handleExecutor() {
        this.setLeave({ tchForm: this.tchForm, isApprover: false, executors: this.tchForm.executors })
        this.routePush({ name: 'selectHandler1235' })
      },
      handleSubmit() {
        const that = this

        let tchForm = this.tchForm
        if (!tchForm.user) {
          that.$message({ message: '请选择请假人', type: 'warning' })
          return false
        }

        if (!tchForm.type) {
          that.$message({ message: '请选择请假类型', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(tchForm.approvers)) {
          that.$message({ message: '审批人不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(tchForm.executors)) {
          that.$message({ message: '备案人不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '请假内容不能为空', type: 'warning' })
          return false
        }

        let startTime = tchForm.startTime
        let endTime = tchForm.endTime
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
          if (!tchForm.sNode) {
            that.$message({ message: '请选择开始课时', type: 'warning' })
            return false
          }

          if (!tchForm.eNode) {
            that.$message({ message: '请选择结束课时', type: 'warning' })
            return false
          }

          let sValue = tchForm.sNode.sectionIndex
          let eValue = tchForm.sNode.sectionIndex
          if (new Date(startTime).getTime() === new Date(endTime).getTime() && sValue > eValue) {
            that.$message({ message: '开始课时不能大于结束课时', type: 'warning' })
            return false
          }

          startTime = `${startTime} ${tchForm.sNode.start}`
          endTime = `${endTime} ${tchForm.eNode.end}`
          timeDatas = [
            { value: tchForm.sNode.sectionIndex, type: 'start', name: tchForm.sNode.name },
            { value: tchForm.eNode.sectionIndex, type: 'end', name: tchForm.eNode.name }
          ]
        }

        let apvs = tchForm.approvers.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'to',
            sort: v.approveOrder
          }
        })

        let exts = tchForm.executors.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'executor',
            sort: v.approveOrder
          }
        })
        let users = this.editorMessage.toUsers || []
        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1235',
          groupId: that.currentGroup.groupId,
          title: tchForm.type.name,
          extensionType: tchForm.type.id,
          times: [{ setTime: DateUtils.format_0800(startTime), type: 'start' }, { setTime: DateUtils.format_0800(endTime), type: 'end' }],
          table: {
            data: [
              JSON.stringify({
                extension: this.editorMessage.content,
                name: tchForm.user.name,
                userId: tchForm.user.userId
              })
            ]
          },
          msgType: '1',
          datas: timeDatas,
          toUsers: [...apvs, ...exts, ...users],
          extension: '2'
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.setLeave({ tchForm: that.tchForm })
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
          this.setLeave({ tchForm: null })
          this.editorMessage = {}
          this.routeBack()
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
