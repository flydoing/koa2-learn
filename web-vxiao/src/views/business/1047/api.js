import http from '@/utils/http'
export default {
  getTeacherDetail(msgId) {
    return http.get(`/business/praxis/query/${msgId}`)
  },
  getTeacherRanking(msgId) {
    return http.get(`/business/praxis/query/ranking/${msgId}`)
  },
  getQuetionById(praxisId, questionId) {
    return http.get(`/business/praxis/query/question/detail/${questionId}.json?praixsId=${praxisId}`)
  },
  getOptionSelectUsers(praxisId, optionId, questionType) {
    let url = `/business/praxis/query/answer/detail/${praxisId}/${optionId}.json`
    if (questionType) {
      url = `/business/praxis/query/answer/detail/${praxisId}/${optionId}.json?questionType=${questionType}`
    }
    return http.get(url)
  },
  /**
   * 拉取解答题 答题情况
   */
  getQuestionAnswers(praxisId, questionId, type) {
    return http.get(`/business/praxis/query/${praxisId}/${questionId}.json?type=${type}`)
  },
  /**
   * 解答题 批改
   */
  commitCorrect(d) {
    return http.post('/business/praxis/teacher/correnting', {
      praxis: d
    })
  },
  /**
   * 图片排序题 正确率
   */
  getImgSortCorrectRate(questionId, type) {
    return http.get(`/rest/praxis/query/question/detail/${questionId}/${type}.json`)
  },
  /**
   * 提交 图片排序 答卷
   */
  commitImgSort(d) {
    return http.post('/business/praxis/merge/image.json', d)
  },
  /**
   * 习题导入
   * @param {*} fileId
   * @param {appType} type
   */
  importPraxis(fileId, type) {
    return http.get(`/business/praxis/import/word?fileId=${fileId}&type=${type}`)
  },
  /**
   * 习题草稿列表
   * @param {*} groupId
   */
  getPraxisDrafts(groupId) {
    return http.get(`/business/praxis/query/draft/list/${groupId}`)
  },
  /**
   * 习题草稿详情
   * @param {*} praxisId
   */
  getDraftDetail(praxisId) {
    return http.get(`/business/praxis/query/draft/${praxisId}`)
  }
}
