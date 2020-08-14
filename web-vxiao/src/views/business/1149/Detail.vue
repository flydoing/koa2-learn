<template>
  <page title="安全信息详情">
    <div class="security-detail">
      <div class="sd-content" v-html="content"></div>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import MessageApi from '@/api/message'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      message: {}
    }
  },
  computed: {
    content() {
      return this.message.htmlContent || this.message.content
    }
  },
  created() {
    let msgId = this.routeParam('msgId')
    MessageApi.getMessageById(msgId).then(res => {
      this.message = res.message
    })
  },
  methods: {
    handlePraise() {}
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.security-detail {
  .sd-content {
    text-align: justify;
    padding: rem(10);
  }
}

</style>
