<template>
  <page title="习题详情">
    <item :hasClick="false">
      <div>{{praxis.describe}}</div>
    </item>
    <div class="category-title"></div>
    <template v-if="praxis.questions.length>0">
      <div class="praxis-review-box"
           v-for="(question, q) in praxis.questions"
           :key="q">
        <!-- <div :is="getPraxiStyle(question.type)" :question.sync="question" :serial="q" :praxisId="praxis.id"></div> -->
        <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                      :question.sync="question"
                      :serial="q"
                      :praxisId="praxis.id" />
      </div>
    </template>
  </page>
</template>
<script>
  import Api from '../api'
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    data() {
      return {
        praxis: {}
      }
    },
    created() {
      Api.getTeacherDetail(this.routeQuery('msgId')).then(res => {
        this.praxis = res.praxis
      })
    }
  }
</script>
