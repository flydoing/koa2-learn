/**
 * 打卡详情公用处理逻辑
 */
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import MessageApi from '@/api/message'
import MixinMessage from '@/views/group/mixinMessage'
import ArrayUtils from '@/utils/array'

export default {
  mixins: [R, MixinMessage],
  data() {
    return {
      childMessages: [],
      message: null,
      date: '',
      list: []
    }
  },
  computed: {},
  methods: {
    getMessage() {
      const that = this
      let msgId = that.routeQuery('msgId')
      MessageApi.getMessageById(msgId).then(res => {
        this.modifyChannelMessage({ ...res.message })
        let m = res.message
        if (!Check.isNullString(m.extensionType)) {
          let json = JSON.parse(m.extensionType)
          that.list = json.records.map(v => {
            v.selected = v.stime === m.extension
            return v
          })
        }
        that.message = m
        that.date = m.extension
        this.getChildMessages(m.extension)
      })
    },
    getChildMessages(date) {
      this.getMessages({
        groupId: this.groupId,
        type: '125501',
        queryType: 'parentId',
        parentId: this.message.id,
        userId: this.userId,
        startDate: date,
        endDate: date,
        currentPage: this.currentPage
      })
        .then(res => {
          if (this.date === date) {
            this.childMessages.push(...res.messages)
          } else {
            this.childMessages = res.messages
          }
          this.date = date
        })
        .catch(res => {
          if (this.date !== date) {
            this.childMessages = []
          }
          this.date = date
        })
    },
    handleItem(item) {
      if (item.isShow === '0') {
        return false
      }
      this.list = this.list.map(v => {
        v.selected = v.sdate === item.sdate
        return v
      })
      this.childMessages = []
      this.getChildMessages(item.stime)
    },
    scrollEnd() {
      if (this.hasNextPage > 0) {
        this.getChildMessages(this.date)
      }
    }
  },
  mounted() {
    this.getMessage()
  },
  watch: {
    channelMessage(v) {
      let that = this
      if (Check.isRealArray(that.childMessages)) {
        v.some(m => {
          if (m.groupId === this.groupId) {
            let isExist = false
            that.childMessages.some((_m, i) => {
              if (_m.id === m.id) {
                if (m.status === 'd') {
                  that.childMessages.splice(i, 1)
                  setTimeout(() => {
                    that.removeChannelMessage(m)
                  }, 100)
                  return true
                }
                let praises = ArrayUtils.update(_m.praises || [], m.praises || [])
                let replys = ArrayUtils.update(_m.replys || [], m.replys || [])
                let toUsers = ArrayUtils.update(_m.toUsers || [], m.toUsers || [])
                that.$set(that.childMessages, i, {
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
              that.childMessages.push(m)
            }
          }
        })
      }
    }
  }
}
