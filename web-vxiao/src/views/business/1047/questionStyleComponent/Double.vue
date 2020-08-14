<template>
  <!-- 多选题 -->
  <div class="multi-selection">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <OptionView :options="question.options"
                :isAnaly="isAnaly"
                :praxisId="praxisId"
                v-if="isTeacher"
                :questionType="question.type"
                :isFromPraxis="isFromPraxis" />
    <StudentOptionsView :options="question.options"
                        :praxisId="praxisId"
                        :questionType="question.type"
                        v-else />
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="isTeacher"
                   :quetionData="question"></AnalysisEnter>
    <div class="multi-selection-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  import CardMinxi from '@/views/group/mixin'
  export default {
    mixins: [Mixin1047, CardMinxi],
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
  .multi-selection {
    padding: 0 rem(10);
    &-readCount {
      padding-left: rem(10);
      padding-bottom: rem(10);
    }
  }
</style>
