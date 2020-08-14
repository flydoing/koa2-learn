import http from '@/utils/http'
export default {
  /**
   * 加载学校待认证的群组
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadUncertified(schoolId) {
    return http.get(`/base/school/group/uncertified/${schoolId}`)
  },
  /**
   * 加载学校老师基础信息
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadTeacherInfo(id) {
    return http.get(`/base/school/teacher/infos?schoolId=${id}`)
  },

  /**
   * 查询科目信息
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadSubjectInfo(id) {
    return http.get(`/rest/courseschedule/section/allocation?schoolId=${id}`)
  },

  /**
   * 查询场所信息
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadPlaceInfo(id) {
    return http.get(`/rest/courseschedule/place/list.json?schoolId=${id}`)
  },

  /**
   * 查询教学时间
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadTeacherTimeInfo(id) {
    return http.get(`/business/classtime/index/${id}.json`)
  },

  /**
   * 修改每周上课天数
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyTeacherTimeDays(d) {
    return http.post(`/business/classtime/period/modify.json`, d)
  },

  /**
   * 根据学校以及年纪Id查询学生列表
   * @param  {[type]} schoolId [description]
   * @param  {[type]} gradeId  [description]
   * @return {[type]}          [description]
   */
  loadStudentByGid(schoolId, gradeId, keyword) {
    let url = `/base/school/query/student/${schoolId}`
    if (gradeId) {
      url = `${url}/${gradeId}`
    }
    if (keyword) {
      url = `${url}?keyword=${keyword}`
    }
    return http.get(url)
  },
  /**
   * 成员离职
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyUserLeave(d) {
    return http.post('/base/school/user/leave', d)
  },
  /**
   * 成员入职
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyUserEntry(d) {
    return http.post('/base/school/user/entry', d)
  },
  /**
   * 加载学校公共班级
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadCommonGroups(schoolId) {
    return http.get(`/business/common/group/list?schoolId=${schoolId}`)
  },
  /**
   * [modifyPlace description]
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyPlace(d) {
    return http.post('/base/place/modify', d)
  },
  /**
   * [loadPlaceCategorys description]
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadPlaceCategorys(schoolId) {
    return http.get(`/base/place/categories?schoolId=${schoolId}`)
  },

  /**
   * 查询某个分类下场所列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadPlaceDetail(schoolId, type, isTable = 1) {
    return http.get(`/base/place/query?schoolId=${schoolId}&type=${type}&isTable=${isTable}`)
  },
  /**
   * 更新教学时间
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  modifyTeacherTime(schoolId, d) {
    return http.post(`/business/classtime/time/modify?schoolId=${schoolId}`, d)
  },

  /**
   * 导入场所数据
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  importPlaceData(schoolId, fileId, ignore) {
    let url = `/base/place/import?schoolId=${schoolId}&fileId=${fileId}`
    if (ignore) {
      url = `${url}&ignoreErrors=1`
    }
    return http.get(url)
  },
  /**
   * 编辑修改科目信息
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  modifySubject(data) {
    return http.post('/rest/courseschedule/section/add.json', data)
  },
  /**
   *
   * 重置密码
   * @author clz
   * @date 2018-12-10
   * @param {*} data
   * @returns
   */
  resetPassWord(data) {
    return http.post('/base/aas/group/resetPwd', data)
  },
  /**
   * 获取申请列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getApplyList(schoolId) {
    return http.get(`/base/school/belong/apply/list?schoolId=${schoolId}`)
  },

  /**
   * 保存申请审批结果
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  approveApply(data) {
    return http.post('/base/school/belong/approve', data)
  }
}
