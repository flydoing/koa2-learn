import http from '@/utils/http'
import C from '@/utils/object'
export default {
  /**
   * 获取基础对象
   * @param  {[type]} m [description]
   * @return {[type]}   [description]
   */
  getBaseMessage(m) {
    return Object.assign(
      {
        refId: new Date().getTime(),
        fromClientId: 'web94',
        fromUserId: 94,
        fromUserAvatar: '4gfz9wlgqtpkc2le595q9yz3',
        status: '1'
      },
      m
    )
  },

  /**
   * 根据消息类型获取消息列表
   * @param  {[type]} options.groupId       [description]
   * @param  {String} options.extensionType [description]
   * @param  {String} options.type          [description]
   * @return {[type]}                       [description]
   */
  getMessages({ groupId, currentPage = 1, ...args }) {
    let url = `/business/message/query/${groupId}?currentPage=${currentPage}&`
    let params = {
      groupId: groupId,
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },

  /**
   * 获取消息详情
   * @param  {[type]} mid     [description]
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getMessageById(mid) {
    return http.get(`/business/message/query/detail/${mid}`)
  },
  /**
   * 更新消息
   * @param  {[type]} m [description]
   * @return {[type]}   [description]
   */
  modifyMessage(m) {
    return http.post('/business/message/update', { message: m })
  },
  /**
   * 新建消息
   * @param  {[type]} m [description]
   * @return {[type]}   [description]
   */
  addMessage(m) {
    return http.post('/business/message/add', { message: m })
  },
  /**
   * 获取已读列表
   * @param  {[type]} msgId [description]
   * @return {[type]}       [description]
   */
  getReadedList(msgId) {
    return http.get(`/base/readed/query/${msgId}`)
  },

  /**
   * 修改消息readed
   * @param  {[type]} userId [description]
   * @return {[type]}        [description]
   */
  modifyMessageReaded(data) {
    return http.post(`/rest/readed/add.json`, data)
  },

  /**
   * 获取回复列表
   * @param  {[type]} msgId [description]
   * @return {[type]}       [description]
   */
  getReplyList(msgId) {
    return http.get(`/base/reply/query/${msgId}`)
  },

  /**
   * 获取点赞列表
   * @param  {[type]} msgId [description]
   * @return {[type]}       [description]
   */
  getPraiseList(msgId) {
    return http.get(`/base/praise/query/${msgId}`)
  },
  /**
   * 点赞
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyPraise(d) {
    return http.post('/base/praise/add', d)
  },
  /**
   * 转发
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  forward(d) {
    return http.post('/business/message/forward', d)
  },

  /**
   * 回复
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  reply(d) {
    return http.post('/base/reply/add', d)
  },

  /**
   * 查询消息模板
   * @param  {[type]} type [description]
   * @param  {[type]} userId [description]
   * @return {[type]}   [description]
   */
  getMessageTemplates(schoolId, type) {
    return http.get(`/business/message/query/template?schoolId=${schoolId}&appType=${type}`)
  },
  /**
   * 查询消息模板数量
   * @param  {[type]} type [description]
   * @param  {[type]} schoolId [description]
   * @return {[type]}   [description]
   */
  getTemplatesCount(schoolId, type) {
    return http.get(`/business/message/query/template/count?schoolId=${schoolId}&appType=${type}`)
  },

  /**
   * 保存消息模板
   * @param  {[type]} data [description]
   * @return {[type]}   [description]
   */
  saveMessageTemplate(data) {
    return http.post('/business/message/modify/template', { template: data })
  },
  /**
   * 拉取最新的消息
   * @param {*} groupId
   */
  getLatestMessage(groupId) {
    return http.get(`/business/message/query/latest/${groupId}`)
  },

  /**
   * 拉取转发消息列表
   * @param {*} data
   */
  getForwardMessage(data) {
    return http.post(`/rest/message/recommend`, data)
  },

  /**
   * 转发至公众号提交
   * @param {*} groupId
   * @param {*} data
   */
  forwardToWechatSubscription(groupId, data) {
    return http.post(`/business/portal/pushWeixin/${groupId}`, data)
  },

  /**
   * 拉取旧消息列表
   * @param {*} data
   */
  getRestMessage(data) {
    return http.post(`/rest/message/query`, data)
  }
}
