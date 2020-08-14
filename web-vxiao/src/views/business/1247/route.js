export default [
  { path: '1247/selectGarade', name: 'selectGarade1247', component: resolve => require(['./Grades'], resolve) },
  { path: '1247/currentGrades', name: 'currentGrades1247', component: resolve => require(['./CurrentGrades'], resolve) },
  { path: '1247/detail', name: 'detail1247', component: resolve => require(['./detail/Detail'], resolve) }
]
