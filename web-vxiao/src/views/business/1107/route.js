/**
 * 评比备注公用路由
 */
export default [
  { path: '1107/selectMember', name: 'selectMember1107', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1107/sendMedal', name: 'sendMedal1107', component: resolve => require(['./SendMedal'], resolve) }
]
