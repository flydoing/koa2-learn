export default [
  { path: '1280/detail', component: resolve => require(['./Detail'], resolve), meta: { keepAlive: true } },
  { path: '1280/audience', component: resolve => require(['./Audience'], resolve), meta: { keepAlive: true } },
  // { path: '1280/recording', component: resolve => require(['./Recording'], resolve), meta: { keepAlive: true, span: 14 } }
  { path: '1280/recording', component: resolve => require(['./Recording'], resolve), meta: { span: 14 } }
]
