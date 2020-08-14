/**
 * 调代课公用路由
 */
export default [
  { path: '1234/exchangeCourse', name: 'exchangeCourse1234', component: resolve => require(['./ExchangeCourse'], resolve) },
  { path: '1234/substituteCourse', name: 'substituteCourse1234', component: resolve => require(['./SubstituteCourse'], resolve) },
  { path: '1234/selectTime', name: 'selectTime1234', component: resolve => require(['./SelectTime'], resolve) },
  { path: '1234/selectMember', name: 'selectMember1234', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1234/selectTeacher', name: 'selectTeacher1234', component: resolve => require(['./SelectTeacher'], resolve) },
  { path: '1234/weeks', name: 'weeks1234', component: resolve => require(['./Weeks'], resolve) },
  { path: '1234/selectCourse', name: 'selectCourse1234', component: resolve => require(['./SelectCourse'], resolve) },
  { path: '1234/selectSubject', name: 'selectSubject1234', component: resolve => require(['./SelectSubject'], resolve) }
]
