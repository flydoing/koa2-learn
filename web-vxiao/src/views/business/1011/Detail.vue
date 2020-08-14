<template>
  <CardDetail :m="message"
              v-if="message"
              title="动态详情">
    <div class="notice-detail pd">
      <div class="nd-title">{{message.title}}</div>
      <div class="nd-sub-title">
        <span class="text-color has-click"
              v-html="message.categoryName || message.businessName"></span>
        <span class="text-label f12">{{time}}</span>
      </div>
      <div class="nd-content"
           v-html="content"></div>
    </div>
  </CardDetail>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [R],
    components: {
      CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve)
    },
    data() {
      return {
        message: {}
      }
    },
    computed: {
      content() {
        return this.message.htmlContent || this.message.content
      },
      time() {
        return DateUtils.converFormat(new Date(this.message.createTime))
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
  .notice-detail {
    .nd-title {
      padding: rem(5) 0;
    }
    .nd-sub-title {
      margin-bottom: rem(5);
    }
    .nd-content {
      text-align: justify;
    }
  }
</style>
