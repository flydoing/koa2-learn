/**
 * 路由
 */
export default [
  { path: '1105/selectHandler', name: 'selectHandler1105', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1105/selectMember', name: 'selectMember1105', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1105/borrowInfo', name: 'borrowInfo1105', component: resolve => require(['./BorrowInfo'], resolve) },
  { path: '1105/receiveInfo', name: 'receiveInfo1105', component: resolve => require(['./ReceiveInfo'], resolve) },
  { path: '1105/selectProduct', name: 'selectProduct1105', component: resolve => require(['./SelectProduct'], resolve) }
]
