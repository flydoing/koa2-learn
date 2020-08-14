import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'
/**
 * 分类数据拉取类
 */
export default {
  /**
   * 添加修改群组
   * @param {[type]} g [description]
   */
  addGroup(g) {
    return http.post('/base/group/add', g)
  },

  /**
   * 添加课程群
   * @param {*} g
   */
  addCourse(g) {
    return http.post('/business/course/add', g)
  },

  /**
   * 添加修改群成员关系
   * @param {[type]} r [description]
   */
  addGroupRelation(r) {
    return http.post('/base/group/relation', r)
  },

  /**
   * 获取群详情
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupDetail(groupId) {
    return http.get(`/base/group/${groupId}`)
  },

  /**
   * 获取组织结构详细信息
   * @param  {[type]} groupId  [description]
   * @param  {[type]} parentId [description]
   * @return {[type]}          [description]
   */
  getSchoolDetail(groupId, parentId) {
    let url = `/base/school/${groupId}`
    if (parentId) {
      url = `${url}?parentId=${parentId}`
    }
    return http.get(url)
  },

  /**
   * 获取群应用关系
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupApps(groupId) {
    return http.get(`/base/group/app/${groupId}`)
  },

  /**
   * 获取群应用简要数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupAppsInfo(groupId) {
    return http.get(`/report/business/app/summarys?groupId=${groupId}`)
  },

  /**
   * 拉取学校群列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getSchoolAllGroups(schoolId) {
    return http.get(`/base/school/group/all/${schoolId}`)
  },

  /**
   * 拉取学校群列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getSchoolGroups(groupId) {
    return http.get(`/base/school/group/${groupId}.json`)
  },

  /**
   * 拉取学校群列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getSchoolGroupList(schoolId) {
    return http.get(`/business/common/group/list.json?schoolId=${schoolId}`)
  },

  /**
   * 拉取群用户（不会查询家长）
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupUsers(groupId, args) {
    let params = []
    if (args) {
      C.forEachKeys(args, (k, v) => {
        if (!Check.isNullString(v)) {
          params.push(`${k}=${v}`)
        }
      })
    }
    return http.get(`/base/group/user/${groupId}?${params.join('&')}`)
  },

  /**
   * 修改群用户信息
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyGroupUser(data) {
    return http.post(`/base/group/user`, { relation: data })
  },
  /**
   * 查询通讯录
   * @param {} groupId
   */
  getGroupContacts(groupId) {
    return http.get(`/base/group/user/${groupId}`)
  },
  /**
   * 拉取群用户关系（所有用户）
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupAllUsers(groupId) {
    return this.getGroupUsersByType(groupId, '1_2_3_4')
  },

  /**
   * 根据群用户类型，查找群用户
   * @param  {[type]} groupId  [description]
   * @param  {[type]} userType [description]
   * @return {[type]}          [description]
   */
  getGroupUsersByType(groupId, userType) {
    return http.get(`/base/group/user/${groupId}?userType=${userType}`)
  },
  /**
   * 根据学校ID查找所有的场所
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getPlacesBySchooId(args) {
    let url = `/base/place/list?`
    for (let attr in args) {
      url = `${url}${attr}=${args[attr]}&`
    }
    return http.get(url)
  },

  /**
   * 获取用户详情
   * @param  {[type]} groupId [description]
   * @param  {[type]} userId  [description]
   * @return {[type]}         [description]
   */
  getGroupUser(groupId, userId) {
    return http.get(`/base/group/query/user/${groupId}/${userId}`)
  },

  /**
   * 拉取学校栏目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSchoolCategorys(groupId) {
    return http.get(`/rest/portal/category/second/all/${groupId}`)
  },

  /**
   * 拉取群小组列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupTeams(groupId) {
    return http.get(`/base/group/query/team/${groupId}`)
  },

  /**
   * 拉取家长孩子
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupUserChildren(groupId) {
    return http.get(`/base/group/user/children/${groupId}`)
  },

  /**
   * 拉取班级学生列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupStudents(groupId, type) {
    let url = `/base/group/query/student/${groupId}`
    if (type) {
      url = `${url}?type=${type}`
    }
    return http.get(url)
  },

  /**
   * metaData数据更新(新建/修改/删除)
   * @param {[type]} meta [description]
   */
  updateMetaData(metas) {
    return http.post(`/base/group/metadata.json`, { metaDatas: metas })
  },

  /**
   * 拉取群管理员
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupAdmin(groupId) {
    return http.get(`/base/group/admin/${groupId}`)
  },

  /**
   * 获取群bannar列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupBannar(groupId) {
    return http.get(`/base/group/banners/${groupId}`)
  },

  /**
   * 修改群bannar
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  modifyGroupBanner(datas) {
    return http.post(`/base/group/banner`, { banners: datas })
  },

  /**
   * 添加或者修改群应用关系
   * @param {[type]} d [description]
   */
  addAppRelation(d) {
    return http.post('/base/group/app', d)
  },

  /**
   * 根据类型获取学校群组列表
   * @param  {[type]} schoolId [description]
   * @param  {[type]} type [description]
   * @return {[type]}         [description]
   */
  getSchoolGroupsByType(schoolId, type) {
    return http.get(`/base/group/query/${schoolId}/${type}`)
  },

  /**
   * 管理员修改
   * @param  {[type]} schoolId [description]
   * @param  {[type]} type [description]
   * @return {[type]}         [description]
   */
  modifyAppAdmins(data) {
    return http.post(`/base/app/admin`, { appManagers: data })
  },
  /**
   * 根据名称关键字搜索用户
   * @param  {[type]} keyword [description]
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getUserByKeyword(keyword, id) {
    return http.get(`/base/school/query/user/${id}?name=${keyword}`)
  },

  /**
   * 拉取校区
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getSchoolCampus(schoolId) {
    return http.get(`/base/school/campus/${schoolId}`)
  },
  /**
   * 获取学校年级
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSchoolGrades(groupId) {
    return http.get(`/base/school/grades/${groupId}`)
  },

  /**
   * 获取学校年级树
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSchoolGradesTree(schoolId) {
    return http.get(`/base/group/list/grades?schoolId=${schoolId}&tree=1`)
  },

  /**
   * 获取学校年级
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSchoolDefaultGrades(groupId) {
    return http.get(`/base/school/grade/default/${groupId}`)
  },

  /**
   * 获取学校班级
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getSchoolClasses(schoolId) {
    return http.get(`/base/school/campus/class/${schoolId}`)
  },

  /**
   * 获取省份列表
   * @param  {[type]} [description]
   * @return {[type]}          [description]
   */
  getProvinces() {
    return http.get(`/rest/common/query/province`)
  },

  /**
   * 获取省城市列表
   * @param  {[type]} provinceId [description]
   * @return {[type]}          [description]
   */
  getCities(provinceId) {
    return http.get(`/rest/common/query/city?provinceId=${provinceId}`)
  },

  /**
   * 获取城市区域列表
   * @param  {[type]} cityId [description]
   * @return {[type]}          [description]
   */
  getAreas(cityId) {
    return http.get(`/rest/common/query/area?cityId=${cityId}`)
  },
  /**
   * 新增修改场所
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyPlace(d) {
    return http.post('base/place/modify', d)
  },

  /**
   * 获取已经加入的校区
   * @return {[type]} [description]
   */
  getJoinSchool() {
    return http.get('/base/school/joined?isAdmin=1')
  },

  /**
   * 获取学校群组校区年级班级树数据
   * @return {[type]} [description]
   */
  getSchoolGroupTree(schoolId) {
    return http.get(`/base/school/group/structure/${schoolId}`)
  },

  /**
   * 获取风采用户
   * @return {[type]} [description]
   */
  getGroupStyleUsers(groupId, userType) {
    return http.get(`/base/group/styleUser/${groupId}?queryType=${userType}`)
  },

  /**
   * 获取学校行政班列表
   * @return {[type]} [description]
   */
  getAdministrativeClasses(gradeIds) {
    return http.get(`/base/group/list/grade/administrativeClasses?groupIds=${gradeIds}`)
  },

  /**
   * 获取学校场所列表
   * @return {[type]} [description]
   */
  getSchoolPlaces(schoolId) {
    return http.get(`/base/place/query?schoolId=${schoolId}`)
  },

  /**
   * 添加评论
   * @return {[type]} [description]
   */
  addReply(data) {
    return http.post(`/base/reply/add`, { reply: data })
  },

  /**
   * 获取存在该业务的群组列表
   * @params {[type]} schoolId [description]
   * @params {[type]} type [description]
   */
  getAppGroups(schoolId, type) {
    return http.get(`/base/group/list/appGroup.json?schoolId=${schoolId}&type=${type}`)
  },

  /**
   * 获取学校部门及小组列表
   * @params {[type]} schoolId [description]
   */
  getSchoolDepartmentsAndTeams(schoolId) {
    return http.get(`/base/group/list/departmentAndTeams?schoolId=${schoolId}`)
  },
  /**
   * 获取入群申请的列表
   * @param {*} groupId
   */
  getApplys(groupId) {
    return http.get(`/base/group/query/apply/${groupId}`)
  },
  /**
   * 获取入群申请的用户详情
   * @param {*} groupId
   * @param {*} userId
   */
  getApplyUser(groupId, userId) {
    return http.get(`/base/group/query/apply/detail/${groupId}/${userId}`)
  },
  /**
   * 入群申请（同意、拒绝）处理
   * @param {*} d
   */
  modifyApply(d) {
    return http.post('/base/group/audit/join', d)
  },
  /**
   * 获取学校全体老师成员
   * @param {*} schoolId
   */
  getSchoolTeachers(schoolId) {
    return http.get(`/base/group/teachers/${schoolId}`)
  },
  /**
   * 获取没有人脸的用户
   * @author clz
   * @date 2019-03-11
   * @param {*} groupId
   * @returns
   */
  getUnFaceList(groupId) {
    return http.get(`/business/facedetect/getUnBindFaceUser/${groupId}`)
  },
  /**
   * 修改人脸
   * @author zcy
   * @date 2019-05-6
   * @param {*} data
   * @returns
   */
  modifyFace(data) {
    return http.post(`/business/facedetect/modify`, data)
  },
  /**
   * 批量导入人脸
   * @author clz
   * @date 2019-03-11
   * @param {*} d
   * @returns
   */
  modifyUsersFace(d) {
    return http.post('/business/facedetect/batchUpLoadFaceImage', d)
  },
  /**
   * 获取线上真实学校
   * @author zcy
   * @date 2019-03-11
   * @param {*} groupId
   * @returns
   */
  getSchools(groupId) {
    return http.get(`/base/school/query/${groupId}`)
  },

  /**
   * 获取树形群组数据
   * @author zcy
   * @date 2019-05-08
   * @param {*} schoolId
   * @param {*} rootId
   * @returns
   */
  getTreeGroups(schoolId, rootId) {
    let url = `/base/school/treeGroups?schoolId=${schoolId}`
    if (rootId) {
      url = `${url}&rootId=${rootId}`
    }
    return http.get(url)
  },

  /**
   * 修改群组层级
   * @author zcy
   * @date 2019-05-08
   * @param {*} d
   * @returns
   */
  modifyGroupRootIds(d) {
    return http.post('/base/group/modify/rootid', d)
  },

  /**
   * 获取聊天用户
   * @author zcy
   * @date 2019-05-10
   * @param {*} d
   * @returns
   */
  getChatUsers(groupId) {
    return http.get(`/base/group/account/${groupId}?isChat=1`)
  },

  /**
   * 修改群组顺序
   * @author zcy
   * @date 2019-05-14
   * @param {*} d
   * @returns
   */
  modifyGroupSort(d) {
    return http.post('/base/group/user/order', d)
  },

  /**
   * 获取所属组织
   * @author zcy
   * @date 2019-05-22
   * @param {*} schoolId
   * @returns
   */
  getBelongOrg(schoolId) {
    return http.get(`/base/school/belong?schoolId=${schoolId}`)
  },

  /**
   * 获取职位信息
   * @author zcy
   * @date 2019-05-23
   * @param {*} schoolId
   * @param {*} type
   * @returns
   */
  getJobs(schoolId, type) {
    let url = `/base/school/positions?schoolId=${schoolId}`
    if (type) {
      url = `${url}&type=${type}`
    }
    return http.get(url)
  },

  /**
   * 根据类型获取群组
   * @author zcy
   * @date 2019-05-27
   * @param {*} ops
   * @returns
   */
  getGroupsByType(ops) {
    let url = `/base/group/queryByType?schoolId=${ops.schoolId}&type=${ops.type}`
    if (ops.isElectiveClass) {
      url = `${url}&isElectiveClass=${ops.isElectiveClass}`
    }
    return http.get(url)
  },

  /**
   * 根据类型获取群组
   * @author zcy
   * @date 2019-05-27
   * @param {*} data
   * @returns
   */
  commitBelongApply(data) {
    return http.post('/base/school/belong/apply', data)
  },

  /**
   * 点击量
   * @author zcy
   * @date 2019-06-12
   * @param {*} data
   * @returns
   */
  addDownloadCount(data) {
    return http.post(`/business/file/addDownloadHistory`, data)
  }
}
