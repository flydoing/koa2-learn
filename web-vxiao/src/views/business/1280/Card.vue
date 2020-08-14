<template>
  <Card :message="message">
    <div v-lazy:background-image="bg"
         class="live-block"
         @click="onClick">
      <div :class="{'begin':message.status==='1','end':message.status==='6'}">
        <span>{{statusText}}</span>
      </div>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: Object
    },
    computed: {
      bg() {
        return '/static/live_.png'
      },
      statusText() {
        return this.message.status === 'u' ? '未开始' : this.message.status === '1' ? '正在直播' : '已结束'
      }
    },
    methods: {
      onClick() {
        // if (this.message.status === '6') {
        //   this.$message({ type: 'warning', message: '已结束' })
        //   return
        // }
        // old
        this.routePushModel({
          path: '/vx/group/business/1280/detail',
          query: {
            groupId: this.groupId,
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .live-block {
    width: rem(354);
    height: rem(200);
    position: relative;
    margin-top: rem(5);
    cursor: pointer;
    & > div {
      position: absolute;
      top: rem(5);
      right: rem(5);
      width: rem(90);
      height: rem(25);
      line-height: rem(25);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      text-align: right;
      padding: rem(0) rem(10);
      color: #fff;
      &:before {
        content: '';
        position: absolute;
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        top: rem(9);
        left: rem(10);
        background: nth($background, 10);
      }
      &.begin:before {
        background: #26c85e;
      }
      &.end:before {
        background: #fdcb34;
      }
    }
  }
</style>
