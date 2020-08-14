export default [
  { path: 'topic', name: 'topic', component: resolve => require(['./Index'], resolve) },
  { path: 'topic/list', name: 'topicList', component: resolve => require(['./List'], resolve) },
  { path: 'topic/select', component: resolve => require(['./Select'], resolve) }
]
