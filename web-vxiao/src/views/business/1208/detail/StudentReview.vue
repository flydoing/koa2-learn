<template>
  <page title="听写答题情况">
    <item :hasClick="false"><div>{{praxis.describe}}</div></item>
    <div class="student-answers">
      <div v-for="(question, k) in praxis.questions" :key="k" v-if="praxis.questions.length>0" class="student-answers-question">
        <div v-for="(option, o) in question.options" :key="o" v-if="question.options.length>0" class="student-answers-question-option">
          <i class="ico" :class="{'ico-ziyuan5': option.isCorrent !==1 , 'ico-submit': option.isCorrent===1}"></i>
          <div class="student-answers-content">
            <span>内容{{k+1}}：</span>{{option.answerContent}}</div>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        praxis: {}
      }
    },
    created() {
      Api.loadStudentDetail(this.routeQuery('msgId'), this.routeQuery('userId')).then(res => {
        this.praxis = res.praxis
      }).catch(res => {})
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .student-answers {
    padding: 0 rem(10);
    &-question {
      &-option {
        @include flex;
        @include ai;
        height: rem(40);
        line-height: rem(40);
        i {
          flex: 1;
          font-size: rem(15);
        }
        .ico-submit{
          color: #00A239;
          &:hover{
            color: #00A239;
          }
        }
        .ico-ziyuan5{
          color: red;
          font-size: rem(18);
          font-weight: bold;
          &:hover{
            color: red;
          }
        }
        span{
          color: #999;
        }
        .student-answers-content{
          flex: 20;
          border-bottom: 1px solid #ededed;
        }
      }
    }

  }

</style>
