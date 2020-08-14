/**
 * 交接班公用路由
 */
export default [
  { path: '1148/PostSetting', name: 'postSetting1148', component: resolve => require(['./PostSetting'], resolve) },
  { path: '1148/AddPost', name: 'addPost1148', component: resolve => require(['./AddPost'], resolve) }
]
