<template>
  <keep-alive>
    <component :is="$options.components[getSetupType(type)]"></component>
  </keep-alive>
</template>
<script>
  export default {
    components: {
      Setup: resolve => require(['./Default'], resolve),
      Setup1001: resolve => require(['@/views/business/1001/AppSetup'], resolve),
      Setup1002: resolve => require(['@/views/business/1002/setup/Index'], resolve),
      Setup1005: resolve => require(['@/views/business/1005/AppSetup'], resolve),
      Setup1011: resolve => require(['@/views/business/1011/AppSetup'], resolve),
      Setup1039: resolve => require(['@/views/business/1039/AppSetup'], resolve),
      Setup1048: resolve => require(['@/views/business/1048/AppSetup'], resolve),
      Setup1049: resolve => require(['@/views/business/1049/AppSetup'], resolve),
      Setup1055: resolve => require(['@/views/business/1055/setup/Index'], resolve),
      Setup1058: resolve => require(['@/views/business/1058/setup/Index'], resolve),
      Setup1073: resolve => require(['@/views/business/1073/setup/Index'], resolve),
      Setup1104: resolve => require(['@/views/business/1104/AppSetup'], resolve),
      Setup1105: resolve => require(['@/views/business/1105/AppSetup'], resolve),
      Setup1109: resolve => require(['@/views/business/1109/AppSetup'], resolve),
      Setup1123: resolve => require(['@/views/business/1123/setup/Index'], resolve),
      Setup1127: resolve => require(['@/views/business/1127/AppSetup'], resolve),
      Setup1131: resolve => require(['@/views/business/1131/setup/Index'], resolve),
      Setup1141: resolve => require(['@/views/business/1141/AppSetup'], resolve),
      Setup1142: resolve => require(['@/views/business/1142/AppSetup'], resolve),
      Setup1144: resolve => require(['@/views/business/1144/AppSetup'], resolve),
      Setup1145: resolve => require(['@/views/business/1145/AppSetup'], resolve),
      Setup1148: resolve => require(['@/views/business/1148/AppSetup'], resolve),
      Setup1149: resolve => require(['@/views/business/1149/AppSetup'], resolve),
      Setup1150: resolve => require(['@/views/business/1150/AppSetup'], resolve),
      Setup1158: resolve => require(['@/views/business/1158/AppSetup'], resolve),
      Setup1162: resolve => require(['@/views/business/1162/AppSetup'], resolve),
      Setup1170: resolve => require(['@/views/business/1170/AppSetup'], resolve),
      Setup1178: resolve => require(['@/views/business/1178/AppSetup'], resolve),
      Setup1186: resolve => require(['@/views/business/1186/setup/Index'], resolve),
      Setup1192: resolve => require(['@/views/business/1192/setup/Index'], resolve),
      Setup1196: resolve => require(['@/views/business/1196/AppSetup'], resolve),
      Setup1197: resolve => require(['@/views/business/1197/AppSetup'], resolve),
      Setup1203: resolve => require(['@/views/business/1203/AppSetup'], resolve),
      Setup1209: resolve => require(['@/views/business/1209/AppSetup'], resolve),
      Setup1211: resolve => require(['@/views/business/1211/AppSetup'], resolve),
      Setup1216: resolve => require(['@/views/business/1216/AppSetup'], resolve),
      Setup1224: resolve => require(['@/views/business/1224/AppSetup'], resolve),
      Setup1225: resolve => require(['@/views/business/1225/AppSetup'], resolve),
      Setup1228: resolve => require(['@/views/business/1228/AppSetup'], resolve),
      Setup1230: resolve => require(['@/views/business/1230/AppSetup'], resolve),
      Setup1234: resolve => require(['@/views/business/1234/AppSetup'], resolve),
      Setup1235: resolve => require(['@/views/business/1235/AppSetup'], resolve),
      Setup1236: resolve => require(['@/views/business/1236/AppSetup'], resolve),
      Setup1237: resolve => require(['@/views/business/1237/AppSetup'], resolve),
      Setup1238: resolve => require(['@/views/business/1238/AppSetup'], resolve),
      Setup1240: resolve => require(['@/views/business/1240/setup/Index'], resolve),
      Setup1248: resolve => require(['@/views/business/1248/AppSetup'], resolve),
      Setup1260: resolve => require(['@/views/business/1260/AppSetup'], resolve),
      Setup1264: resolve => require(['@/views/business/1264/AppSetup'], resolve),
      Setup1207: resolve => require(['@/views/business/1207/AppSetup'], resolve),
      Setup115003: resolve => require(['@/views/business/1150/AppSetup'], resolve),
      Setup1253: resolve => require(['@/views/business/1253/AppSetup'], resolve),
      Setup1246: resolve => require(['@/views/business/1246/AppSetup'], resolve),
      Setup1279: resolve => require(['@/views/business/1279/AppSetup'], resolve),
      Setup1285: resolve => require(['@/views/business/1285/AppSetup'], resolve),
      Setup1283: resolve => require(['@/views/business/1283/AppSetup'], resolve),
      Setup1288: resolve => require(['@/views/business/1288/AppSetup'], resolve),
      Setup1245: resolve => require(['@/views/business/1245/AppSetup'], resolve),
      Setup1300: resolve => require(['@/views/business/1300/AppSetup'], resolve),
      Setup10038: resolve => require(['@/views/business/10038/AppSetup'], resolve),
      Setup10039: resolve => require(['@/views/business/10039/AppSetup'], resolve),
      Setup10040: resolve => require(['@/views/business/10040/AppSetup'], resolve),
      Setup10041: resolve => require(['@/views/business/10041/AppSetup'], resolve),
      Setup10042: resolve => require(['@/views/business/10042/AppSetup'], resolve)
    },
    data() {
      return {
        type: this.routeQuery('appType')
      }
    },
    created() {
      this.type = this.routeQuery('appType')
    },
    methods: {
      getSetupType(type) {
        return this.$options.components[`Setup${type}`] ? `Setup${type}` : 'Setup'
      }
    }
  }
</script>
