<template>
  <Page title="网络访问白名单"
        hasAdd
        @add="onAdd">
    <ItemList v-for="(u,i) in urls"
              :key="i">
      <span slot="title">{{u.description}}</span>
      <span slot="main">{{u.url}}</span>
      <i slot="after"
         class="ico ico-delete"
         @click="onDelete"></i>
    </ItemList>
  </Page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    data() {
      return { urls: [] }
    },
    created() {
      Api.getVpadInternetList(this.routeQuery('schoolId')).then(res => {
        this.urls = res.urls || []
      })
    },
    methods: {
      onAdd() {
        this.$prompt(' ', '添加', {
          inputPlaceholder: '请输入网址',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            Api.modifyVpadApp({
              urls: [
                {
                  url: value,
                  schoolId: this.routeQuery('schoolId')
                }
              ]
            }).then(res => {
              if (Check.isRealArray(res.urls)) {
                this.urls = [...this.urls, ...res.urls]
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
            })
          })
          .catch(() => {})
      },
      onDelete(u) {
        Api.modifyInternetUrl({
          urls: [{ ...u, status: 'd' }]
        }).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
        })
      }
    }
  }
</script>
