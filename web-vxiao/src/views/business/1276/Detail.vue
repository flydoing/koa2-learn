<template>
  <page title="详情">
    <div class="vscreen-detail pd">
      <div class="vd-title">{{message.title}}</div>
      <div class="vd-sub-title">
        <span class="text-color has-click"
              v-html="message.categoryName || message.businessName"></span>
        <span class="text-label f12">{{time}}</span>
      </div>
      <div class="vd-content"
           v-html="content"></div>
      <div class="vd-images">
        <img v-for="(item,i) in message.medias"
             :item="item"
             :key="i"
             v-lazy="{src:toImage(item)}"
             alt='image' />
      </div>
      <div class="vd-operate-bar">
        <div class="op-left">举报</div>
        <div class="op-right">已阅（{{message.readCount}}）
          <i class="ico ico-heart"
             @click="handlePraise"></i> {{message.praiseCount}}
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
      handlePraise() {},
      toImage(item) {
        return this.url(item.fileId)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vscreen-detail {
    .vd-title {
      padding: rem(5) 0;
    }
    .vd-sub-title {
      margin-bottom: rem(5);
    }
    .vd-content {
      text-align: justify;
    }
    .vd-images img {
      max-width: 100% !important;
      margin-top: rem(5);
    }
    .vd-operate-bar {
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
      .praise-Icon {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
</style>
