<template>
  <Page :title="screen.placeName">
    <label slot="btn" @click="unband">解绑</label>
    <Item :hasClick="false">
      <div>场所</div>
      <div slot="remark">{{screen.placeName}}</div>
    </Item>
    <Item :hasClick="false">
      <div>序列号</div>
      <div slot="remark">{{screen.serialNumber}}</div>
    </Item>
    <Item :hasClick="false">
      <div>类型</div>
      <div slot="remark">{{screen.categoryName}}</div>
    </Item>
    <Item :hasClick="false">
      <div>运行状态</div>
      <div slot="remark" :class="{'error':screen.extension==='0'}">
        {{screen.extension==='0'?'离线':'在线'}}
      </div>
    </Item>
    <div class="category-title"></div>
    <Item v-for="(b,i) in bannars" :key="i" :hasClick="false">
      <div>{{b.name}}</div>
      <div slot="remark">{{b.count}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() { return { screen: {}, bannars: [] } },
    created() {
      this.screen = this.$route.query
      Api.getScreenBannerCount(this.screen.id).then(res => {
        this.bannars = res.datas
      }).catch(res => {})
    },
    methods: {
      unband() {
        Api.bind({
          screens: [{
            id: this.screen.id,
            status: 'd'
          }]
        }).then(res => {
          this.$message({ type: 'success', message: '解绑成功' })
          this.routeBack()
        })
      }
    }
  }

</script>
