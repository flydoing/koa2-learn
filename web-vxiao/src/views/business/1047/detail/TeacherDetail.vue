<template>
  <page title="答题情况">
    <item @click="describeClick">
      <div>{{praxis.describe}}</div>
      <div slot="remark">{{praxis.remark}}</div>
    </item>
    <!-- <PraxisListReview :praxis="praxis"></PraxisListReview> -->
    <template v-if="praxis.questions.length>0">
      <div class="praxis-review-box"
           v-for="(question, q) in praxis.questions"
           :key="q">
        <div class="category-title"></div>
        <!-- <div :is="getPraxiStyle(question.type)" :question="question" :serial="q" :praxisId="praxis.id"></div> -->
        <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                      :question="question"
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
    components: {
      PraxisListReview: resolve => require(['./PraxisListReview'], resolve)
    },
    data() {
      return {
        praxis: {}
      }
    },
    created() {
      Api.getTeacherDetail(this.routeQuery('msgId')).then(res => {
        this.praxis = res.praxis
      })
    },
    methods: {
      describeClick() {
        this.routePush({
          name: 'replyRanking1047',
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      }
    }
  }
</script>
