<template>
  <Page title="录播"
        :showTips="messages.length === 0">
    <Card2018 v-for="(m,i) in messages"
              :key="i"
              :message="m" />
  </Page>
</template>
<script>
  import Api from '@/views/business/1279/api'
  export default {
    components: {
      Card2018: resolve => require(['@/views/business/1280/Card'], resolve)
    },
    data() {
      return {
        messages: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        Api.getRecodeList().then(res => {
          this.messages = res.messages || []
        })
      }
    }
  }
</script>
