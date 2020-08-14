<template>
  <page title="微信群详情">
    <div class="document-detail pd">
      <div class="dd-title"></div>
      <div class="dd-num">人数：{{message.extensionType}}</div>
      <div class="dd-num">总数：{{message.extensionType}}</div>
      <div class="dd-num">平均：{{message.extensionType}}</div>
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
    data() {
      return {
        message: {}
      }
    },
    computed: {},
    created() {}
  }
</script>
<style lang="scss" scoped>
  .document-detail {
    padding-top: rem(10);
    .dd-title,
    .dd-num {
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
      padding: 0 !important;
      max-height: none !important;
      min-height: none !important;
      img {
        display: inline-block !important;
      }
    }
  }
</style>
