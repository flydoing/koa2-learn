/**
 * 公用路由
 */
export default [
  { path: 'onDuty/list', component: resolve => require(['./List'], resolve) },
  { path: 'onDuty/selectMember', component: resolve => require(['./SelectMember'], resolve) },
  { path: 'onDuty/set', component: resolve => require(['./Set'], resolve) }
]
