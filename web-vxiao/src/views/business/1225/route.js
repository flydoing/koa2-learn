/**
 * 路由
 */
export default [
  { path: '1225/SelectHandler', name: 'selectHandler1225', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1225/SelectMember', name: 'selectMember1225', component: resolve => require(['./SelectMember'], resolve) }
]
