/**
 * 路由
 */
export default [
  { path: '1104/selectHandler', name: 'selectHandler1104', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1104/selectMember', name: 'selectMember1104', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1104/delivery', name: 'delivery1104', component: resolve => require(['./Delivery'], resolve) }
]
