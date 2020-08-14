<template>
  <Page title="新建报名"
        closePrompt
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <label slot="btn"
           @click="handleSaveDraft">存草稿</label>
    <div class="category-title template"
         @click="handleMsgTemplate"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div slot="main"
         id="apply-create"
         v-loading.fullscreen.lock="loading"
         element-loading-text="提交中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">

      <item :hasClick="false">
        <div>标题</div>
        <input slot="remark"
               type="text"
               placeholder="标题"
               v-model="title">
      </item>
      <item :hasClick="false"
            class="apply">
        <div>开始时间</div>
        <el-date-picker slot="remark"
                        v-model="startTime"
                        :clearable="false"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss.0 +0800"
                        prefix-icon="xxx"
                        placeholder="选择日期时间">
        </el-date-picker>
      </item>
      <item :hasClick="false"
            class="apply">
        <div>截止时间</div>
        <el-date-picker slot="remark"
                        v-model="setTime"
                        :clearable="false"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss.0 +0800"
                        prefix-icon="xxx"
                        placeholder="选择日期时间">
        </el-date-picker>
      </item>
      <item @click="enrolmentInfoHandle">
        <div slot="main">报名人信息</div>
        <div slot="remark">
          <template v-if="question.enrollTable.metaDatas.length>0">{{question.enrollTable.metaDatas.length}}项</template>
        </div>
      </item>
      <item @click="visibleRangeHandle">
        <div slot="main">可见范围</div>
        <div slot="remark">{{rangeText}}</div>
      </item>
      <item @click="handleAudit">
        <div slot="main">是否需要审核</div>
        <div slot="after">
          <i-switch :value="question.isAudit"
                    :trueValue="1"
                    :falseValue="0"
                    @click="handleAudit"></i-switch>
        </div>
      </item>
      <div class="edit-box">
        <keep-alive>
          <EditorSimple placeholder="简介"
                        :toolbars="['photo', 'file']"
                        :store.sync="editorMessage"></EditorSimple>
        </keep-alive>
      </div>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve),
      ReplyContent: resolve => require(['./ReplyContent'], resolve)
    },
    computed: {
      ...mapGetters({
        enroll: 'getEnroll',
        question: 'getQuestion'
      }),
      title: {
        get() {
          return this.enroll.title
        },
        set(value) {
          this.saveEnroll({
            title: value
          })
        }
      },
      setTime: {
        get() {
          return this.enroll.times[0].setTime
        },
        set(value) {
          this.saveEnroll({
            times: [
              {
                type: 'end',
                setTime: value
              },
              { type: 'start', setTime: this.enroll.times[1].setTime }
            ]
          })
        }
      },
      startTime: {
        get() {
          return this.enroll.times[1].setTime
        },
        set(value) {
          this.saveEnroll({
            times: [{ type: 'end', setTime: this.enroll.times[0].setTime }, { type: 'start', setTime: value }]
          })
        }
      },
      briefContent: {
        get() {
          return this.enroll.content
        },
        set(value) {
          this.saveEnroll({
            content: value
          })
        }
      },
      rangeText() {
        if (Check.isRealArray(this.enroll.toUsers)) {
          return `${this.enroll.toUsers[0].name}等${this.enroll.toUsers.length}个`
        }
        return '全体成员'
      }
    },
    data() {
      return {
        count: '',
        loading: false,
        isSchoolBol: this.routeQuery('isSchool') ? this.routeQuery('isSchool') : false
      }
    },
    created() {
      // 设置请求头
      // if (this.routeQuery('tokenId') || this.$route.query.hasOwnPro
      // if (this.routeQuery('isSchool')) {
      //   this.visibleGroups = [...this.enroll.visibleRange]
      // } else {
      //   this.visibleMembers = [...this.enroll.visibleRange]
      // }
      this.getTemplatesCount()
    },
    activated() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['saveEnroll', 'saveQuestion', 'clearApplyCache']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1055').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        let msgCache = this.getStorage('_message_template_cache')
        if (msgCache) {
          let json = JSON.parse(msgCache.msgJson)
          this.saveQuestion({
            isAudit: json.remark,
            enrollTable: {
              ...this.question.enrollTable,
              metaDatas: json.questions,
              questionnaire: {
                questions: json.options
              }
            }
          })
          this.saveEnroll({
            title: msgCache.title,
            times: [
              {
                type: 'end',
                setTime: json.notifyTime
              },
              {
                type: 'start',
                setTime: json.startTime
              }
            ]
          })
          this.editorMessage = {
            content: msgCache.content,
            medias: msgCache.medias || []
          }
        }
      },
      // 存草稿
      handleSaveDraft() {
        const that = this
        let form = that.enroll
        if (Check.isNullString(form.title) && Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '标题/内容至少填写一项', type: 'warning' })
          return false
        }
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1055',
          type: '1',
          message: that.getMessageData()
        }
        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      // 可选模板
      handleMsgTemplate() {
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1055'
          }
        })
      },
      getMessageData() {
        const that = this
        let form = this.enroll
        let message = that.constructionMessage({
          type: '1055',
          version: '1',
          groupId: that.groupId,
          title: form.title,
          ...that.editorMessage
        })
        message.msgJson = JSON.stringify({
          notifyTime: form.times[0].setTime,
          startTime: form.times[1].setTime,
          remark: this.question.isAudit,
          questions: this.question.enrollTable.metaDatas,
          options: this.question.enrollTable.questionnaire.questions
        })
        return message
      },
      // 提交
      handleSubmit() {
        if (Check.isNullString(this.enroll.title)) {
          this.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.enroll.times[1].setTime)) {
          this.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.enroll.times[0].setTime)) {
          this.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }
        if (new Date(this.enroll.times[0].setTime).getTime() <= new Date(this.enroll.times[1].setTime).getTime()) {
          this.$message({ message: '截止时间不能小于或等于开始时间', type: 'warning' })
          return false
        }
        if (this.question.enrollTable.metaDatas.length === 0) {
          this.$message({ type: 'warning', message: '报名人信息不能为空' })
          return false
        }
        if (Check.isNullString(this.editorMessage.content)) {
          this.$message({ message: '简介不能为空', type: 'warning' })
          return false
        }
        this.loading = true
        this.addMessage({
          msgJson: JSON.stringify(this.question),
          type: '1055',
          groupId: this.currentGroup.groupId,
          ...this.enroll,
          ...this.editorMessage,
          ...this.constructionMessage()
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.routeBack()
            this.clearApplyCache()
          })
          .catch(() => {
            this.loading = false
          })
      },
      fromSimpleImage(objs) {
        this.saveEnroll({
          medias: objs.medias
        })
      },
      callbackState() {
        // this.praxisData = this.getStorage('praxis', true) || []
      },
      enrolmentInfoHandle() {
        this.routePush({
          name: 'applyenrolmentInfo1055',
          query: {
            schoolId: this.routeQuery('schoolId') || this.currentGroup.parentId
          }
        })
      },
      visibleRangeHandle() {
        this.routePush({
          name: 'applyVisibleRange1055',
          query: {
            isSchool: this.isSchool, // this.isSchoolBol,
            clientId: this.routeQuery('clientId'),
            token: this.routeQuery('token'),
            groupId: this.routeQuery('groupId')
          }
        })
      },
      handleAudit() {
        this.saveQuestion({
          isAudit: this.question.isAudit === 0 ? 1 : 0
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearApplyCache()
            this.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .apply {
    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    .el-time-panel__content {
      &::before {
        top: 54%;
      }
      &::after {
        top: 54%;
        left: 0;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-left: rem(8);
      padding-right: 0;
    }

    .el-time-panel__footer {
      padding-right: rem(15);
    }
  }
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
