<template>
  <keep-alive>
    <component :app="app"
               :is="$options.components[getCreateType(type)]"></component>
  </keep-alive>
</template>
<script>
  export default {
    components: {
      Create1001: resolve => require(['@/views/business/1001/AppCreate'], resolve),
      Create1005: resolve => require(['@/views/business/1005/AppCreate'], resolve),
      Create1006: resolve => require(['@/views/business/1006/AppCreate'], resolve),
      Create1007: resolve => require(['@/views/business/1007/AppCreate'], resolve),
      Create1011: resolve => require(['@/views/business/1011/AppCreate'], resolve),
      Create1016: resolve => require(['@/views/business/1016/AppCreate'], resolve),
      Create1034: resolve => require(['@/views/business/1034/AppCreate'], resolve),
      Create1039: resolve => require(['@/views/business/1039/AppCreate'], resolve),
      Create1040: resolve => require(['@/views/business/1040/AppCreate'], resolve),
      Create1042: resolve => require(['@/views/business/1042/AppCreate'], resolve),
      Create1046: resolve => require(['@/views/business/1046/AppCreate'], resolve),
      Create1048: resolve => require(['@/views/business/1048/AppCreate'], resolve),
      Create1049: resolve => require(['@/views/business/1049/AppCreate'], resolve),
      Create1051: resolve => require(['@/views/business/1051/AppCreate'], resolve),
      Create1062: resolve => require(['@/views/business/1062/AppCreate'], resolve),
      Create1064: resolve => require(['@/views/business/1064/AppCreate'], resolve),
      Create106501: resolve => require(['@/views/business/1065/AppCreate'], resolve),
      Create1079: resolve => require(['@/views/business/1079/AppCreate'], resolve),
      Create1081: resolve => require(['@/views/business/1081/AppCreate'], resolve),
      Create108501: resolve => require(['@/views/business/1085/AppCreate'], resolve),
      Create1093: resolve => require(['@/views/business/1093/AppCreate'], resolve),
      Create1096: resolve => require(['@/views/business/1096/AppCreate'], resolve),
      Create1098: resolve => require(['@/views/business/1098/AppCreate'], resolve),
      Create1099: resolve => require(['@/views/business/1099/AppCreate'], resolve),
      Create1102: resolve => require(['@/views/business/1102/AppCreate'], resolve),
      Create1104: resolve => require(['@/views/business/1104/AppCreate'], resolve),
      Create1105: resolve => require(['@/views/business/1105/AppCreate'], resolve),
      Create1109: resolve => require(['@/views/business/1109/AppCreate'], resolve),
      Create1117: resolve => require(['@/views/business/1117/AppCreate'], resolve),
      Create1118: resolve => require(['@/views/business/1118/AppCreate'], resolve),
      Create1119: resolve => require(['@/views/business/1119/AppCreate'], resolve),
      Create1123: resolve => require(['@/views/business/1123/AppCreate'], resolve),
      Create1129: resolve => require(['@/views/business/1129/AppCreate'], resolve),
      Create1137: resolve => require(['@/views/business/1137/AppCreate'], resolve),
      Create1138: resolve => require(['@/views/business/1138/AppCreate'], resolve),
      Create1141: resolve => require(['@/views/business/1141/AppCreate'], resolve),
      Create1142: resolve => require(['@/views/business/1142/AppCreate'], resolve),
      Create1143: resolve => require(['@/views/business/1143/AppCreate'], resolve),
      Create1147: resolve => require(['@/views/business/1147/AppCreate'], resolve),
      Create1148: resolve => require(['@/views/business/1148/AppCreate'], resolve),
      Create1149: resolve => require(['@/views/business/1149/AppCreate'], resolve),
      Create1144: resolve => require(['@/views/business/1144/AppCreate'], resolve),
      Create1150: resolve => require(['@/views/business/1150/AppCreate'], resolve),
      Create1153: resolve => require(['@/views/business/1153/AppCreate'], resolve),
      Create1160: resolve => require(['@/views/business/1160/AppCreate'], resolve),
      Create1162: resolve => require(['@/views/business/1162/AppCreate'], resolve),
      Create1164: resolve => require(['@/views/business/1164/AppCreate'], resolve),
      Create1165: resolve => require(['@/views/business/1165/AppCreate'], resolve),
      Create1169: resolve => require(['@/views/business/1169/AppCreate'], resolve),
      Create1155: resolve => require(['@/views/business/1155/AppCreate'], resolve),
      Create1174: resolve => require(['@/views/business/1174/AppCreate'], resolve),
      Create1176: resolve => require(['@/views/business/1176/AppCreate'], resolve),
      Create1178: resolve => require(['@/views/business/1178/AppCreate'], resolve),
      Create1184: resolve => require(['@/views/business/1184/AppCreate'], resolve),
      Create1194: resolve => require(['@/views/business/1194/AppCreate'], resolve),
      Create1196: resolve => require(['@/views/business/1196/AppCreate'], resolve),
      Create1203: resolve => require(['@/views/business/1203/AppCreate'], resolve),
      Create1211: resolve => require(['@/views/business/1211/AppCreate'], resolve),
      Create1212: resolve => require(['@/views/business/1212/AppCreate'], resolve),
      Create1222: resolve => require(['@/views/business/1222/AppCreate'], resolve),
      Create1224: resolve => require(['@/views/business/1224/AppCreate'], resolve),
      Create1225: resolve => require(['@/views/business/1224/AppCreate'], resolve),
      Create1230: resolve => require(['@/views/business/1230/AppCreate'], resolve),
      Create1235: resolve => require(['@/views/business/1235/AppCreate'], resolve),
      Create1002: resolve => require(['@/views/business/1002/AppCreate'], resolve),
      Create1186: resolve => require(['@/views/business/1186/AppCreate'], resolve),
      Create1237: resolve => require(['@/views/business/1237/AppCreate'], resolve),
      Create1003: resolve => require(['@/views/business/1003/AppCreate'], resolve),
      Create1192: resolve => require(['@/views/business/1192/AppCreate'], resolve),
      Create1055: resolve => require(['@/views/business/1055/AppCreate'], resolve),
      Create1058: resolve => require(['@/views/business/1058/AppCreate'], resolve),
      Create1181: resolve => require(['@/views/business/1181/AppCreate'], resolve),
      Create1073: resolve => require(['@/views/business/1073/AppCreate'], resolve),
      Create1047: resolve => require(['@/views/business/1047/AppCreate'], resolve),
      Create1189: resolve => require(['@/views/business/1189/AppCreate'], resolve),
      Create1158: resolve => require(['@/views/business/1158/AppCreate'], resolve),
      Create1234: resolve => require(['@/views/business/1234/AppCreate'], resolve),
      Create1247: resolve => require(['@/views/business/1247/AppCreate'], resolve),
      Create1248: resolve => require(['@/views/business/1248/AppCreate'], resolve),
      Create1255: resolve => require(['@/views/business/1255/AppCreate'], resolve),
      Create1257: resolve => require(['@/views/business/1257/AppCreate'], resolve),
      Create1260: resolve => require(['@/views/business/1260/AppCreate'], resolve),
      Create1261: resolve => require(['@/views/business/1261/AppCreate'], resolve),
      Create1264: resolve => require(['@/views/business/1264/AppCreate'], resolve),
      ResourceDefault: resolve => require(['@/views/business/resources/AppCreate'], resolve),
      Create1068: resolve => require(['@/views/business/1068/AppCreate'], resolve),
      Create1069: resolve => require(['@/views/business/1069/AppCreate'], resolve),
      Create1265: resolve => require(['@/views/business/1265/AppCreate'], resolve),
      Create1269: resolve => require(['@/views/business/1269/AppCreate'], resolve),
      Create1207: resolve => require(['@/views/business/1207/AppCreate'], resolve),
      Create1276: resolve => require(['@/views/business/1276/AppCreate'], resolve),
      // Create1278: resolve => require(['@/views/business/1278/AppCreate'], resolve),
      Create1280: resolve => require(['@/views/business/1280/AppCreate'], resolve),
      Create1283: resolve => require(['@/views/business/1283/AppCreate'], resolve),
      Create1284: resolve => require(['@/views/business/1284/AppCreate'], resolve),
      Create1285: resolve => require(['@/views/business/1285/AppCreate'], resolve),
      Create1287: resolve => require(['@/views/business/1287/AppCreate'], resolve),
      Create1289: resolve => require(['@/views/business/1289/AppCreate'], resolve),
      Create1293: resolve => require(['@/views/business/1293/AppCreate'], resolve),
      Create1300: resolve => require(['@/views/business/1300/AppCreate'], resolve),
      Create10039: resolve => require(['@/views/business/10039/AppCreate'], resolve),
      Create10040: resolve => require(['@/views/business/10040/AppCreate'], resolve),
      Default: resolve => require(['./Default'], resolve)
    },
    data() {
      return {
        app: {}
      }
    },
    computed: {
      type() {
        return this.app ? this.app.type : ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let type = this.routeQuery('appType')
        let groupId = this.routeQuery('groupId')
        this.app = this.$store.getters.getAppByType(type, groupId)
      },
      getCreateType(type) {
        let $create = this.$options.components[`Create${type}`]
        if ($create) {
          return `Create${type}`
        } else if (type === '1151' || type === '1043' || type === '1072' || type === '1156') {
          return `ResourceDefault`
        }
        return 'Default'
      }
    },
    watch: {
      '$route.params'() {
        this.init()
      }
    }
  }
</script>
