export default [{
  path: '1181/detail/detailIndex',
  component: resolve => require(['./detail/DetailIndex'], resolve),
  name: 'detailIndex1181'
}, {
  path: '1181/catalogue',
  component: resolve => require(['./ModelEssayCatalogue'], resolve),
  name: 'catalogue1181'
}, {
  path: '1181/keywords',
  component: resolve => require(['./EssayKeywords'], resolve),
  name: 'keywords1181'
}]
