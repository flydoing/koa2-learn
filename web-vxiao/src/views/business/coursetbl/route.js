export default [
  { path: 'coursetbl', component: resolve => require(['./Index'], resolve), meta: { span: 12 } },
  { path: 'coursetblClass', component: resolve => require(['./Class'], resolve), meta: { span: 12 } },
  { path: 'coursetblDetail', component: resolve => require(['./Detail'], resolve), meta: { span: 12 } },
  { path: 'coursetblTime', component: resolve => require(['./SelectTime'], resolve) }
]
