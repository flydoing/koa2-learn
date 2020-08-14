import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import group from './modules/group'
import app from './modules/app'
import meta from './modules/meta'
import category from './modules/category'
import im from './modules/im'
import config from './modules/config'
import channel from './modules/channel'
import create from './modules/create'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import app1034 from './modules/app/1034'
import app1039 from './modules/app/1039'
import app1040 from './modules/app/1040'
import app1042 from './modules/app/1042'
import app1046 from './modules/app/1046'
import app1048 from './modules/app/1048'
import app1049 from './modules/app/1049'
import app1064 from './modules/app/1064'
import app1096 from './modules/app/1096'
import app1109 from './modules/app/1109'
import app1127 from './modules/app/1127'
import app1137 from './modules/app/1137'
import app1141 from './modules/app/1141'
import app1142 from './modules/app/1142'
import app1144 from './modules/app/1144'
import app1148 from './modules/app/1148'
import app1149 from './modules/app/1149'
import app1153 from './modules/app/1153'
import app1155 from './modules/app/1155'
import app1160 from './modules/app/1160'
import app1162 from './modules/app/1162'
import app1164 from './modules/app/1164'
import app1170 from './modules/app/1170'
import app1178 from './modules/app/1178'
import app1196 from './modules/app/1196'
import app1209 from './modules/app/1209'
import app1212 from './modules/app/1212'
import app1216 from './modules/app/1216'
import app1237 from './modules/app/1237'
import app1222 from './modules/app/1222'
import app1230 from './modules/app/1230'
import app1234 from './modules/app/1234'
import app1235 from './modules/app/1235'
import app1055 from './modules/app/1055'
import app1192 from './modules/app/1192'
import app1123 from './modules/app/1123'
import app1002 from './modules/app/1002'
import app1186 from './modules/app/1186'
import app1003 from './modules/app/1003'
import app1058 from './modules/app/1058'
import app1181 from './modules/app/1181'
import app1073 from './modules/app/1073'
import app1047 from './modules/app/1047'
import app1248 from './modules/app/1248'
import seat from './modules/app/seat'
import app1069 from './modules/app/1069'
import app1247 from './modules/app/1247'
import app1255 from './modules/app/1255'
import app1257 from './modules/app/1257'
import app1260 from './modules/app/1260'
import app1264 from './modules/app/1264'
import appOnDuty from './modules/app/onDuty'

Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    logined: false,
    vxiao: true,
    FILE_URL: void 0,
    BUSINESS_URL: void 0,
    USERID: void 0,
    CLIENTID: void 0,
    TOKENID: void 0,
    ACCOUNT: void 0,
    PAINTER_WS: void 0,
    WS_URL: void 0,
    PROTOCAL: void 0,
    showPage: false,
    showGroupContacts: true,
    menuType: '1',
    globalSearch: '',
    closingPrompt: false,
    resize: { w: window.innerWidth, h: window.innerHeight }
  },
  actions: actions,
  getters,
  mutations,
  modules: {
    user,
    group,
    app,
    category,
    im,
    meta,
    config,
    channel,
    create,
    seat,
    app1034,
    app1039,
    app1040,
    app1042,
    app1046,
    app1048,
    app1049,
    app1064,
    app1096,
    app1109,
    app1127,
    app1137,
    app1141,
    app1142,
    app1144,
    app1148,
    app1149,
    app1153,
    app1155,
    app1160,
    app1162,
    app1164,
    app1170,
    app1178,
    app1196,
    app1209,
    app1212,
    app1216,
    app1234,
    app1237,
    app1222,
    app1230,
    app1235,
    app1055,
    app1192,
    app1123,
    app1002,
    app1186,
    app1003,
    app1058,
    app1181,
    app1073,
    app1047,
    app1248,
    app1069,
    app1247,
    app1255,
    app1257,
    app1260,
    app1264,
    appOnDuty
  }
})
