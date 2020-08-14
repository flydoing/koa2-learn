/**
 * 表彰公用路由
 */
export default [
  { path: '1048/AutoCommend', name: 'autoCommend1048', component: resolve => require(['./AutoCommend'], resolve) },
  { path: '1048/AutoCommendEdit', name: 'autoCommendEdit1048', component: resolve => require(['./AutoCommendEdit'], resolve) },
  { path: '1048/CustomTemplate', name: 'customTemplate1048', component: resolve => require(['./CustomTemplate'], resolve) },
  { path: '1048/SelectGroup', name: 'selectGroup1048', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1048/SelectMember', name: 'selectMember1048', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1048/SelectType', name: 'selectType1048', component: resolve => require(['./SelectType'], resolve) },
  { path: '1048/SelectTemplate', name: 'selectTemplate1048', component: resolve => require(['./SelectTemplate'], resolve) },
  { path: '1048/SelectRule', name: 'selectRule1048', component: resolve => require(['./SelectRule'], resolve) },
  { path: '1048/AwardEdit', name: 'awardEdit1048', component: resolve => require(['./AwardEdit'], resolve) },
  { path: '1048/Detail/:msgId', name: 'detail1048', component: resolve => require(['./Detail'], resolve) },
  { path: '1048/MemberList', name: 'memberList1048', component: resolve => require(['./MemberList'], resolve) }
]
