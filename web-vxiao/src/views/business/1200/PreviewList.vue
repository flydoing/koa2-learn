<template>
  <page title="已选题目"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <div class="questions-preview">
      <div v-if="questions.length>0"
           v-for="(q, i) in questions"
           :key="i">
        <QuetionCard :quetion="q"
                     :serail="i"
                     @deleteQuestion="deleteQuestion(i)"
                     @analysis="handleAnalysis" />
      </div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    components: {
      QuetionCard: (resolve) => require(['@/views/business/1073/QuetionCard'], resolve)
    },
    data() {
      return {
        questions: []
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      })
    },
    created() {
      this.questions = JSON.parse(JSON.stringify(this.cacheClassRoom.previewQuetions))
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      handleSubmit() {
        if (this.questions.length === 0) {
          this.$message({
            type: 'warning',
            message: '题目数量不能为0'
          })
          return false
        }
        this.routePush({ name: 'selectGroup1200' })
      },
      deleteQuestion(i) {
        this.questions.splice(i, 1)
      },
      handleAnalysis(question) {
        this.setStorage('question', question)
        this.routePush({ name: 'praxiAnaly1047' })
      },
      back() {
        this.saveClassRoomCreate({
          previewQuetions: this.questions
        })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .questions-preview {
    background-color: #ededed;
    & > div {
      background: #fff;
      margin-bottom: rem(10);
    }
  }
</style>
