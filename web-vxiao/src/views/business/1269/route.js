export default [
  {
    path: '1269/detailIndex',
    component: resolve => require(['./detail/DetailIndex'], resolve),
    name: 'detailIndex1269'
  },
  {
    path: '1269/bindIpAddress',
    component: resolve => require(['./setup/BindIpAddress'], resolve),
    name: 'bindIpAddress1269'
  },
  {
    path: '1269/editIpAddress',
    component: resolve => require(['./setup/EditIpAddress'], resolve),
    name: 'editIpAddress1269'
  },
  {
    path: '1269/classRoomCategory',
    component: resolve => require(['./ClassRoomCategory'], resolve),
    name: 'classRoomCategory1269'
  },
  {
    path: '1269/classRoomCatalogues',
    component: resolve => require(['./ClassRoomCatalogues'], resolve),
    name: 'classRoomCatalogues1269'
  },
  {
    path: '1269/classRoomCourseList',
    component: resolve => require(['./ClassRoomCourseList'], resolve),
    name: 'classRoomCourseList1269'
  },
  {
    path: '1269/classRoomDetailList',
    component: resolve => require(['./ClassRoomDetailList'], resolve),
    name: 'classRoomDetailList1269'
  },
  {
    path: '1269/classRoomTemplates',
    component: resolve => require(['./ClassRoomTemplates'], resolve),
    name: 'classRoomTemplates1269'
  },
  {
    path: '1269/classRoomCategorys',
    component: resolve => require(['./ClassRoomCategorys'], resolve),
    name: 'classRoomCategorys1269'
  },
  {
    path: '1269/classRoomQuestions',
    component: resolve => require(['./ClassRoomQuestions'], resolve),
    name: 'classRoomQuestions1269'
  },
  {
    path: '1269/classRoomCreate',
    component: resolve => require(['./AppCreate'], resolve),
    name: 'classRoomCreate1269'
  },
  {
    path: '1269/qualityReport',
    component: resolve => require(['./detail/QualityReport'], resolve),
    name: 'qualityReport1269'
  }
]
