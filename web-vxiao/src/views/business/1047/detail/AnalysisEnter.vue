<template>
  <div class="analy-enter" @click="analysClick" v-if="!isAnaly">查看解析</div>
</template>
<script>
  export default {
    props: {
      questionId: {
        type: [Number, String],
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
      quetionData: {
        type: Object,
        default: null
      }
    },
    methods: {
      analysClick() {
        this.setStorage('question', this.quetionData)
        this.routePush({
          name: 'praxiAnaly1047',
          query: {
            questionId: this.questionId,
            praxisId: this.praxisId
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .analy-enter {
    padding: 0 rem(10) rem(10);
    color: nth($background,3);
    cursor: pointer;
  }

</style>
