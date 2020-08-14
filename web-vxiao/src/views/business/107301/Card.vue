<template>
  <Card :message="message">
    <div slot="contents" class="public-course-child-detail-bar" @click="commentDetailHandle">
      <div class="public-course-child-detail-bar-title">评分</div>
      <div class="public-course-child-detail-bar-content">{{(message.extensionType ? (message.extensionType.length>45 ? message.extensionType.slice(0, 45)+'...' : message.extensionType) : "")}}</div>
    </div>
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
    methods: {
      commentDetailHandle() {
        this.routePush({
          name: 'publicCourseCommentDetail1192',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .public-course-child-detail-bar {
    @include flex;
    width: 100%;
    margin: rem(8) auto;
    cursor: pointer;
    font-size: rem(14);
    height: rem(40);
    background-color: #f7f8fa;
    &-title {
      @include jc;
      @include ai;
      text-align: center;
      line-height: rem(40);
      flex: 2;
      color: #fff;
      background-color: #e66464;
    }
    &-content {
      flex: 15;
      @include ai;
      line-height: rem(40);
      padding: 0 rem(10);
      border-left: rem(1) solid #ccc;
    }
  }

</style>
