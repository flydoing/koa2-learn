<template>
  <Card :message="message">
    <span slot="name"
          class="text-color"
          v-if="message.isAnonymous">评价</span>
    <span slot="name"
          class="text-color"
          v-else>{{m.label}}</span>
    <template slot="point"></template>
    <CardHref slot="category"
              :content="message.categoryName"
              @click="handleHref" />
    <div slot="contents"
         class="public-course-child-detail-bar"
         @click="commentDetailHandle"
         v-if="m.fromUserId === userId || isAdmin">
      <div class="public-course-child-detail-bar-title">评分</div>
      <div class="public-course-child-detail-bar-content">
        {{(m.extensionType ? (m.extensionType.length>45 ? m.extensionType.slice(0, 45)+'...' : m.extensionType) : "")}}
      </div>
    </div>
  </Card>
</template>
<script>
  // v-if="m.fromUserId === userId && isAdmin   判断新建消息用户id是不是自己和判断是不是管理员
  // isAnonymous 是否匿名评价，如果打开，子消息卡片名字统一改成'评价'，头像不能点击,并且头像用默认头像，自评、多少人已评价描述隐藏
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
  @import "~scss/mixin";
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
