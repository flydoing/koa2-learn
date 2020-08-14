/**
 * 课程评价公用路由
 */
export default [
  { path: '1127/evaluateSubject', name: 'evaluateSubject1127', component: resolve => require(['./EvaluateSubject'], resolve) },
  { path: '1127/evaluateContent', name: 'evaluateContent1127', component: resolve => require(['./EvaluateContent'], resolve) },
  { path: '1127/categoryEdit', name: 'categoryEdit1127', component: resolve => require(['./CategoryEdit'], resolve) },
  { path: '1127/objects', name: 'objects1127', component: resolve => require(['./Objects'], resolve) }
]
