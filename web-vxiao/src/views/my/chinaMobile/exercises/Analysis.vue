<template>
  <page title="解析">
    <div class="question-analysis">
      <Questions>
        <component v-if="$options.components[getType(question.type)] && question"
                   :question="question"
                   :index='qtIndex'
                   :params="getParams(getType(question.type))"
                   :is="$options.components[getType(question.type)]">
          <template slot='link'></template>
        </component>
      </Questions>
      <template v-if="question.rightAnswer">
        <div class="category-title text">正确答案</div>
        <div class="correct-answer"
             v-html="question.rightAnswer"></div>
      </template>
      <template v-if="question.explain">
        <div class="category-title text">解析</div>
        <div class="explain"
             v-html="question.explain"></div>
      </template>
    </div>
  </page>
</template>
<script>
  import QuestionMixin from '@/views/components/question/mixin'
  export default {
    mixins: [QuestionMixin],
    components: {
      Questions: resolve => require(['@/views/components/question/List'], resolve)
    },
    data() {
      return {
        question: null
      }
    },
    computed: {
      qtIndex() {
        return this.routeQuery('qtIndex') || 1
      }
    },
    created() {
      this.question = this.getStorage('_question_cache')
    },
    methods: {
      getParams(type) {
        let params = {}
        switch (type) {
          case 'Single':
          case 'Multiple':
          case 'Judge':
            params = {
              hasClick: false
            }
            break
          case 'Fill':
            params = {
              canFill: false,
              showResult: true
            }
            break
        }
        return params
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/praxis_line';
  .question-analysis {
    .correct-answer,
    .explain {
      padding: rem(5) rem(10);
      line-height: 1.5;
    }
  }
</style>
