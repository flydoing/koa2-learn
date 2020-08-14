/**
 * 报销公用路由
 */
export default [
  { path: '1109/SummaryDetail/:type', name: 'summaryDetail1109', component: resolve => require(['./SummaryDetail'], resolve) },
  { path: '1109/Detail', name: 'detail1109', component: resolve => require(['./Detail'], resolve) },
  { path: '1109/HandlerSetting', name: 'handlerSetting1109', component: resolve => require(['./HandlerSetting'], resolve) },
  { path: '1109/HandlerEdit', name: 'handlerEdit1109', component: resolve => require(['./HandlerEdit'], resolve) },
  { path: '1109/SelectMember', name: 'selectMember1109', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1109/SelectType', name: 'selectType1109', component: resolve => require(['./SelectType'], resolve) }
]
