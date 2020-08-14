import http from '@/utils/http'
export default {
  loadOnlineDetail(msgId) {
    return http.get(`/business/praxis/query/answer/situation/${msgId}`)
  },
  loadRanking(msgId) {
    return http.get(`/business/praxis/query/ranking/${msgId}`)
  },
  loadAnswerQuestions(praxisId, questionId, type) {
    return http.get(`/business/praxis/query/answer/detail/${praxisId}/${questionId}.json?questionType=${type}`)
  },
  loadStudentDetail(msgId, userId) {
    return http.get(`/business/praxis/query/student/${msgId}/${userId}`)
  }
}
