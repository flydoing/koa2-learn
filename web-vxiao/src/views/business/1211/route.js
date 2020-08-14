/**
 * 审批公用路由
 */
export default [
  { path: '1211/SelectMember', name: 'selectMember1211', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1211/SelectHandler', name: 'selectHandler1211', component: resolve => require(['./SelectHandler'], resolve) }
]
