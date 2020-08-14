export default [
  {
    path: 'user',
    component: resolve => require(['./Index'], resolve),
    children: [
      { path: 'self', component: resolve => require(['./Info'], resolve), meta: { span: 14 } },
      { path: 'working', component: resolve => require(['./Working'], resolve), meta: { span: 14 } },
      { path: 'shop', component: resolve => require(['./shop/Index'], resolve), meta: { span: 14 } },
      { path: 'password', component: resolve => require(['./Password'], resolve), meta: { span: 14 } },
      { path: 'mobile', component: resolve => require(['./Mobile'], resolve), meta: { span: 14 } },
      { path: 'changeName', component: resolve => require(['./ChangeName'], resolve), meta: { span: 14 } },
      { path: 'customTime', component: resolve => require(['./CustomTime'], resolve), meta: { span: 14 } },
      { path: 'vcourse', component: resolve => require(['./Course'], resolve), meta: { span: 14 } },
      { path: 'exercises', component: resolve => require(['./exercises/Index'], resolve), meta: { span: 14 } },
      { path: 'exercises/filter', component: resolve => require(['./exercises/Filter'], resolve), meta: { span: 14 } },
      { path: 'exercises/analysis', component: resolve => require(['./exercises/Analysis'], resolve), meta: { span: 14 } },
      // { path: 'vrecord', component: resolve => require(['./Record'], resolve), meta: { span: 14 } },
      { path: 'vrecord', component: resolve => require(['./recording/Index'], resolve), meta: { span: 14 } },
      { path: 'vrecordForward', component: resolve => require(['./recording/Forward'], resolve), meta: { span: 14 } },
      { path: 'app/users/:appType', component: resolve => require(['./AppUsers'], resolve), meta: { span: 14 } },
      { path: 'app/books', component: resolve => require(['./books/Index'], resolve), meta: { span: 14 } },
      { path: 'app/books/detail', component: resolve => require(['./books/Detail'], resolve), meta: { span: 14 } },
      { path: 'app/consume/:userId', component: resolve => require(['./consume/Index'], resolve), meta: { span: 14 } },
      { path: 'app/motion/:userId', component: resolve => require(['./motion/Index'], resolve), meta: { span: 14 } },
      { path: 'sort/list', component: resolve => require(['./sort/List'], resolve), meta: { span: 14 } },
      { path: 'sort/groups', component: resolve => require(['./sort/Groups'], resolve), meta: { span: 14 } }
    ]
  }
]
