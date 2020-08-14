<template>
  <page :title="titleText">
    <item v-if="datas.length>0" v-for="(data, d) in datas" :key="d" @click="itemClick(data)">
      <div>{{data.name}}</div>
      <div slot="remark" v-if="data.count">{{data.count}}</div>
    </item>
  </page>
</template>
<script>
import Api from './api'
export default {
  data() {
    return {
      titleText: '',
      datas: []
    }
  },
  created() {
    this.titleText = this.routeQuery('text')
    Api.loadCatalog(this.routeQuery('cGroupId'), this.routeQuery('range')).then(res => {
      this.datas = res.categorys
    })
  },
  methods: {
    itemClick(data) {
      this.routePushModel({
        name: 'courseSelectPublishList',
        query: {
          appType: this.routeQuery('appType'),
          cGroupId: this.routeQuery('cGroupId'),
          categoryId: data.id,
          categoryName: data.name
        }
      })
    }
  }
}

</script>
