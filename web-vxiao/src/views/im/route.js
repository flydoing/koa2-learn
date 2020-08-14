export default [
  {
    path: 'im',
    component: resolve => require(['./Index'], resolve),
    children: [{ path: '', component: resolve => require(['./Box'], resolve), meta: { span: 14 } }]
  },
  { path: 'im/selectGroup', component: resolve => require(['./Add'], resolve) },
  { path: 'im/members', component: resolve => require(['./Members'], resolve) }
]
