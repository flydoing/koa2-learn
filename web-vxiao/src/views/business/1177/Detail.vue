<template>
  <page :title="currentGroup.name">
    <div class="active-detail pd">
      <div class="ad-title">{{message.title}}</div>
      <div class="ad-sub-title">
        <span class="text-color has-click"
              v-html="message.categoryName || message.businessName"></span>
        <span class="text-label f12">{{time}}</span>
      </div>
      <div class="ad-content"
           v-html="content"></div>
      <div class="ad-operate-bar">
        <div class="op-left">举报</div>
        <div class="op-right">
          <span>已阅 {{message.readCount}}</span>
          <i class="ico ico-heart"
             @click="handlePraise" /> {{message.praiseCount}}
        </div>
      </div>
    </div>
    <div class="category-title"></div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import DateUtils from '@/utils/date'
  import TextUtils from '@/utils/text'

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
        return TextUtils.changeFlag(this.message.htmlContent || this.message.content)
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
  .active-detail {
    .ad-title {
      padding: rem(5) 0;
    }
    .ad-sub-title {
      margin-bottom: rem(5);
    }
    .ad-content {
      text-align: justify;
    }
    .ad-operate-bar {
      height: rem(25);
      line-height: rem(25);
      margin: rem(10) 0;
      @extend %clearfix;
      .op-left {
        float: left;
      }
      .op-right {
        float: right;
      }
    }
  }
</style>
