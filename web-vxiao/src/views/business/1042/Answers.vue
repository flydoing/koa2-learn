<template>
  <page title="已答内容">
    <div class="question-answers">
      <div v-for="(item,i) in answers" :key="i" :item="item">{{i+1}}、{{item.content}}</div>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'

export default {
  mixins: [R],
  props: {},
  data() {
    return {
      answers: []
    }
  },
  created() {
    const that = this
    let msgId = that.routeQuery('msgId')
    let qId = that.routeParam('qId')
    Api.loadAnswerDataByQuestionId(msgId, qId).then(res => {
      that.answers = res.participants
    })
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.question-answers {
  &>div {
    padding: rem(10) rem(8);
    border-bottom: rem(1) solid #ebebeb;
  }
}

</style>
