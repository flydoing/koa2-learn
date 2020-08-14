/**
 * CRM公用路由
 */
export default [
  { path: '1046/appDetail', name: 'appDetail1046', component: resolve => require(['./AppDetail'], resolve) },
  { path: '1046/selectList', component: resolve => require(['./SelectList'], resolve) },
  { path: '1046/selectMember', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1046/selectAddress', component: resolve => require(['./SelectAddress'], resolve) },
  { path: '1046/contactEdit', component: resolve => require(['./ContactEdit'], resolve) },
  { path: '1046/selectObject', component: resolve => require(['./SelectObject'], resolve) },
  { path: '1046/selectSign', component: resolve => require(['./SelectSign'], resolve) },
  { path: '1046/modifyRecord', component: resolve => require(['./ModifyRecord'], resolve) }
]
