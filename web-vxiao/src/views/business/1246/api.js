import http from '@/utils/http'
export default {
  /**
   * 根据学校拉取屏幕列表
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getScreensBySchoolId(id) {
    return http.get(`/terminal/vscreen/spaces?schoolId=${id}`)
  },
  /**
   * 类型管理
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getScreenTypes(schoolId) {
    return http.get(`/rest/vscreen/type/list?schoolId=${schoolId}`)
  },

  /**
   * 更新、添加V屏类型
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyScreenType(d) {
    return http.post('/rest/vscreen/type/modify', d)
  },

  /**
   * 新增V屏幕
   * @param {[type]} d [description]
   */
  addScreen(d) {
    return http.post('/terminal/vscreen/bind', d)
  },

  /**
   * 获取某块屏的详情
   * @return {[type]} [description]
   */
  getScreenBannerCount(screenId) {
    return http.get(`/rest/vscreen/app/bannerCount?screenId=${screenId}`)
  },

  /**
   * 绑定
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  bind(d) {
    return http.post('/terminal/vscreen/bind', d)
  },

  /**
   * 屏管理详情
   * @param  {[type]} schoolId   [description]
   * @param  {[type]} categoryId [description]
   * @return {[type]}            [description]
   */
  getScreenManager(schoolId, categoryId) {
    return http.get(`/terminal/vscreen/category/sets?schoolId=${schoolId}&categoryId=${categoryId}`)
  },

  /**
   * 修改屏上的应用
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyScreenApp(d) {
    return http.post('/terminal/vscreen/category/app/modify', d)
  },
  /**
   * 屏基础设置
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyScreenSet(d) {
    return http.post('/terminal/vscreen/category/sets/modify', d)
  },

  /**
   * 编辑模板
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyTemplet(d) {
    return http.post('/terminal/vscreen/templet/sets/modify', d)
  },

  /**
   * 拉取模板的分类数据
   * @param  {[type]} schoolId   [description]
   * @param  {[type]} categoryId [description]
   * @param  {[type]} type       [description]
   * @return {[type]}            [description]
   */
  getTempletCategorys(schoolId, categoryId, type) {
    return http.get(`/terminal/vscreen/templet/sets.json?schoolId=${schoolId}&categoryId=${categoryId}&type=${type}`)
  },
  /**
   * 班徽、校徽
   * @Author   clz
   * @DateTime 2018-09-06
   * @param    {[type]}   groupId
   * @return   {[type]}
   */
  getBannar(groupId) {
    return http.get(`/terminal/vscreen/group/getVisualize?groupId=${groupId}`)
  },
  /**
   * 设置班徽校徽等
   * @Author   clz
   * @DateTime 2018-09-06
   * @param    {[type]}   d
   */
  setBannar(d) {
    return http.post('/terminal/vscreen/group/visualize', d)
  },
  /**
   * 添加自定义应用
   * @Author   clz
   * @DateTime 2018-09-10
   * @param    {[type]}   d [description]
   */
  addCustom(d) {
    return http.post(`/terminal/vscreen/category/selfdoc/edit`, d)
  },

  /**
   * 导入V屏
   * @Author   zcy
   * @DateTime 2018-09-10
   * @param    {[type]}   d [description]
   */
  importVscreens(schoolId, userId, fileId) {
    return http.get(`/terminal/vscreen/importScreenByFileId/${schoolId}/${userId}?fileId=${fileId}`)
  },
  /**
   * 获取V屏模式管理列表
   * @author clz
   * @date 2018-12-05
   * @param {*} schoolId
   * @param {*} categoryId
   */
  getVscreenPattern(schoolId, categoryId) {
    return http.get(`/terminal/vscreen/mode/list?schoolId=${schoolId}&categoryId=${categoryId}`)
  },
  /**
   *
   * 保存模式设置
   * @author clz
   * @date 2018-12-05
   * @param {*} d
   */
  modifyVscreenPattern(d) {
    return http.post('/terminal/vscreen/mode/save', d)
  }
}
