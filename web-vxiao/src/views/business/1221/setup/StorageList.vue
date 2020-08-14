<template>
  <Page :title="title">
    <div class="storage-list">
      <item v-for="(s,i) in rule(storages)"
            :key="i"
            @click="clickStorage(s)">
        <div slot="main">{{s.name}}</div>
        <div slot="remark"
             class="ellipsis">{{s.placeholder}}</div>
      </item>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    components: {
      Box: resolve => require(['./Box'], resolve)
    },
    created() {
      // 设置请求头
      if (this.routeQuery('tokenId')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      this.schoolId = this.routeQuery('schoolId')
      this.title = this.routeQuery('title')
      this.getStorages()
    },
    data() {
      return {
        box: {},
        storages: [],
        allots: [],
        hasMore: true,
        title: '储物柜列表'
      }
    },
    methods: {
      clickStorage(s) {
        this.routePush({
          name: 'boxInfo',
          query: {
            title: s.name,
            boxId: s.id,
            ...this.$route.query
          }
        })
      },
      rule(storages) {
        return storages.map(s => {
          return {
            ...s,
            ...{ placeholder: `可分配 ${s.allotCount} / ${s.ableCount}` }
          }
        })
      },
      getStorages(currentIndex = 1) {
        const that = this
        const loading = that.$loading({
          text: '加载中'
        })
        Api.loadStorages(that.schoolId, currentIndex)
          .then(res => {
            loading.close()
            that.hasMore = !Check.isLength(res.boxs, 20)
            if (Check.isRealArray(res.boxs)) {
              that.storages = [...that.storages, ...res.boxs]
            } else {
              that.$message.warning({ message: '暂无可分配的储物柜' })
              that.$router.go(-1)
            }
          })
          .catch(res => loading.close())
      }
    }
  }
</script>
