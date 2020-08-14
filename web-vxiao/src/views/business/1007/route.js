/**
 * 投票公用路由
 */
export default [
  { path: '1007/SelectMember', name: 'selectMember1007', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1007/SelectGroup', name: 'selectGroup1007', component: resolve => require(['./SelectGroup'], resolve) }
]
