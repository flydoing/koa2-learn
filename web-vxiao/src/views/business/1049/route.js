/**
 * 评比公用路由
 */
export default [
  { path: '1049/ratingHonor', name: 'honorList1049', component: resolve => require(['./RatingHonor'], resolve) },
  { path: '1049/ratingProject', name: 'projectList1049', component: resolve => require(['./RatingProject'], resolve) },
  { path: '1049/reportSetting', name: 'reportSetting1049', component: resolve => require(['./ReportSetting'], resolve) },
  { path: '1049/childCardList', name: 'childCardList1049', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1049/remarkCardList', name: 'remarkCardList1049', component: resolve => require(['./RemarkCardList'], resolve) },
  { path: '1049/honorEdit', name: 'honorEdit1049', component: resolve => require(['./HonorEdit'], resolve) },
  { path: '1049/selectHonorLogo', name: 'selectLogo1049', component: resolve => require(['./SelectHonorLogo'], resolve) },
  { path: '1049/ratingContent', name: 'ratingContent1049', component: resolve => require(['./RatingContent'], resolve) },
  { path: '1049/addRating', name: 'addRating1049', component: resolve => require(['./AddRating'], resolve) },
  { path: '1049/selectItem', name: 'selectItem1049', component: resolve => require(['./SelectItem'], resolve) },
  { path: '1049/pointEdit', name: 'pointEdit1049', component: resolve => require(['./PointEdit'], resolve) },
  { path: '1049/selectProjectRange', name: 'selectProjectRange1049', component: resolve => require(['./SelectProjectRange'], resolve) },
  { path: '1049/selectHonorRange', name: 'selectHonorRange1049', component: resolve => require(['./SelectHonorRange'], resolve) },
  { path: '1049/projectEdit', name: 'projectEdit1049', component: resolve => require(['./ProjectEdit'], resolve) },
  { path: '1049/dutySetting', name: 'dutySetting1049', component: resolve => require(['./DutySetting'], resolve) },
  { path: '1049/memberList', name: 'memberList1049', component: resolve => require(['./MemberList'], resolve) },
  { path: '1049/selectGroup', name: 'selectGroup1049', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1049/selectMember', name: 'selectMember1049', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1049/selectMedal', name: 'selectMedal1049', component: resolve => require(['./SelectMedal'], resolve) }
]
