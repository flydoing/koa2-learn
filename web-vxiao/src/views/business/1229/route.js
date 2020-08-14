export default [
  { path: '1229/setup/add', component: resolve => require(['./setup/Add'], resolve), meta: { keepAlive: true } },
  { path: '1229/setup/detail', component: resolve => require(['./setup/Detail'], resolve) }
]
