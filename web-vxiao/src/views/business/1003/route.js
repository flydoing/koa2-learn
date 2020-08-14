export default [{
  path: '1003/detail/index',
  component: resolve => require(['./detail/Index'], resolve),
  name: 'gradeDetail1003'
}, {
  path: '1003/scoreStairSetting',
  component: resolve => require(['./ScoreStairSetting'], resolve),
  name: 'scoreStairSetting1003'
}, {
  path: '1003/ladderEdit',
  component: resolve => require(['./LadderEdit'], resolve),
  name: 'ladderEdit1003'
}]
