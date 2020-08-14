/**
 * 社团选拔公用路由
 */
export default [
  { path: '1096/detail', name: 'detail1096', component: resolve => require(['./Detail'], resolve) },
  { path: '1096/enrollInfo', name: 'enrollInfo1096', component: resolve => require(['./EnrollInfo'], resolve) },
  { path: '1096/courseList', name: 'courseList1096', component: resolve => require(['./CourseList'], resolve) },
  { path: '1096/courseInfo', name: 'courseInfo1096', component: resolve => require(['./CourseInfo'], resolve) },
  { path: '1096/modifyTime', name: 'modifyTime1096', component: resolve => require(['./ModifyTime'], resolve) },
  { path: '1096/alternativeCourse', name: 'alternativeCourse1096', component: resolve => require(['./AlternativeCourse'], resolve) },
  { path: '1096/courseAmount', name: 'courseAmount1096', component: resolve => require(['./CourseAmount'], resolve) },
  { path: '1096/ruleSetting', name: 'ruleSetting1096', component: resolve => require(['./RuleSetting'], resolve) },
  { path: '1096/courseEdit', name: 'courseEdit1096', component: resolve => require(['./CourseEdit'], resolve) },
  { path: '1096/selectTeacher', name: 'selectTeacher1096', component: resolve => require(['./SelectTeacher'], resolve) },
  { path: '1096/selectSpace', name: 'selectSpace1096', component: resolve => require(['./SelectSpace'], resolve) },
  { path: '1096/selectTime', name: 'selectTime1096', component: resolve => require(['./SelectTime'], resolve) },
  { path: '1096/selectClass', name: 'selectClass1096', component: resolve => require(['./SelectClass'], resolve) },
  { path: '1096/selectPlace', name: 'selectPlace1096', component: resolve => require(['./SelectPlace'], resolve) },
  { path: '1096/selectCourse', name: 'selectCourse1096', component: resolve => require(['./SelectCourse'], resolve) }
]
