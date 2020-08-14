<template>
  <page title="新建问卷"
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
    <div class="questionaire-create">
      <item :hasClick="false"
            class="full-input">
        <input placeholder="标题"
               v-model="form.title" />
      </item>
      <item :hasClick="false"
            class="full-input">
        <input placeholder="说明（选填）"
               v-model="form.description" />
      </item>
      <item @click="handleRange">
        <div slot="main">调查范围</div>
        <div slot="remark"
             class="ellipsis"
             v-html="rangeTxt"></div>
      </item>
      <item class="q-time"
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
      <item v-if="!isSchool">
        <div slot="main">答卷人匿名</div>
        <div slot="after">
          <i-switch :value="isAnonymous"
                    @click="handleAnonymous"></i-switch>
        </div>
      </item>
      <item>
        <div slot="main">答卷人可见结果</div>
        <div slot="after">
          <i-switch :value="isDisplay"
                    @click="handleDisplay"></i-switch>
        </div>
      </item>
      <!-- <item>
        <div slot="main">外部人员可作答</div>
        <div slot="after">
          <i-switch :value="allowShare"
                    @click="handleNonuser"></i-switch>
        </div>
      </item> -->
      <div class="category-title"></div>
      <div v-for="(item,i) in form.questions"
           :key="i">
        <Question :num="i+1"
                  :question="item"
                  @click="handleQuestion"></Question>
        <div class="category-title"></div>
      </div>
      <item v-for="(item, i) in types"
            @click="handleAdd(item)"
            :key="i"
            :hasArrow="false">
        <div slot="before">
          <div class='ico ico-plus'></div>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Question: resolve => require(['./Question'], resolve)
    },
    data() {
      return {
        form: {
          title: '',
          description: '',
          deadline: '',
          ranges: [],
          display: '1',
          allowShare: '1',
          anonymous: '1',
          questions: []
        },
        types: [],
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
        questionaire: 'getQuestionaire'
      }),
      isDisplay() {
        return this.form.display === '1'
      },
      allowShare() {
        return this.form.allowShare === '1'
      },
      isAnonymous() {
        return this.form.anonymous === '1'
      },
      rangeTxt() {
        let ranges = this.form.ranges
        if (Check.isRealArray(ranges)) {
          return ranges
            .map(v => {
              return v.name
            })
            .join('、')
        }
        return '全体成员'
      }
    },
    methods: {
      ...mapActions(['setQuestionaire', 'deleteQuestionaireProp']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1042').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        const that = this
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          let json = JSON.parse(msgTmp.msgJson)
          this.form = {
            title: msgTmp.title,
            description: msgTmp.content,
            deadline: DateUtils.format(json.expirationDate, DateUtils.YMD_HM),
            display: json.isAnonymous,
            anonymous: json.anonymous === '1' ? '0' : '1',
            questions: json.questions,
            ranges: []
          }
          that.deleteQuestionaireProp('form')
        } else if (that.questionaire.form) {
          that.form = { ...that.questionaire.form }

          let qst = that.getStorage('_question_edit_cache')
          let qtIndex = that.questionaire.qtIndex
          let questions = [...that.form.questions]
          if (Check.isObject(qst)) {
            if (qst.status === 'd') {
              questions.splice(qtIndex, 1)
            } else if (qst.status === '1') {
              questions.splice(qtIndex, 1, qst)
            } else {
              questions.push({ ...qst, status: '1' })
            }
            that.form.questions = questions
          }
          if (that.questionaire.ranges) {
            that.form.ranges = that.questionaire.ranges
            that.deleteQuestionaireProp('ranges')
          }
          that.deleteQuestionaireProp('form')
        }
        CategoryApi.getCategorysByType('137').then(res => {
          that.types = res.categorys
        })
      },
      handleRange() {
        this.setQuestionaire({ form: this.form, ranges: this.form.ranges })
        if (this.isSchool) {
          this.routePush({ name: 'selectGroup1042' })
        } else {
          this.routePush({ name: 'selectMember1042' })
        }
      },
      handleDisplay() {
        let dpy = this.form.display
        this.form.display = dpy === '1' ? '0' : '1'
      },
      handleNonuser() {
        let dpy = this.form.allowShare
        this.form.allowShare = dpy === '1' ? '0' : '1'
      },
      handleAnonymous() {
        let ams = this.form.anonymous
        this.form.anonymous = ams === '1' ? '0' : '1'
      },
      handleQuestion(item, index) {
        this.setStorage('_question_edit_cache', item)
        this.setQuestionaire({ form: this.form, qtIndex: index - 1 })
        this.routePush({ name: 'questionEdit1042' })
      },
      handleAdd(item) {
        this.setStorage('_question_edit_type', item)
        this.setQuestionaire({ form: this.form })
        this.routePush({ name: 'questionEdit1042' })
      },
      getMessageData(users) {
        const that = this

        let qts = []
        let form = that.form
        if (Check.isRealArray(form.questions)) {
          qts = form.questions.map(v => {
            if (v.type === '3') {
              return { ...v, options: [{ content: '' }] }
            }
            return v
          })
        }

        let mJson = {
          title: form.title,
          explain: form.description,
          isAnonymous: form.display,
          questions: qts,
          anonymous: this.isSchool ? '1' : form.anonymous === '1' ? '0' : '1',
          expirationDate: form.deadline ? DateUtils.format_0800(form.deadline) : ''
        }

        let message = that.constructionMessage({
          type: '1042',
          groupId: that.groupId,
          msgJson: JSON.stringify(mJson),
          toUsers: users || []
        })

        return message
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.questions)) {
          that.$message({ message: '问卷题目不能为空', type: 'warning' })
          return false
        }

        let users = []
        if (that.isSchool && Check.isRealArray(form.ranges)) {
          form.ranges.map(v => {
            users.push({
              userId: v.id,
              name: v.name,
              userType: v.type === '1' ? 'group' : 'class',
              type: 'cc',
              groupId: v.groupId
            })
          })
        } else if (Check.isRealArray(form.ranges)) {
          form.ranges.map(v => {
            users.push({
              userId: v.userId,
              name: v.name,
              userType: v.userType,
              type: 'cc',
              groupId: v.groupId
            })
          })
        }

        that.addMessage(this.getMessageData(users)).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setQuestionaire({ form: null })
          this.routeBack()
        })
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.title) || Check.isNullString(form.description)) {
          that.$message({ message: '标题/说明至少填写一项', type: 'warning' })
          return false
        }

        let message = that.getMessageData()
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1042',
          type: '1',
          message: { ...message, title: form.title, content: form.description }
        }

        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setQuestionaire({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1042'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setQuestionaire({ form: null })
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
  .questionaire-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .q-time input {
      min-width: initial !important;
    }
  }
</style>
