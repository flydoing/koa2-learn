/**
 * 路由
 */
export default [
  { path: '1287/selectHandler', name: 'selectHandler1287', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1287/selectMember', name: 'selectMember1287', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1287/execute', name: 'execute1287', component: resolve => require(['./Execute'], resolve) },
  { path: '1287/selectSchool', name: 'selectSchool1287', component: resolve => require(['./SelectSchool'], resolve) }
]
