export default [
  {
    path: 'im',
    component: resolve => require(['./Index'], resolve),
    children: [{ path: '', component: resolve => require(['@/views/im/Box.vue'], resolve), meta: { span: 14 } }]
  },
  { path: 'im/selectGroup', component: resolve => require(['@/views/im/Add.vue'], resolve) },
  { path: 'im/members', component: resolve => require(['@/views/im/Members.vue'], resolve) }
]
