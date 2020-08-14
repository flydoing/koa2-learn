<template>
  <div class="common-praxis">
    <Single v-if="praxisType==='Single'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Double v-if="praxisType==='Double'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <AnswerQuestions v-if="praxisType==='AnswerQuestions'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Fill v-if="praxisType==='Fill'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Sorting v-if="praxisType==='Sorting'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Judge v-if="praxisType==='Judge'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Compose v-if="praxisType==='Compose'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <Matching v-if="praxisType==='Matching'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
    <TextSort v-if="praxisType==='TextSort'" :question="question" :serial="serial" :isAnaly="isAnaly" :praxisId="praxisId" :isCompose="isCompose" :isFromPraxis="isFromPraxis" />
  </div>
</template>
<script>
  export default {
    props: {
      praxisType: {
        type: String,
        default: ''
      },
      question: {
        type: Object,
        default: null
      },
      serial: {
        type: Number,
        default: null
      },
      isAnaly: {
        type: Boolean,
        default: false
      },
      praxisId: {
        type: [Number, String],
        default: null
      },
      isCompose: {
        type: Boolean,
        default: false
      },
      isFromPraxis: {
        type: Boolean,
        default: true
      },
      questionData: {
        type: Object,
        default: null
      }
    },
    components: {
      Single: resolve => require(['@/views/business/1047/questionStyleComponent/Single'], resolve),
      Double: resolve => require(['@/views/business/1047/questionStyleComponent/Double'], resolve),
      AnswerQuestions: resolve => require(['@/views/business/1047/questionStyleComponent/AnswerQuestions'], resolve),
      FillOld: resolve => require(['@/views/business/1047/questionStyleComponent/FillOld'], resolve),
      Fill: resolve => require(['@/views/business/1047/questionStyleComponent/Fill'], resolve),
      Sorting: resolve => require(['@/views/business/1047/questionStyleComponent/Sorting'], resolve),
      Judge: resolve => require(['@/views/business/1047/questionStyleComponent/Judge'], resolve),
      Compose: resolve => require(['@/views/business/1047/questionStyleComponent/Compose'], resolve),
      Matching: resolve => require(['@/views/business/1047/questionStyleComponent/Matching'], resolve),
      TextSort: resolve => require(['@/views/business/1047/questionStyleComponent/TextSort'], resolve)
    }
  }

</script>
