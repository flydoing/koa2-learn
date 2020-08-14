<template>
  <div class="praxis-review">
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
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    props: {
      praxis: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>
