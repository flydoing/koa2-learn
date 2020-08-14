<template>
  <!-- 综合题 -->
  <div class="compose">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <div v-if="question.questions.length>0"
         v-for="(cq, k) in question.questions"
         :key="k"
         class="compose-children">
      <!-- <div :is="getPraxiStyle(cq.type)" :question="cq" :serial="k" :praxisId="praxisId" :isCompose="true"></div> -->
      <CommonPraxis :praxisType="getPraxiStyle(cq.type)"
                    :question="cq"
                    :serial="k"
                    :praxisId="praxisId"
                    :isCompose="true" />
    </div>
    <div class="compose-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    props: {
      question: {
        type: Object,
        default() {
          return {}
        }
      },
      serial: {
        type: Number,
        default: null
      },
      praxisId: {
        type: [Number, String],
        default: null
      },
      isAnaly: {
        type: Boolean,
        default: false
      },
      isCompose: {
        type: Boolean,
        default: false
      },
      isFromPraxis: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .compose {
    padding: 0 rem(10);
    &-children {
      margin-bottom: rem(5);
      border: 1px solid #ededed;
    }
    &-readCount {
      padding: 0 rem(10) rem(10);
    }
  }
</style>
