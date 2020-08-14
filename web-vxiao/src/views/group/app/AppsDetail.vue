<template>
  <component :app="app"
             :hasSearch="hasSearch"
             :is="$options.components[getAppDetailType(type)]"></component>
</template>
<script>
  import R from '../mixin'
  export default {
    mixins: [R],
    components: {
      AppDetail: resolve => require(['./AppDetail'], resolve),
      AppDetail1046: resolve => require(['@/views/business/1046/AppList'], resolve),
      AppDetail1049: resolve => require(['@/views/business/1049/AppDetail'], resolve),
      AppDetail1123: resolve => require(['@/views/business/1123/AppDetail'], resolve),
      AppDetail1137: resolve => require(['@/views/business/1137/AppDetail'], resolve),
      AppDetail1144: resolve => require(['@/views/business/1144/AppDetail'], resolve),
      AppDetail1131: resolve => require(['@/views/business/1131/AppDetail'], resolve),
      AppDetail1132: resolve => require(['@/views/business/1132/AppDetail'], resolve),
      AppDetail1165: resolve => require(['@/views/business/1165/AppDetail'], resolve),
      AppDetail1158: resolve => require(['@/views/business/1158/AppDetail'], resolve),
      AppDetail1160: resolve => require(['@/views/business/1160/AppDetail'], resolve),
      AppDetail1162: resolve => require(['@/views/business/1162/AppDetail'], resolve),
      AppDetail1189: resolve => require(['@/views/business/1189/AppDetail'], resolve),
      AppDetail1227: resolve => require(['@/views/business/1227/AppDetail'], resolve),
      AppDetail1216: resolve => require(['@/views/business/1216/AppDetail'], resolve),
      AppDetail1217: resolve => require(['@/views/business/1217/AppDetail'], resolve),
      AppDetail1218: resolve => require(['@/views/business/1218/AppDetail'], resolve),
      AppDetail1229: resolve => require(['@/views/business/1229/AppDetail'], resolve),
      AppDetail1226: resolve => require(['@/views/business/1226/AppDetail'], resolve), // vpos
      AppDetail1243: resolve => require(['@/views/business/1243/AppDetail'], resolve),
      AppDetail1221: resolve => require(['@/views/business/1221/AppDetail'], resolve),
      AppDetail1204: resolve => require(['@/views/business/1204/AppDetail'], resolve),
      AppDetail1207: resolve => require(['@/views/business/1207/AppDetail'], resolve),
      AppDetail1246: resolve => require(['@/views/business/1246/AppDetail'], resolve),
      AppDetail1264: resolve => require(['@/views/business/1264/AppDetail'], resolve),
      AppDetail1251: resolve => require(['@/views/business/1251/AppDetail'], resolve),
      AppDetail1253: resolve => require(['@/views/business/1253/AppDetail'], resolve),
      AppDetail115003: resolve => require(['@/views/business/1150/AppDetail'], resolve),
      AppDetail1279: resolve => require(['@/views/business/1279/AppDetail'], resolve),
      AppDetail1282: resolve => require(['@/views/business/1282/AppDetail'], resolve),
      AppDetail1283: resolve => require(['@/views/business/1283/AppDetail'], resolve),
      AppDetail1285: resolve => require(['@/views/business/1285/AppDetail'], resolve),
      AppDetail1284: resolve => require(['@/views/business/1284/AppDetail'], resolve),
      AppDetail1289: resolve => require(['@/views/business/1289/AppDetail'], resolve), // 行事历
      AppDetail1245: resolve => require(['@/views/business/1245/AppDetail'], resolve),
      AppDetail10038: resolve => require(['@/views/business/10038/AppDetail'], resolve),
      AppDetail10000: resolve => require(['@/views/business/report/Index'], resolve)
    },
    computed: {
      hasSearch() {
        let version = window.dataModule
        if (version.indexOf('chinamobile.html') !== -1) {
          return false
        }
        return true
      },
      type() {
        return this.routeQuery('appType') || this.currentApp.type
      },
      app() {
        return this.$store.getters.getAppByType(this.type, this.routeQuery('groupId') || this.groupId)
      }
    },
    created() {},
    methods: {
      getAppDetailType(type) {
        return this.$options.components[`AppDetail${type}`] ? `AppDetail${type}` : 'AppDetail'
      }
    }
  }
</script>
