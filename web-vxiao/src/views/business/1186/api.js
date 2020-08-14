import http from '@//utils/http'
import ObjUtils from '@/utils/object'
import Check from '@/utils/check'
export default {
  // 获取诵读类型 gid-> groupId type=类型编号
  getChantType(gid, type = 170) {
    return http.get(`/base/category/query.json?groupId=${gid}&type=${type}`)
  },
  /**
   * 获取目录
   * isGlobal-> 1展示综合目录
   * isSerial-> 1展示序号
   * isCount-> 1展示数量
   */
  getCetagory(gid, isGlobal = 0, isSerial = 0, isCount = 0) {
    return http.get(`/business/course/query/chapter/${gid}.json?isGlobal=${isGlobal}&isSerial=${isSerial}&isCount=${isCount}`)
  },
  /**
   * 获取伴奏列表
   * page --> 页码
   */
  getAudioList(page = 1) {
    return http.get(`/business/recite/query/audio/list?currentPage=${page}`)
  },
  /**
   * 解析word文档
   */
  parseWork(gid, fileId) {
    return http.get(`/business/recite/parseWord?groupId=${gid}&fileId=${fileId}`)
  },
  /**
   * 新建诵读
   * @param {请求体} d 
   */
  ChantCreate(d) {
    return http.post('/business/message/add.json', {
      message: d
    })
  },
  /**
   * 查询应用设置
   * gif [goupId]
   * type [appType]
   * isMeta 只返回metaDatas
   */
  getDefaultSettings(gid, type, isMeta) {
    let xhr = null
    if (isMeta) {
      xhr = http.get(`/business/homework/settings?groupId=${gid}&appType=${type}&isMeta=${isMeta}`)
    } else {
      xhr = http.get(`/business/homework/settings?groupId=${gid}&appType=${type}`)
    }
    return xhr
  },
  /**
   * 编辑诵读设置
   * @param {请求体} d 
   */
  modifySettings(d) {
    return http.post('/business/homework/settings/add', d)
  },
  /**
   * 查询应用设置（分数类型）查询子数据
   * @param {目录编号} type 
   * @param {父id} parentId 
   * @param {是否只返回metaDatas} isDefault 
   */
  getCetagoryChildren(type, parentId, isDefault = 0) {
    return http.get(`/base/category/query?type=${type}&parentId=${parentId}&isDefault=${isDefault}`)
  },
  /**
   * 拉取已推送课程(学校空间)
   * @param {groupId} gid 
   * @param {appType} appType 
   */
  getSelectedCourse(gid, appType) {
    return http.get(`/business/course/query/push/${gid}?appType=${appType}`)
  },
  /**
   * 添加推送诵读的群
   * @param {groupId} gid 
   * @param {appType} appType 
   */
  addCourse(gid, appType) {
    return http.get(`/business/course/query/myself?groupId=${gid}&appType=${appType}`)
  },
  /**
   * 设置 推送
   * @param {请求体} d 
   */
  setPush(d) {
    return http.post('/business/course/add/push.json', d)
  },
  /**
   * 获取推送年级
   * @param {groupId} gid 
   */
  getPushGrade(gid) {
    return http.get(`/base/school/grade/${gid}`)
  },
  /**
   * 获取推送设置
   * @param {课程id} courseId 
   * @param {groupId} groupId 
   * @param {appType} appType 
   */
  getPushSettings(courseId, groupId, appType) {
    return http.get(`/business/course/query/push/setting.json?courseId=${courseId}&groupId=${groupId}&appType=${appType}`)
  },
  /**
   * 点击推送开关设置推送
   * @param {请求体} d
   */
  singleSetPushBtn(d) {
    return http.post('/business/course/setting/push', d)
  },
  /**
   * 获取班级 已选课程列表
   * @param {groupId} gid 
   * @param {appType} appType 
   */
  getClassSelectedCourse(gid, appType) {
    return http.get(`/business/course/query/pushlist/${gid}?appType=${appType}`)
  },
  /**
   * 班级获取添加课程列表
   * @param {groupId} gid 
   * @param {appType} appType 
   */
  addClassCourse(gid, appType) {
    return http.get(`/business/course/query/unpush/${gid}?appType=${appType}`)
  },
  /**
   * 获取 搜索课程默认关键字
   * @param {parentId} parentId
   */
  getDefaultSearchKey(parentId) {
    let xhr = null
    if (parentId) {
      xhr = http.get(`/business/course/query/subscribe/range?parentId=${parentId}`)
    } else {
      xhr = http.get(`/business/course/query/subscribe/range`)
    }
    return xhr
  },
  /**
   * 关键字查询接口
   * @param {*} obj 
   * 对象属性： groupId, keyword, gradeId, subjectId, versionId, appType
   */
  getSearchResult(obj) {
    var urlStr = `/rest/course/query/keyword?groupId=${obj.groupId}&appType=${obj.appType}`
    delete obj.groupId
    delete obj.appType
    let params = []
    ObjUtils.forEachKeys(obj, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })
    return http.get(`${urlStr}&${params.join('&')}`)
  }
}
