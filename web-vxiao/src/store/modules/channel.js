import Vue from 'vue'
import Check from '@/utils/check'
import * as Storage from '@/utils/storage'
import Api from '@/api/message'
export default {
  state: {
    notifyMessages: {},
    channelMessages: {},
    remindMessages: {},
    downLine: {}
  },
  actions: {
    /**
     * 初始化本地缓存的未读消息
     * @param  {[type]} options.dispatch  [description]
     * @param  {[type]} options.rootState [description]
     * @return {[type]}                   [description]
     */
    async loadStorageMesasges({ dispatch, rootState }) {
      // 气泡：消息，待办
      let messages = await Storage.local.likeNot(`RM_${rootState.USERID}`)
      if (messages) {
        messages.forEach(m => {
          dispatch('socketAction', m)
        })
      }
    },
    /**
     * 接收通道推送的消息
     * @param  {[type]} options.commit    [description]
     * @param  {[type]} options.dispatch  [description]
     * @param  {[type]} options.rootState [description]
     * @param  {[type]} message           [description]
     * @return {[type]}                   [description]
     */
    socketAction({ commit, dispatch, rootState }, message) {
      if (Check.isNull(message)) {
        return
      }
      if (Check.isRealArray(message.content)) {
        message.content.forEach(m => {
          dispatch('socketAction', m)
        })
        return
      }
      if (message.hasOwnProperty('groupId')) {
        // TODO 验证群是否存在
      }
      if (!Check.isObject(message)) {
        message = JSON.parse(message)
      }
      if (message.type === '1' && message.status !== 'd' && message.status !== '4') {
        // 系统通知消息（气泡）如果正好是当前群，则不添加气泡
        dispatch('saveNotify', message)
        // dispatch('saveChannelMessages', message)
      } else if (message.type === '3') {
        // 业务消息推送
        dispatch('saveChannelMessages', message)
      } else if (message.type === '9000') {
        // 系统广播
      } else if (message.type === '1000') {
        // 未读消息同步
      } else if (message.type === '') {
        // 系统消息
      } else if (message.type === '1008' || message.type === '1009') {
        // IM主会话
        dispatch('im/modifyImSession', message, { root: true })
      } else if (message.type === '3003') {
        // IM子消息
        dispatch('im/saveImBubble', message)
      } else if (message.type === '1011' || message.type === '1016' || message.type === '1048') {
        // 通知、动态、表彰
      } else if (message.type === '6') {
        // 踢下线消息
        dispatch('downLine', message)
      } else if (message.type === '3_1') {
        // 删除提醒消息（客户端不会删主消息）
      } else if (message.type === '12') {
        // 无任何提示类型（通知前端做拉取操作）
      } else if (message.type === '14') {
        // 拉取禁言设置
      } else if (message.type === '15') {
        // 互动课堂答题情况
      } else if (message.type === '17') {
        // 拉取通知
      } else if (message.type === '26') {
        // 批量导入人脸的反馈数据
        dispatch('saveNotify', message)
      } else if (message.type === '28') {
        // 应用提示，未见
        dispatch('saveRemind', message)
      }
    },
    /**
     * 下线通知
     * @param  {[type]} options.commit [description]
     * @param  {[type]} message        [description]
     * @return {[type]}                [description]
     */
    downLine({ commit }, message) {
      commit('downLine', message)
    },
    /**
     * 保存未读消息
     * @param  {[type]} options.commit    [description]
     * @param  {[type]} options.rootState [description]
     * @param  {[type]} message           [description]
     * @return {[type]}                   [description]
     */
    saveNotify({ commit, rootState }, message) {
      // if (rootState.group.groupId !== message.groupId) {
      commit('saveNotify', message)
      Storage.local.set(`RM_${rootState.USERID}_${message.id}`, JSON.stringify(message))
      // }
    },
    saveNotifyTodolist({ commit, rootState }, message) {
      if (rootState.group.groupId === message.groupId) {
        commit('saveNotify', message)
        if (message.status !== 'd' && message.status !== '4') {
          Storage.local.set(`RM_${rootState.USERID}_${message.id}`, JSON.stringify(message))
        } else {
          Storage.local.set(`RM_${rootState.USERID}_${message.id}_readTodo`, JSON.stringify(message)) // 待办已读
        }
      }
    },
    /**
     * 更新未读消息（删除）
     * @param  {[type]} options.commit    [description]
     * @param  {[type]} options.rootState [description]
     * @param  {[type]} message           [description]
     * @return {[type]}                   [description]
     */
    modifyNotify({ commit, rootState }, message) {
      commit('modifyNotify', message)
      Storage.local.remove(`RM_${rootState.USERID}_${message.id}`)
      // 标记为已读，记录在localstorge
      if (message.msgType === '27') {
        // Storage.local.set(`RM_${rootState.USERID}_${message.id}_readTodo`, JSON.stringify(message)) // 待办已读
        if (message.status !== 'd' && message.status !== '4') {
          Storage.local.set(`RM_${rootState.USERID}_${message.id}`, JSON.stringify(message))
        } else {
          Storage.local.set(`RM_${rootState.USERID}_${message.id}_readTodo`, JSON.stringify(message)) // 待办已读
        }
      } else {
        Storage.local.set(`RM_${rootState.USERID}_${message.id}_readNews`, JSON.stringify(message)) // 消息已读
      }
    },
    saveRemind({ commit, rootState }, message) {
      // if (rootState.group.groupId !== message.groupId) {
      commit('saveRemind', message)
      Storage.local.set(`REMIND_${rootState.USERID}_${message.groupId}_${message.msgType}`, JSON.stringify(message))
      // }
    },
    /**
     * 保存通道推送消息（方便更新主列表）
     * @param  {[type]} options.commit [description]
     * @param  {[type]} message        [description]
     * @return {[type]}                [description]
     */
    async saveChannelMessages({ commit, dispatch }, message) {
      if (message.parentId) {
        let res = await Api.getMessageById(message.parentId)
        return new Promise((resolve, reject) => {
          if (res.message) {
            commit('saveChannelMessages', res.message)
          } else {
            commit('modifyNotify', message)
          }
        })
      }
    },
    /**
     * 更新主列表（不需要走云端的入口，例如本地的点赞）
     * @param  {[type]} options.commit [description]
     * @param  {[type]} message        [description]
     * @return {[type]}                [description]
     */
    async modifyChannelMessage({ commit }, message) {
      Storage.session.set(`_message_cache`, JSON.stringify(message))
      commit('saveChannelMessages', message)
    },
    /**
     * 更新云端消息，同时需要更新本地消息（例如：本地置顶、点赞、评论等等）
     * @param  {[type]} options.commit   [description]
     * @param  {[type]} options.dispatch [description]
     * @param  {[type]} message          [description]
     * @return {[type]}                  [description]
     */
    async modifyMessage({ commit, dispatch }, message) {
      const res = await Api.modifyMessage(message)
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(res.messages)) {
          res.messages.forEach(m => {
            dispatch('modifyChannelMessage', m)
          })
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    /**
     * 删除队列消息（更新完之后，需要删除）
     * @param  {[type]} options.commit [description]
     * @param  {[type]} message        [description]
     * @return {[type]}                [description]
     */
    removeChannelMessage({ commit }, message) {
      commit('removeChannelMessage', message)
    }
  },
  getters: {
    getDownLine(state) {
      return state.downLine
    },
    getNotifyBubble(state) {
      return Object.values(state.notifyMessages) || []
    },
    getChannelMessages(state) {
      return Object.values(state.channelMessages) || []
    },
    getRemindMessages(state) {
      return Object.values(state.remindMessages) || []
    }
  },
  mutations: {
    downLine(state, message) {
      state.downLine = message
    },
    saveNotify(state, message) {
      Vue.set(state.notifyMessages, message.id, message)
    },
    modifyNotify(state, message) {
      Vue.delete(state.notifyMessages, message.id)
    },
    saveChannelMessages(state, message) {
      Vue.set(state.channelMessages, message.id, message)
    },
    removeChannelMessage(state, message) {
      Vue.delete(state.channelMessages, message.id)
    },
    saveRemind(state, message) {
      Vue.set(state.remindMessages, message.id, message)
    },
    modifyRemind(state, message) {
      Vue.delete(state.remindMessages, message.id)
    }
  }
}
