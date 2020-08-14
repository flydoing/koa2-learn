<template>
  <!-- 多选题 -->
  <div class="qt-item qt-multiple">
    <div class="qt-title">
      <slot name="title">
        <div>{{index + 1}}. </div>
        <div class="txt"
             v-html="question.title"></div>
      </slot>
    </div>
    <div class="qt-options"
         v-if="options.length > 0">
      <div class="op-item"
           v-for="(op, i) in options"
           :key="i"
           @click="handleOption(op, i)"
           :class="{'selected': op.selected, 'correct': isCorrect(op), 'error': isError(op)}">
        <div class="op-sort">{{op.serialNumber}}. </div>
        <div class="op-content"
             v-html="op.content"></div>
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
    computed: {
      serial() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(this.index)
      },
      options() {
        let qt = this.question
        if (qt.options) {
          return qt.options.sort((a, b) => {
            let v1 = a['serialNumber']
            let v2 = b['serialNumber']
            return v1.charCodeAt(0) - v2.charCodeAt(0)
          })
        }
        return []
      }
    },
    methods: {
      isCorrect(option) {
        return option.isCorrent === 1
      },
      isError(option) {
        return option.isCorrent === 0
      },
      handleAnalysis() {
        this.$emit('analysis', this.question)
      },
      handleOption(op, i) {
        if (this.params.hasClick) {
          op.selected = !op.selected
        }
      }
    }
  }
</script>
