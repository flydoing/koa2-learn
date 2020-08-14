/**
 * 分享公用路由
 */
export default [
  { path: 'dormitory/list', component: resolve => require(['./List'], resolve) },
  { path: 'dormitory/classDetail', component: resolve => require(['./ClassDetail'], resolve) },
  { path: 'dormitory/addMember', component: resolve => require(['./AddMember'], resolve) },
  { path: 'dormitory/selectGroup', component: resolve => require(['./SelectGroup'], resolve) },
  { path: 'dormitory/selectMember', component: resolve => require(['./SelectMember'], resolve) }
]
