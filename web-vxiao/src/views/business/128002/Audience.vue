<template>
  <Page title="当前观众">
    <div class="audience-list">
      <!-- <div class="list-one"
           v-for="(item,i) in 321"
           :key="i">
        <img class="img"
             src="http://m.ipipa.cn/commons/file/cm7mcjq5ysdrf162zmchqrer?"
             alt="">
        <span class="name">郭测试</span>
      </div> -->
      <div class="list-one"
           v-for="(item,i) in userInfos"
           :key="i">
        <img class="img"
             v-lazy="{src:toAvatar(item.avatar),error:Image.ICO_USER}"
             alt="">
        <span class="name">{{item.name}}</span>
      </div>
    </div>
  </Page>
</template>
<script>
  import http from '@/utils/http'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        userInfos: [],
        msgId: ''
      }
    },
    activated() {
      this.msgId = this.routeQuery('msgId')
      http.get(`/business/streaming/audience/${this.msgId}`).then(res => {
        this.userInfos = res.userInfos
      })
    },
    methods: {
      toAvatar(value) {
        return this.url(value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .audience-list {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow: auto;
    margin: 0 auto;
  }
  .list-one {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 12px;
    .img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 10px;
    }
    .name {
      justify-content: center;
      margin-top: 4px;
      font-size: 14px;
    }
  }
</style>
