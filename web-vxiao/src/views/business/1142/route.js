/**
 * 访客公用路由
 */
export default [
  { path: '1142/IdcardSetting', name: 'idcardSetting1142', component: resolve => require(['./IdcardSetting'], resolve) },
  { path: '1142/ParentList', name: 'parentList1142', component: resolve => require(['./ParentList'], resolve) },
  { path: '1142/IdcardEdit', name: 'idcardEdit1142', component: resolve => require(['./IdcardEdit'], resolve) },
  { path: '1142/SelectMember', name: 'selectMember1142', component: resolve => require(['./SelectMember'], resolve) }
]
