export default [{
    path: '1186/createChant',
    component: resolve => require(['./AppCreate'], resolve),
    name: 'chantCreate'
  },
  {
    path: '1186/setting',
    component: resolve => require(['./Setting'], resolve),
    name: 'chantSetting'
  },
  {
    path: '1186/addSetting',
    component: resolve => require(['./AddAndEdit'], resolve),
    name: 'chantAddSetting'
  },
  {
    path: '1186/autoPush',
    component: resolve => require(['./AutoPush'], resolve),
    name: 'chantAutoPush'
  },
  {
    path: '1186/addCourse',
    component: resolve => require(['./AddCourse'], resolve),
    name: 'chantAddCourse'
  },
  {
    path: '1186/courseDetail',
    component: resolve => require(['./CourseDetail'], resolve),
    name: 'chantCourseDetail'
  },
  {
    path: '1186/searchCourse',
    component: resolve => require(['./SearchCourse'], resolve),
    name: 'chantSearchCourse'
  },
  {
    path: '1186/selectedCourseResult',
    component: resolve => require(['./SelectedCourseResult'], resolve),
    name: 'chantSelectedCourseResult'
  },
  {
    path: '1186/searchResultList',
    component: resolve => require(['./SearchResultList'], resolve),
    name: 'chantSearchResultList'
  },
  {
    path: '1186/chantPushGrade',
    component: resolve => require(['./PushGrade'], resolve),
    name: 'chantPushGrade1186'
  },
  {
    path: '1186/chantPushCycle',
    component: resolve => require(['./PushCycle'], resolve),
    name: 'chantPushCycle1186'
  },
  {
    path: '1186/detail',
    component: resolve => require(['./detail/ChantDetail'], resolve),
    name: 'chantDetail1186'
  },
  {
    path: '1186/scoreTypeGrade',
    component: resolve => require(['./detail/ScoreTypeGrade'], resolve),
    name: 'scoreTypeGrade1186'
  },
  {
    path: '1186/accompany',
    component: resolve => require(['./Accompany'], resolve),
    name: 'accompany1186'
  },
  {
    path: '1186/catalogues',
    component: resolve => require(['./Catalogues'], resolve),
    name: 'catalogues1186'
  }
]
