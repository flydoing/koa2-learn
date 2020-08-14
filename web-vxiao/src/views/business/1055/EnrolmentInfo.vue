<template>
  <page title="报名人信息"
        hasSubmit
        @submit="editCommit">
    <item @click="otherSelect">
      <div>
        <i class="ico ico-select"
           :class="{'active': otherActive}"></i>
      </div>
      <div slot="main">其他选项</div>
      <div slot="remark"
           @click.stop="selectPraxisStyle">
        <template v-if="question.enrollTable.questionnaire.questions.length<1">选填</template>
        <template v-if="question.enrollTable.questionnaire.questions.length>0">{{question.enrollTable.questionnaire.questions.length}} 题</template>
      </div>
    </item>
    <item @click="handleSelect(data)"
          v-for="(data,i) in datas"
          :key="i">
      <div>
        <i class="ico ico-select"
           :class="{'active': data.active}"></i>
      </div>
      <div slot="main">{{data.key}}</div>
      <div slot="after"></div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        datas: [],
        active: false,
        otherActive: false
      }
    },
    computed: {
      ...mapGetters({
        question: 'getQuestion'
      })
    },
    created() {
      let that = this
      Api.querySetInfoList(that.routeQuery('schoolId')).then(res => {
        that.datas = res.metaDatas
        that.datas.forEach(d => {
          if (d.key === '姓名') {
            that.$set(d, 'active', true)
          }
          if (d.key === '手机号码') {
            that.$set(d, 'active', true)
          }
          that.question.enrollTable.metaDatas.forEach(e => {
            if (d.id === e.id) {
              that.$set(d, 'active', true)
            }
          })
        })
        if (this.question.enrollTable.questionnaire.questions.length > 0) {
          this.otherActive = true
        }
      })
    },
    methods: {
      ...mapActions(['saveQuestion']),
      // 其他选项
      selectPraxisStyle() {
        this.saveStatus()
        this.routePush({
          name: 'applyReplyContent',
          query: {
            schoolId: this.routeQuery('schoolId') || this.currentGroup.parentId
          }
        })
      },
      handleSelect(data) {
        if (data.key === '姓名' || data.key === '手机号码') return
        let active = data.active
        this.$set(data, 'active', !active)
      },
      otherSelect() {
        this.otherActive = !this.otherActive
      },
      editCommit() {
        this.saveStatus()
        this.routePush({ name: 'sort1055' })
        // this.routeBack()
      },
      // 填完信息，勾选完保存状态
      saveStatus() {
        let selectedEnrolment = []
        this.datas.forEach(d => {
          d.active && selectedEnrolment.push(d)
        })
        if (this.otherActive) {
          if (this.question.enrollTable.questionnaire.questions.length > 0) {
            selectedEnrolment = selectedEnrolment.concat(this.question.enrollTable.questionnaire.questions)
          }
        }
        this.saveQuestion({
          enrollTable: {
            ...this.question.enrollTable,
            metaDatas: selectedEnrolment,
            questionnaire: {
              questions: this.question.enrollTable.questionnaire.questions
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .styleIndent {
    margin-left: 32px;
  }
</style>
