<template>
  <page title="新建家访"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <label slot="btn"
           @click="handleSaveDraft">存草稿</label>
    <div class="category-title template"
         @click="handleMsgTemplate"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div class="homeVisit-create">
      <item @click="handleMember">
        <div slot="main">家访对象</div>
        <div slot="remark"
             class="ellipsis"
             v-html="memberTxt"></div>
      </item>
      <item :hasClick="false">
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
      <item @click="handleQuestion">
        <div slot="main">家访内容</div>
        <div slot="remark"
             class="ellipsis"
             v-html="qtTxt"></div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="输入内容"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          questions: [],
          deadline: '',
          members: []
        },
        count: ''
      }
    },
    created() {
      this.getTemplatesCount()
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        visit: 'getHomeVisit'
      }),
      memberTxt() {
        let mbs = this.form.members
        return mbs.length > 0 ? `${mbs.length}位成员` : '全体成员'
      },
      qts() {
        if (Check.isRealArray(this.form.questions)) {
          return this.form.questions.filter(v => {
            return v.select === undefined || v.select
          })
        }
        return []
      },
      qtTxt() {
        return this.qts.length > 0 ? `${this.qts.length}题` : ''
      }
    },
    methods: {
      ...mapActions(['setHomeVisit', 'deleteHomeVisitProp']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1260').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          if (msgTmp.times) {
            this.form.deadline = DateUtils.format(msgTmp.extension, 'yyyy-MM-dd hh:mm')
          }
          this.editorMessage = {
            content: msgTmp.content,
            medias: msgTmp.medias
          }
          this.form.questions = this.visit.form.questions
          this.deleteHomeVisitProp('form')
        } else if (this.visit.form) {
          this.form = { ...this.visit.form }
          if (this.visit.members) {
            this.form.members = this.visit.members
            this.deleteHomeVisitProp('members')
          }
          this.deleteHomeVisitProp('form')
        } else {
          Api.getQuestions(this.currentGroup.parentId).then(res => {
            this.form.questions = res.questions || []
          })
        }
      },
      handleQuestion() {
        this.setHomeVisit({ form: this.form, questions: this.qts })
        this.routePush({ name: 'questionList1260' })
      },
      handleMember() {
        this.setHomeVisit({ form: this.form, members: this.form.members })
        this.routePush({ name: 'selectMember1260' })
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let toUsers = []
        if (Check.isRealArray(form.members)) {
          toUsers = form.members.map(v => {
            return {
              userId: v.userId,
              name: v.name,
              userType: v.userType,
              type: 'cc',
              groupId: v.groupId
            }
          })
        }

        let postData = that.constructionMessage({
          ...that.editorMessage,
          type: '1260',
          groupId: that.groupId,
          toUsers: toUsers,
          extension: DateUtils.format_0800(form.deadline)
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }
        let message = that.constructionMessage({
          ...that.editorMessage,
          type: '1260',
          groupId: that.groupId
        })
        if (form.deadline) {
          message.extension = DateUtils.format_0800(form.deadline)
        }
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1260',
          type: '1',
          message: message
        }
        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setHomeVisit({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1260'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
