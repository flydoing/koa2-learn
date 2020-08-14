<template>
  <!-- 填空题 -->
  <div class="fill">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <OptionView :options="question.options"
                :isAnaly="isAnaly"
                :praxisId="praxisId"
                :questionType="question.type"
                v-if="isTeacher"
                :isFromPraxis="isFromPraxis" />
    <StudentOptionsView :options="question.options"
                        :praxisId="praxisId"
                        :questionType="question.type"
                        v-else />
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="showAnalyEnter()"
                   :quetionData="question"></AnalysisEnter>
    <div class="fill-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  import G from '@/views/group/mixin'
  export default {
    mixins: [Mixin1047, G],
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
  .fill {
    padding: 0 rem(10);
    &-readCount {
      padding: 0 rem(10) rem(10);
    }
  }
</style>
