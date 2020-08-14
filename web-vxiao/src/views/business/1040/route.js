/**
 * 会议公用路由
 */
export default [
  { path: '1040/addMinutes/:msgId', name: 'addMinutes1040', component: resolve => require(['./AddMinutes'], resolve) },
  { path: '1040/minutes/:msgId', name: 'minutes1040', component: resolve => require(['./Minutes'], resolve) },
  { path: '1040/selectPlace', name: 'selectPlace1040', component: resolve => require(['./SelectPlace'], resolve) },
  { path: '1040/selectMember', name: 'selectMember1040', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1040/projectEdit', name: 'projectEdit1040', component: resolve => require(['./ProjectEdit'], resolve) },
  { path: '1040/placeReserveList', name: 'placeReserveList1040', component: resolve => require(['./PlaceReserveList'], resolve) },
  { path: '1040/signSetting', name: 'signSetting1040', component: resolve => require(['./SignSetting'], resolve) },
  { path: '1040/selectAddress', name: 'selectAddress1040', component: resolve => require(['./SelectAddress'], resolve) },
  { path: '1040/detail', name: 'detail1040', component: resolve => require(['./Detail'], resolve) },
  { path: '1040/signItemEdit', name: 'signItemEdit1040', component: resolve => require(['./SignItemEdit'], resolve) }
]
