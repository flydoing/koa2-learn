export default [
  { path: '1265/detail/school', component: resolve => require(['./SchoolDetail'], resolve), meta: { keepAlive: true } },
  { path: '1265/detail/class', component: resolve => require(['./ClassDetail'], resolve), meta: { keepAlive: true } },
  { path: '1265/detail/parent', component: resolve => require(['./ParentDetail'], resolve), meta: { keepAlive: true } }
]
