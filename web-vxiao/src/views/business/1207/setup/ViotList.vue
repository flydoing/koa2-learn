<template>
  <Page title="物联网列表" v-loading.fullscreen.lock="loading">
    <Tabs theme="theme-1">
      <TabPane v-for="(v,i) in categorys" :key="i" :label="v.name">
        <div class="category-title"></div>
        <item v-for="(viot,i) in v.viots" :key="i" @click="handle(viot)">
          <div slot="main">{{viot.name}}</div>
          <div slot="remark">{{viot.count}}</div>
        </item>
        <item @click="handleAdd(v)">
          <div slot="main">添加</div>
        </item>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    components: {
      Tabs: resolve => require(['@/components/tab/Tab'], resolve),
      TabPane: resolve => require(['@/components/tab/TabPane'], resolve)
    },
    data() {
      return {
        $m: null,
        categorys: {},
        loading: true
      }
    },
    created() {},
    methods: {
      handle(viot) {
        this.routePush({
          path: `/vx/group/business/1207/viots/detail/${viot.categoryType}`,
          query: viot
        })
      },
      handleAdd(viot) {
        this.routePush({
          path: `/vx/group/business/1207/viots/add/${viot.extension}`,
          query: {
            name: 'viotAdd',
            categoryId: viot.id,
            categoryType: viot.extension,
            schoolId: this.routeQuery('schoolId'),
            placeId: this.routeParam('placeId')
          }
        })
      }
    },
    mounted() {
      const that = this
      const placeId = this.routeParam('placeId')
      Api.getViotList(placeId).then(res => {
        that.loading = false
        if (Check.isNullObject(res.categorys)) {
          that.$m = that.$message({
            duration: 0,
            message: '暂无数据',
            type: 'error'
          })
        } else {
          that.categorys = res.categorys
        }
      })
    },
    beforeDestroy() {
      this.$m && this.$m.close()
    }
  }

</script>
