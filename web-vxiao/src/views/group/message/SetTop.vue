<template>
  <Page title="置顶">
    <Item @click="handle(4)">
      <div>置顶三小时</div>
    </Item>
    <Item @click="handle(5)">
      <div>置顶六小时</div>
    </Item>
    <Item @click="handle(1)">
      <div>置顶一天</div>
    </Item>
    <Item @click="handle(2)">
      <div>置顶三天</div>
    </Item>
    <Item @click="handle(3)">
      <div>置顶一周</div>
    </Item>
    <Item @click="handle(6)">
      <div>不限时长</div>
    </Item>
  </Page>
</template>
<script>
  import R from '../mixin'
  export default {
    mixins: [R],
    methods: {
      handle(t) {
        this.modifyMessage({
          id: this.routeQuery('msgId'),
          groupId: this.groupId,
          isTop: 1,
          topType: t
        }).then(res => {
          this.routeBack()
        })
      }
    }
  }

</script>
