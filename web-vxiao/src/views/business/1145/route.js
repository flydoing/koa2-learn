/**
 * 值日公用路由
 */
export default [
  { path: '1145/DutySetting', name: 'dutySetting1145', component: resolve => require(['./DutySetting'], resolve) },
  { path: '1145/MemberList', name: 'memberList1145', component: resolve => require(['./MemberList'], resolve) },
  { path: '1145/SelectGroup', name: 'selectGroup1145', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1145/SelectMember', name: 'selectMember1145', component: resolve => require(['./SelectMember'], resolve) }
]
