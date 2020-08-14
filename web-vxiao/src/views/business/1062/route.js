/**
 * CRM客户公用路由
 */
export default [
  { path: '1062/selectType', component: resolve => require(['./SelectType'], resolve) },
  { path: '1062/remarkEdit', component: resolve => require(['./RemarkEdit'], resolve) },
  { path: '1062/addMember', component: resolve => require(['./AddMember'], resolve) }
]
