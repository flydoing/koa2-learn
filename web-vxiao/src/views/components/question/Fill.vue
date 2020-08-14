<template>
  <!-- 填空題 -->
  <div class="qt-item qt-fill">
    <div class="qt-title">
      <div>{{index + 1}}. </div>
      <div class="txt"
           v-html="question.title"></div>
    </div>
    <div class="qt-options"
         v-if="question.options">
      <div class="op-item"
           v-for="(op, i) in question.options"
           :key="i">
        <div class="op-sort">
          <template v-if="params.showResult">
            <i v-if="isCorrect(op)"
               class="ico ico-submit"></i>
            <i v-else
               class="ico ico-remove"></i>
          </template>
          第{{i + 1}}空：
        </div>
        <div v-if="params.canFill"
             class="op-content">
          <input placeholder="输入答案"
                 v-model="op.answerContent" />
        </div>
        <div v-else
             class="op-content"
             v-html="op.answerContent"></div>
      </div>
    </div>
    <slot name="link">
      <div class="qt-link">
        <span class="text-color is-click"
              @click="handleAnalysis">查看解析</span>
      </div>
    </slot>
  </div>
</template>
<script>
  export default {
    props: {
      question: {
        type: Object,
        default() {
          return {}
        }
      },
      index: {
        type: Number,
        default: 0
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {},
    methods: {
      isCorrect(option) {
        return option.answerContent === option.content
      },
      handleAnalysis() {
        this.$emit('analysis', this.question)
      }
    }
  }
</script>
