<template>
  <div class="vx-questionaire">
    <slot>
      <template v-for="(q, i) in questions">
        <component v-if="$options.components[getType(q.type)]"
                   :question="q"
                   :key="i"
                   :index='i'
                   :params="getParams(getType(q.type))"
                   :is="$options.components[getType(q.type)]"
                   @analysis="handleAnalysis"></component>
      </template>
    </slot>
  </div>
</template>
<script>
  import m from './mixin'
  export default {
    mixins: [m],
    props: {
      questions: {
        type: Array,
        default() {
          return []
        }
      },
      obj: {
        type: Object,
        default() {
          return {}
        }
      }
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
      },
      handleAnalysis(question) {
        this.$emit('analysis', question)
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/praxis_line';
  @import '~scss/questionaire';
</style>
