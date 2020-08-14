/**
 * 宿舍评比公用路由
 */
export default [
  { path: '1285/ratingProject', name: 'projectList1285', component: resolve => require(['./RatingProject'], resolve) },
  { path: '1285/remarkCardList', name: 'remarkCardList1285', component: resolve => require(['./RemarkCardList'], resolve) },
  { path: '1285/ratingContent', name: 'ratingContent1285', component: resolve => require(['./RatingContent'], resolve) },
  { path: '1285/addRating', name: 'addRating1285', component: resolve => require(['./AddRating'], resolve) },
  { path: '1285/selectItem', name: 'selectItem1285', component: resolve => require(['./SelectItem'], resolve) },
  { path: '1285/pointEdit', name: 'pointEdit1285', component: resolve => require(['./PointEdit'], resolve) },
  { path: '1285/selectRange', name: 'selectRange1285', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1285/projectEdit', name: 'projectEdit1285', component: resolve => require(['./ProjectEdit'], resolve) }
]
