<template>
  <page title="公文详情">
    <div class="document-detail pd">
      <div class="dd-title" v-html="message.title"></div>
      <div class="dd-num">编号：{{message.extensionType}}</div>
      <div class="dd-sub-title">{{message.categoryName}}
        <label v-html="time"></label>
      </div>
      <div class="dd-content ql-editor" v-html="content"></div>
      <div class="dd-reply" v-for="(reply,i) in replies" :key="i">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
      <div class="dd-remark" v-html="message.remark"></div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'

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
        if (this.message) {
          return DateUtils.format(this.message.createTime, DateUtils.YMD)
        }
        return ''
      },
      replies() {
        let rs = []
        if (this.message && Check.isRealArray(this.message.replys)) {
          this.message.replys.map(v => {
            if (v.fromClientId === 'system') {
              let cnt = v.content.substring(v.content.indexOf('：') + 1)
              rs.push({
                fromUserName: v.fromUserName,
                content: cnt
              })
            }
          })
        }
        return rs
      }
    },
    created() {
      let msgId = this.routeParam('msgId')
      MessageApi.getMessageById(msgId).then(res => {
        this.message = res.message
      })
    },
    methods: {}
  }

</script>
<style lang="scss" scoped>
  @import "~scss/_mixin";
  .document-detail {
    padding-top: rem(10);
    .dd-title, .dd-num {
      margin-top: rem(5);
    }
    .dd-sub-title {
      label {
        color: #999;
        font-size: rem(12);
      }
    }
    .dd-content.ql-editor {
      margin: rem(10) 0 rem(5) 0;
      text-align: justify;
      padding: 0!important;
      max-height: none!important;
      min-height:  none!important;
      img {
        display: inline-block!important;
      }
    }
  }

</style>
