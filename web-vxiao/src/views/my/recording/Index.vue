<template>
  <Page title="录播"
        @scrollEnd="scrollEnd"
        :showTips="messages.length === 0">
    <CardRecording v-for="(m,i) in messages"
                   :key="i"
                   :message="m" />
  </Page>
</template>
<script>
  import Api from '@/views/business/1279/api'
  export default {
    components: {
      // Card2018: resolve => require(['@/views/business/1280/Card'], resolve)
      CardRecording: resolve => require(['./Card'], resolve)
    },
    data() {
      return {
        messages: [],
        currentPage: 1,
        hasNextPage: 1
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.hasNextPage === 0) {
          return
        }
        Api.getRecodeList(this.currentPage).then(res => {
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.currentPage = res.currentPage
          } else {
            this.hasNextPage = 0
          }
          this.messages = [...this.messages, ...res.messages]
          this.messages.map(m => {
            m.msgJson = JSON.parse(m.msgJson)
          })
        })
      },
      scrollEnd() {
        this.init()
      }
    }
  }
</script>
