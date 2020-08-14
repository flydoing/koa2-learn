/**
 * 公文公用路由
 */
export default [
  { path: '1248/SelectMember', name: 'selectMember1248', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1248/CategorySetting', name: 'categorySetting1248', component: resolve => require(['./CategorySetting'], resolve) },
  { path: '1248/HandlerSetting', name: 'handlerSetting1248', component: resolve => require(['./HandlerSetting'], resolve) },
  { path: '1248/ApproverEdit', name: 'approverEdit1248', component: resolve => require(['./ApproverEdit'], resolve) },
  { path: '1248/Detail/:msgId', name: 'detail1248', component: resolve => require(['./Detail'], resolve) }
]
