/**
 * 工单公用路由
 */
export default [
  { path: '1039/assessTime/:msgId', name: 'assessTime1039', component: resolve => require(['./AssessTime'], resolve) },
  { path: '1039/selectMember', name: 'selectMember1039', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1039/selectType', name: 'selectType1039', component: resolve => require(['./SelectType'], resolve) },
  { path: '1039/typeSetting', name: 'typeSetting1039', component: resolve => require(['./TypeSetting'], resolve) },
  { path: '1039/defaultHandlers', name: 'defaultHandlers1039', component: resolve => require(['./DefaultHandlers'], resolve) },
  { path: '1039/addMember', name: 'addMember1039', component: resolve => require(['./AddMember'], resolve) }
]
