<template>
  <Card :message="message">
    <CardHref slot="href"
              v-if="button"
              :content="button.text"
              @click="button.handle" />
    <template slot="counter">
      <span>已交{{message.readCount}}</span>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    computed: {
      button() {
        let m = this.message
        if (this.isAdmin || m.readed === 1) {
          return {
            text: '查看详情',
            handle: this.handleDetail
          }
        }
        return {
          text: '提交任务',
          handle: this.handleCommitTask
        }
      }
    },
    methods: {
      handleDetail() {
        this.routePushModel({
          name: 'detail1129',
          params: {
            msgId: this.message.id
          }
        })
      },
      handleCommitTask() {
        this.routePushModel({
          name: 'commitTask1129',
          params: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
