<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <div class="vx-questionaire">
      <template v-if="form">
        <template v-if="form.hasAspiration === '1'">
          <item :label="form.title"
                :remark="form.score || '待评估'"
                @click="handleAspiration"></item>
          <div class="category-title"></div>
        </template>
        <template v-for="(item, i) in form.questions">
          <Single v-if="item.type === '7'"
                  :key="i"
                  :question="item"
                  :index='i'
                  :params="{'hasClick': true}">
            <template slot='link'></template>
          </Single>
          <Single v-else-if="item.type === '8'"
                  :key="i"
                  :question="item"
                  :index='i'
                  :params="{'hasClick': true}">
            <template slot='link'></template>
          </Single>
          <item v-else
                :key="i"
                :label="(i + 1)+'、'+item.title">
            <input slot="remark"
                   v-model="item.content"
                   placeholder="数值" />
            <div slot="after">分</div>
          </item>
        </template>
      </template>
    </div>
    <template v-if="historyTxt">
      <div class="category-title"></div>
      <div class="history-text"
           v-html="converContent(historyTxt)"></div>
    </template>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Single: resolve => require(['@/views/components/question/Single'], resolve),
      Multiple: resolve => require(['@/views/components/question/Multiple'], resolve)
    },
    data() {
      return {
        form: null,
        score: '',
        historyTxt: '',
        qtObj: {
          '9': '评分题',
          '7': '单选题',
          '8': '多选题'
        }
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        let name = this.routeQuery('uname')
        return name ? `能力评估 - ${name}` : ''
      },
      msgId() {
        return this.routeQuery('msgId')
      }
    },
    created() {
      let aspiration = this.obj.aspiration || {}
      this.fetchData(aspiration.id)
      this.modifyCreateObjectField('aspiration')
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      getSerialNumber(index) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(index)
      },
      fetchData(id) {
        let personNo = this.routeQuery('personNo')
        let formId = id || this.routeQuery('formId')
        Api.getAppraiseDetail(this.msgId, personNo, formId).then(res => {
          if (res.form) {
            this.form = res.form
            this.form.questions = res.form.questions.map(v => {
              v.content = v.answerContent || ''
              v.name = v.title
              v.title = `【${this.qtObj[v.type]}】${v.title}`
              if (v.options) {
                v.options = v.options.map((o, i) => {
                  o.content = o.title
                  o.serialNumber = this.getSerialNumber(i)
                  return o
                })
              }
              return v
            })
          }
          this.score = res.answerScore || ''
          this.historyTxt = res.modifyHistory || ''
        })
      },
      handleAspiration() {
        this.routePush({
          path: '/vx/group/business/1300/appraise/distribute',
          query: {
            msgId: this.msgId,
            personNo: this.routeQuery('personNo'),
            title: '选择志愿'
          }
        })
      },
      handleSubmit() {
        let form = this.form
        let personNo = this.routeQuery('personNo')
        let postData = {
          id: form.id,
          personNo: personNo,
          msgId: this.msgId
        }
        let flag = false
        let questions = []
        form.questions.forEach(v => {
          let qt = { id: v.id, type: v.type }
          if (v.type === '7' || v.type === '8') {
            let ops = v.options.filter(v => {
              return v.selected
            })
            if (ops.length < 1) {
              flag = true
            }
            qt.options = ops.map(v => {
              return { id: v.id }
            })
          } else {
            if (Check.isNullString(v.content)) {
              flag = true
            }
            qt.answerContent = v.content
          }
          if (!flag) {
            questions.push(qt)
          }
        })
        if (questions.length < 1) {
          this.$message({ message: '至少评估一项', type: 'warning' })
        }
        postData.questions = questions
        Api.modifyAppraise({ form: postData }).then(res => {
          this.setStorage('_1300_appraise_users_refresh', true)
          this.modifyCreateObjectField('personNo')
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/questionaire';
  .history-text {
    padding: rem(5) rem(10);
    text-align: justify;
  }
</style>
