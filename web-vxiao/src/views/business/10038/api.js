import http from '@/utils/http'
export default {
  /**
   * 获取栏目列表
   * @author zcy
   * @date 2018-05-31
   * @param {*} schoolId
   */
  getColumns(schoolId, isQuery) {
    let url = `/base/institution/project/list?schoolId=${schoolId}`
    if (isQuery) {
      url = `${url}&isQuery=${isQuery}`
    }
    return http.get(url)
  },
  /**
   *
   * 编辑修改栏目
   * @author zcy
   * @date 2018-05-31
   * @param {*} d
   */
  modifyColumn(d) {
    return http.post('/base/institution/project/modify', d)
  },

  /**
   * 获取字段列表
   * @author zcy
   * @date 2018-05-31
   * @param {*} columnId
   * @param {*} schoolId
   */
  getFieldsByColumnId(columnId, schoolId) {
    let url = `/base/institution/project/items?projectId=${columnId}`
    if (schoolId) {
      url = `${url}&schoolId=${schoolId}`
    }
    return http.get(url)
  },

  /**
   *
   * 编辑修改栏目字段
   * @author zcy
   * @date 2018-05-31
   * @param {*} d
   */
  modifyField(d) {
    return http.post(`/base/institution/project/item/modify`, d)
  },

  /**
   *
   * 保存字段结果
   * @author zcy
   * @date 2018-05-31
   * @param {*} d
   */
  saveFieldResult(d) {
    return http.post(`/base/institution/commit`, d)
  },

  /**
   *
   * 获取组织列表
   * @author zcy
   * @date 2018-05-31
   * @param {*} rootId
   */
  getOrgs(rootId) {
    return http.get(`/base/institution/belong/summary?rootId=${rootId}`)
  },

  /**
   *
   * 栏目排序
   * @author zcy
   * @date 2018-06-12
   * @param {*} data
   */
  commitColumnSort(data) {
    return http.post(`/base/institution/project/sort`, data)
  },

  /**
   *
   * 字段排序
   * @author zcy
   * @date 2018-06-12
   * @param {*} data
   */
  commitFieldSort(data) {
    return http.post(`/base/institution/project/item/sort`, data)
  },

  /**
   *
   * 获取组织列表
   * @author zcy
   * @date 2018-06-13
   * @param {*} schoolId
   * @param {*} fileId
   */
  importColumnInfo(schoolId, fileId) {
    return http.get(`/base/institution/import?schoolId=${schoolId}&fileId=${fileId}`)
  }
}
