<template>
  <div class="card-list">
    <template v-for="m in ms">
      <component :message="m"
                 :key="m.id"
                 :is="$options.components[getCardType(m.type)]"></component>
    </template>
  </div>
</template>
<script>
  import Card from './Card'
  export default {
    props: {
      messages: {
        type: Array,
        default: () => {
          return []
        }
      },
      tip: { type: String, default: '暂无数据' },
      icon: { type: String, default: '/static/ico/icon_commoneuse.png' }
    },
    computed: {
      ms() {
        let arr = this.messages
        return arr.sort((a, b) => {
          a.isTop = a.isTop || 0
          b.isTop = b.isTop || 0
          if (b.isTop === a.isTop) {
            return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
          }
          return b.isTop - a.isTop
        })
      }
    },
    components: {
      Card,
      Card1001: resolve => require(['@/views/business/1001/Card'], resolve),
      Card1002: resolve => require(['@/views/business/1002/Card'], resolve),
      Card1003: resolve => require(['@/views/business/1003/Card'], resolve),
      Card1005: resolve => require(['@/views/business/1005/Card'], resolve),
      Card1006: resolve => require(['@/views/business/1006/Card'], resolve),
      Card1007: resolve => require(['@/views/business/1007/Card'], resolve),
      Card1011: resolve => require(['@/views/business/1011/Card'], resolve),
      Card1016: resolve => require(['@/views/business/1016/Card'], resolve),
      Card1033: resolve => require(['@/views/business/1033/Card'], resolve),
      Card1034: resolve => require(['@/views/business/1034/Card'], resolve),
      Card1035: resolve => require(['@/views/business/1035/Card'], resolve),
      Card1039: resolve => require(['@/views/business/1039/Card'], resolve),
      Card1040: resolve => require(['@/views/business/1040/Card'], resolve),
      Card1042: resolve => require(['@/views/business/1042/Card'], resolve),
      Card1044: resolve => require(['@/views/business/1044/Card'], resolve),
      Card1047: resolve => require(['@/views/business/1047/Card'], resolve),
      Card1048: resolve => require(['@/views/business/1048/Card'], resolve),
      Card1049: resolve => require(['@/views/business/1049/Card'], resolve),
      Card104901: resolve => require(['@/views/business/104901/Card'], resolve),
      Card1051: resolve => require(['@/views/business/1051/Card'], resolve),
      Card1058: resolve => require(['@/views/business/1058/Card'], resolve),
      Card1062: resolve => require(['@/views/business/1062/Card'], resolve),
      Card1064: resolve => require(['@/views/business/1064/Card'], resolve),
      Card106501: resolve => require(['@/views/business/106501/Card'], resolve),
      Card1068: resolve => require(['@/views/business/1068/Card'], resolve),
      Card1069: resolve => require(['@/views/business/1069/Card'], resolve),
      Card1073: resolve => require(['@/views/business/1073/Card'], resolve),
      Card1079: resolve => require(['@/views/business/1079/Card'], resolve),
      Card1081: resolve => require(['@/views/business/1081/Card'], resolve),
      Card1082: resolve => require(['@/views/business/1082/Card'], resolve),
      Card1083: resolve => require(['@/views/business/1083/Card'], resolve),
      Card1084: resolve => require(['@/views/business/1084/Card'], resolve),
      Card1085: resolve => require(['@/views/business/1085/Card'], resolve),
      Card108501: resolve => require(['@/views/business/108501/Card'], resolve),
      Card1088: resolve => require(['@/views/business/1088/Card'], resolve),
      Card1093: resolve => require(['@/views/business/1093/Card'], resolve),
      Card1096: resolve => require(['@/views/business/1096/Card'], resolve),
      Card1097: resolve => require(['@/views/business/1097/Card'], resolve),
      Card1102: resolve => require(['@/views/business/1102/Card'], resolve),
      Card1103: resolve => require(['@/views/business/1103/Card'], resolve),
      Card1104: resolve => require(['@/views/business/1104/Card'], resolve),
      Card1105: resolve => require(['@/views/business/1105/Card'], resolve),
      Card1107: resolve => require(['@/views/business/1107/Card'], resolve),
      Card1109: resolve => require(['@/views/business/1109/Card'], resolve),
      Card1111: resolve => require(['@/views/business/1111/Card'], resolve),
      Card1117: resolve => require(['@/views/business/1117/Card'], resolve),
      Card1119: resolve => require(['@/views/business/1119/Card'], resolve),
      Card1123: resolve => require(['@/views/business/1123/Card'], resolve),
      Card1127: resolve => require(['@/views/business/1127/Card'], resolve),
      Card1128: resolve => require(['@/views/business/1128/Card'], resolve),
      Card1129: resolve => require(['@/views/business/1129/Card'], resolve),
      Card1130: resolve => require(['@/views/business/1130/Card'], resolve),
      Card1138: resolve => require(['@/views/business/1138/Card'], resolve),
      Card1142: resolve => require(['@/views/business/1142/Card'], resolve),
      Card1143: resolve => require(['@/views/business/1143/Card'], resolve),
      Card114301: resolve => require(['@/views/business/114301/Card'], resolve),
      Card1144: resolve => require(['@/views/business/1144/Card'], resolve),
      Card114401: resolve => require(['@/views/business/114401/Card'], resolve),
      Card1149: resolve => require(['@/views/business/1149/Card'], resolve),
      Card1152: resolve => require(['@/views/business/1152/Card'], resolve),
      Card1153: resolve => require(['@/views/business/1153/Card'], resolve),
      Card1155: resolve => require(['@/views/business/1155/Card'], resolve),
      Card1158: resolve => require(['@/views/business/1158/Card'], resolve),
      Card1159: resolve => require(['@/views/business/1159/Card'], resolve),
      Card1164: resolve => require(['@/views/business/1164/Card'], resolve),
      Card1169: resolve => require(['@/views/business/1169/Card'], resolve),
      Card116401: resolve => require(['@/views/business/116401/Card'], resolve),
      Card1170: resolve => require(['@/views/business/1170/Card'], resolve),
      Card1176: resolve => require(['@/views/business/1176/Card'], resolve),
      Card1177: resolve => require(['@/views/business/1177/Card'], resolve),
      Card1178: resolve => require(['@/views/business/1178/Card'], resolve),
      Card1181: resolve => require(['@/views/business/1181/Card'], resolve),
      Card1184: resolve => require(['@/views/business/1184/Card'], resolve),
      Card1185: resolve => require(['@/views/business/1185/Card'], resolve),
      Card1186: resolve => require(['@/views/business/1186/Card'], resolve),
      Card1192: resolve => require(['@/views/business/1192/Card'], resolve),
      Card1194: resolve => require(['@/views/business/1194/Card'], resolve),
      Card1195: resolve => require(['@/views/business/1195/Card'], resolve),
      Card1196: resolve => require(['@/views/business/1196/Card'], resolve),
      Card1197: resolve => require(['@/views/business/1197/Card'], resolve),
      Card1198: resolve => require(['@/views/business/1198/Card'], resolve),
      Card1200: resolve => require(['@/views/business/1200/Card'], resolve),
      Card1203: resolve => require(['@/views/business/1203/Card'], resolve),
      Card1206: resolve => require(['@/views/business/1206/Card'], resolve),
      Card120601: resolve => require(['@/views/business/120601/Card'], resolve),
      Card120602: resolve => require(['@/views/business/120602/Card'], resolve),
      Card1208: resolve => require(['@/views/business/1208/Card'], resolve),
      Card1210: resolve => require(['@/views/business/1210/Card'], resolve),
      Card1211: resolve => require(['@/views/business/1211/Card'], resolve),
      Card1212: resolve => require(['@/views/business/1212/Card'], resolve),
      Card121201: resolve => require(['@/views/business/121201/Card'], resolve),
      Card1213: resolve => require(['@/views/business/1213/Card'], resolve),
      Card121301: resolve => require(['@/views/business/121301/Card'], resolve),
      Card1216: resolve => require(['@/views/business/1216/Card'], resolve),
      Card121601: resolve => require(['@/views/business/121601/Card'], resolve),
      Card1219: resolve => require(['@/views/business/1219/Card'], resolve),
      Card121901: resolve => require(['@/views/business/121901/Card'], resolve),
      Card1220: resolve => require(['@/views/business/1220/Card'], resolve),
      Card122001: resolve => require(['@/views/business/122001/Card'], resolve),
      Card1222: resolve => require(['@/views/business/1222/Card'], resolve),
      Card1224: resolve => require(['@/views/business/1224/Card'], resolve),
      Card1225: resolve => require(['@/views/business/1225/Card'], resolve),
      Card1230: resolve => require(['@/views/business/1230/Card'], resolve),
      Card1237: resolve => require(['@/views/business/1237/Card'], resolve),
      Card123701: resolve => require(['@/views/business/123701/Card'], resolve),
      Card1055: resolve => require(['@/views/business/1055/Card'], resolve),
      Card1165: resolve => require(['@/views/business/1165/Card'], resolve),
      Card1160: resolve => require(['@/views/business/1160/Card'], resolve),
      Card1162: resolve => require(['@/views/business/1162/Card'], resolve),
      Card1189: resolve => require(['@/views/business/1189/Card'], resolve),
      Card1135: resolve => require(['@/views/business/1135/Card'], resolve),
      Card1150: resolve => require(['@/views/business/1150/Card'], resolve),
      Card115001: resolve => require(['@/views/business/115006/Card'], resolve),
      Card115006: resolve => require(['@/views/business/115006/Card'], resolve),
      Card115007: resolve => require(['@/views/business/115006/Card'], resolve),
      Card1235: resolve => require(['@/views/business/1235/Card'], resolve),
      Card1190: resolve => require(['@/views/business/1190/Card'], resolve),
      Card1193: resolve => require(['@/views/business/1193/Card'], resolve),
      Card1246: resolve => require(['@/views/business/1246/Card'], resolve),
      Card1247: resolve => require(['@/views/business/1247/Card'], resolve),
      Card1234: resolve => require(['@/views/business/1234/Card'], resolve),
      Card1248: resolve => require(['@/views/business/1248/Card'], resolve),
      Card1255: resolve => require(['@/views/business/1255/Card'], resolve),
      Card1257: resolve => require(['@/views/business/1257/Card'], resolve),
      Card1260: resolve => require(['@/views/business/1260/Card'], resolve),
      Card1261: resolve => require(['@/views/business/1261/Card'], resolve),
      Card1264: resolve => require(['@/views/business/1264/Card'], resolve),
      Card126401: resolve => require(['@/views/business/1264/ChildCard'], resolve),
      Card1265: resolve => require(['@/views/business/1265/Card'], resolve),
      Card1269: resolve => require(['@/views/business/1269/Card'], resolve),
      Card1278: resolve => require(['@/views/business/1278/Card'], resolve),
      Card128001: resolve => require(['@/views/business/1280/Card'], resolve),
      Card128002: resolve => require(['@/views/business/128002/Card'], resolve),
      Card1283: resolve => require(['@/views/business/1283/Card'], resolve),
      Card128302: resolve => require(['@/views/business/128302/Card'], resolve),
      Card128401: resolve => require(['@/views/business/128401/Card'], resolve),
      Card1285: resolve => require(['@/views/business/1285/Card'], resolve),
      Card1287: resolve => require(['@/views/business/1287/Card'], resolve),
      Card128502: resolve => require(['@/views/business/1285/ChildCard'], resolve),
      Card1288: resolve => require(['@/views/business/1288/Card'], resolve),
      Card128801: resolve => require(['@/views/business/1288/ChildCard'], resolve),
      Card1289: resolve => require(['@/views/business/1289/Card'], resolve),
      Card1293: resolve => require(['@/views/business/1293/Card'], resolve),
      Card128901: resolve => require(['@/views/business/1289/ChildCard'], resolve),
      Card1300: resolve => require(['@/views/business/1300/Card'], resolve)
    },
    methods: {
      getCardType(type) {
        return this.$options.components[`Card${type}`] ? `Card${type}` : 'Card'
      }
    },
    watch: {
      messages(v) {
        this.messages = v
      }
    }
  }
</script>
