/**
 * 校务评比公用路由
 */
export default [
  { path: '1283/ratingProject', name: 'projectList1283', component: resolve => require(['./RatingProject'], resolve) },
  { path: '1283/remarkCardList', name: 'remarkCardList1283', component: resolve => require(['./RemarkCardList'], resolve) },
  { path: '1283/addRating', name: 'addRating1283', component: resolve => require(['./AddRating'], resolve) },
  { path: '1283/selectItem', name: 'selectItem1283', component: resolve => require(['./SelectItem'], resolve) },
  { path: '1283/pointEdit', name: 'pointEdit1283', component: resolve => require(['./PointEdit'], resolve) },
  { path: '1283/projectEdit', name: 'projectEdit1283', component: resolve => require(['./ProjectEdit'], resolve) },
  { path: '1283/selectMember', name: 'selectMember1283', component: resolve => require(['./SelectMember'], resolve) }
]
