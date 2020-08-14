<template>
  <Page title="缴费">
    <Item :hasClick="false">
      <div>金额</div>
      <div slot="remark">{{total}}</div>
    </Item>
    <div class="category-title text">缴费对象</div>
    <ItemList v-for="u in appPayUsers"
              :key="u.userId"
              @click="onUser(u)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(u.avatar,'thumb'),error:Image.ICO_AVATAR}"
           alt='LOGO'>
      <span slot="title">{{u.name}}</span>
      <span slot="main">{{u.groupName}}</span>
      <span slot="remark">{{u.status==='1'?'未缴':'已缴'}}</span>
      <template slot="after"
                v-if="v.status!=='1'"></template>
    </ItemList>
  </Page>
</template>
<script>
  import http from '@/utils/http'
  export default {
    data() {
      return {
        total: 0,
        appPayUsers: []
      }
    },
    activated() {
      this.total = this.routeQuery('total') || 0
      http.get(`/business/appPay/query/user/${this.routeQuery('msgId')}`).then(res => {
        this.appPayUsers = res.appPayUsers
      })
    },
    methods: {
      onUser(u) {
        if (u.status === '1') {
          this.$message({ type: 'warning', message: '请使用App进行缴费' })
        }
      }
    }
  }
</script>
