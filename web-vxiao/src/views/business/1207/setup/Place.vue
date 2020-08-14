<template>
  <Page :loading="loading"
        title="场所">
    <div v-for="(v,k) in placeMap"
         :key="k">
      <div class="category-title">{{k}}</div>
      <item v-for="(place,i) in v"
            :key="i"
            @click="handle(place)">
        <div slot="main">{{place.name}}</div>
        <div slot="remark">{{place.count}}</div>
      </item>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        $m: null,
        placeMap: {},
        loading: true
      }
    },
    created() {
      // 设置请求头
      if (this.routeQuery('tokenId')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
    },
    methods: {
      handle(place) {
        this.routePush({
          name: 'viots',
          params: { placeId: place.id },
          query: { schoolId: this.routeParam('schoolId') }
        })
      }
    },
    mounted() {
      const that = this
      const schoolId = this.routeParam('schoolId')
      Api.getPlaceList(schoolId).then(res => {
        that.loading = false
        if (Check.isNullObject(res.placeMap)) {
          that.$m = that.$message({
            duration: 0,
            message: '暂无数据',
            type: 'error'
          })
        } else {
          that.placeMap = res.placeMap
        }
      })
    },
    beforeDestroy() {
      this.$m && this.$m.close()
    }
  }
</script>
