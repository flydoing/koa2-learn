import MessageApi from '@/api/message'
import ArrayUtils from '@/utils/array'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      messages: [],
      currentPage: 1,
      hasNextPage: 0,
      editorMessage: {
        isPrivate: '0'
      }
    }
  },
  computed: {
    ...mapGetters({
      channelMessage: 'getChannelMessages'
    })
  },
  methods: {
    // modifyMessage 更新云端消息，同时需要更新本地消息（例如：本地置顶、点赞、评论等等）
    // modifyChannelMessage 不需要走云端的消息，更新本地UI
    ...mapActions(['modifyMessage', 'modifyChannelMessage', 'removeChannelMessage']),
    loadMessages() {},
    async getMessages(options) {
      let that = this
      let res = await MessageApi.getMessages(options)
      let messages = res.messages
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(messages)) {
          that.currentPage = res.currentPage
          that.hasNextPage = res.hasNextPage
          messages = messages.map(v => {
            if (v.type !== '1034' && v.type !== '1040') {
              return v.children ? v.children[0] : v
            }
            return v
          })
          that.messages = [...that.messages, ...messages]
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    async addMessage(message) {
      let that = this
      let res = await MessageApi.addMessage(message)
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(res.messages)) {
          res.messages.forEach(m => {
            that.modifyChannelMessage(m)
          })
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    scrollEnd(status, $load) {
      if (this.hasNextPage > 0) {
        this.loadMessages($load)
      } else {
        $load && $load.close()
      }
    },
    initData() {
      this.messages = []
      this.currentPage = 1
      this.hasNextPage = 0
    }
  },
  watch: {
    channelMessage(v) {
      let that = this
      if (Check.isRealArray(that.messages)) {
        v.some(m => {
          if (m.groupId === this.groupId) {
            let isExist = false
            that.messages.some((_m, i) => {
              if (_m.id === m.id) {
                if (m.status === 'd') {
                  that.messages.splice(i, 1)
                  setTimeout(() => {
                    that.removeChannelMessage(m)
                  }, 100)
                  return true
                }
                let praises = ArrayUtils.update(_m.praises || [], m.praises || [])
                let replys = ArrayUtils.update(_m.replys || [], m.replys || [])
                let toUsers = ArrayUtils.update(_m.toUsers || [], m.toUsers || [])
                that.$set(that.messages, i, {
                  ..._m,
                  ...m,
                  ...{
                    toUsers: toUsers,
                    praises: praises,
                    replys: replys
                  }
                })
                setTimeout(() => {
                  that.removeChannelMessage(m)
                }, 100)
                isExist = true
                return true
              }
            })
            // 不存在、
            // 且状态不是删除状态
            // 且不存在parentId 或者 parentId = 0 （主消息）
            if (!isExist && m.status !== 'd' && (m.parentId === 0 || !m.hasOwnProperty('parentId'))) {
              that.messages.push(m)
            }
          }
        })
      }
    }
  }
}
