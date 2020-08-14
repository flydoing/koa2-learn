<template>
  <page title="参考答案" hasSubmit @submit="submitAnswers">
    <TextInput placeholder="参考答案" :max="500" v-model="answer.content" />
  </page>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve)
    },
    computed: {
      ...mapGetters({
        cacheHomework: 'getHomework'
      })
    },
    data() {
      return {
        answer: {}
      }
    },
    created() {
      this.answer = JSON.parse(JSON.stringify(this.cacheHomework.remark.answer)) || {}
    },
    methods: {
      ...mapActions(['saveHomework']),
      submitAnswers() {
        if (!this.answer.content) {
          this.$message({
            type: 'warning',
            message: '参考答案内容不能为空'
          })
          return false
        }
        this.saveHomework({
          ...this.cacheHomework,
          remark: {
            ...this.cacheHomework.remark,
            answer: { ...this.answer }
          }
        })
        this.routeBack()
      }
    }
  }

</script>
