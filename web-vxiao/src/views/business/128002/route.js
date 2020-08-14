export default [
  { path: '1280/detail', component: resolve => require(['./Detail'], resolve), meta: { keepAlive: true } },
  { path: '1280/audience', component: resolve => require(['./Audience'], resolve), meta: { keepAlive: true } }
]
