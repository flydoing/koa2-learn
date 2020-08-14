<template>
  <page title="阅读详情">
    <div class="read-detail">
      <div class="category-title"></div>
      <div class="read-title"
           v-html="praxis.title"></div>
      <div class="read-content"
           v-html="praxis.content"
           @click="ProxyClickSpan($event)"></div>
      <div class="category-title"></div>
      <div class="praxis-list">
        <!-- <div :is="getPraxiStyle(question.type)" class="praxis" v-if="questions.length>0" v-for="(question, q) in questions" :key="q"
          :question="question" :serial="q" :praxisId="praxis.id"></div> -->
        <template v-if="questions.length>0">
          <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                        class="praxis"
                        v-for="(question, q) in questions"
                        :key="q"
                        :question="question"
                        :serial="q"
                        :praxisId="praxis.id" />
        </template>
      </div>
    </div>
  </page>
</template>
<script>
  import Mixin1047 from '@/views/business/1047/mixin'
  import PraxisApi from '@/views/business/1047/api'
  export default {
    mixins: [Mixin1047],
    data() {
      return {
        praxis: {},
        questions: [],
        annotationContent: null
      }
    },
    created() {
      PraxisApi.getTeacherDetail(this.routeQuery('msgId'))
        .then(res => {
          this.praxis = res.praxis
          this.questions = res.praxis.questions
        })
        .catch(res => {})
    },
    methods: {
      ProxyClickSpan(event) {
        if (event.target.nodeName === 'SPAN') {
          let k = event.target.getAttribute('k')
          this.routePush({
            name: 'annotation1069',
            query: {
              msgId: this.routeQuery('msgId'),
              k: k
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .read-detail {
    .read-title {
      font-size: rem(16);
      padding: rem(10);
      border-bottom: rem(1) solid #ededed;
      background-color: #fff;
    }
    .read-content {
      padding: rem(10);
      .postil {
        @include fc;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .praxis-list {
      background-color: #ededed;
      .praxis {
        margin-bottom: rem(10);
        background-color: #fff;
      }
    }
  }
</style>
