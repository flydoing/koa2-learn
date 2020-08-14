export default [
  {
    path: 'user',
    component: resolve => require(['./Index'], resolve),
    children: [
      { path: 'self', component: resolve => require(['@/views/my/Info'], resolve), meta: { span: 14 } },
      { path: 'working', component: resolve => require(['@/views/my/Working'], resolve), meta: { span: 14 } },
      { path: 'shop', component: resolve => require(['@/views/my/shop/Index'], resolve), meta: { span: 14 } },
      { path: 'password', component: resolve => require(['@/views/my/Password'], resolve), meta: { span: 14 } },
      { path: 'mobile', component: resolve => require(['@/views/my/Mobile'], resolve), meta: { span: 14 } },
      { path: 'customTime', component: resolve => require(['@/views/my/CustomTime'], resolve), meta: { span: 14 } },
      { path: 'vcourse', component: resolve => require(['@/views/my/Course'], resolve), meta: { span: 14 } },
      { path: 'exercises', component: resolve => require(['@/views/my/exercises/Index'], resolve), meta: { span: 14 } },
      { path: 'exercises/filter', component: resolve => require(['@/views/my/exercises/Filter'], resolve), meta: { span: 14 } },
      { path: 'exercises/analysis', component: resolve => require(['@/views/my/exercises/Analysis'], resolve), meta: { span: 14 } },
      // { path: 'vrecord', component: resolve => require(['./Record'], resolve), meta: { span: 14 } },
      { path: 'vrecord', component: resolve => require(['@/views/my/recording/Index'], resolve), meta: { span: 14 } },
      { path: 'vrecordForward', component: resolve => require(['@/views/my/recording/Forward'], resolve), meta: { span: 14 } },
      { path: 'app/users/:appType', component: resolve => require(['@/views/my/AppUsers'], resolve), meta: { span: 14 } },
      { path: 'app/books', component: resolve => require(['@/views/my/books/Index'], resolve), meta: { span: 14 } },
      { path: 'app/books/detail', component: resolve => require(['@/views/my/books/Detail'], resolve), meta: { span: 14 } },
      { path: 'app/consume/:userId', component: resolve => require(['@/views/my/consume/Index'], resolve), meta: { span: 14 } },
      { path: 'app/motion/:userId', component: resolve => require(['@/views/my/motion/Index'], resolve), meta: { span: 14 } },
      { path: 'sort/list', component: resolve => require(['@/views/my/sort/List'], resolve), meta: { span: 14 } },
      { path: 'sort/groups', component: resolve => require(['@/views/my/sort/Groups'], resolve), meta: { span: 14 } }
    ]
  }
]
