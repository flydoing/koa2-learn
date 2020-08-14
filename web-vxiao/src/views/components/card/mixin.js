import Check from '@/utils/check'
import Media from '@/constant/media'
import DateFormat from '@/utils/date'
import R from '@/views/group/mixin'
import Api from '@/api/message'
import { mapActions } from 'vuex'
export default {
  mixins: [R],
  components: {
    CardContent: resolve => require(['./ui/Content'], resolve),
    CardCounter: resolve => require(['./ui/Counter'], resolve),
    CardFiles: resolve => require(['./ui/Files'], resolve),
    CardHref: resolve => require(['./ui/Href'], resolve),
    CardImages: resolve => require(['./ui/Images'], resolve),
    CardPraise: resolve => require(['./ui/Praise'], resolve),
    CardReply: resolve => require(['./ui/Reply'], resolve),
    CardStar: resolve => require(['./ui/Star'], resolve),
    CardReplyInput: resolve => require(['./ui/ReplyInput'], resolve),
    CardDown: resolve => require(['./ui/Down'], resolve),
    CardAudio: resolve => require(['@/views/components/card/ui/Audio'], resolve),
    CardVideo: resolve => require(['@/views/components/card/ui/Video'], resolve),
    CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve),
    CardLinks: resolve => require(['@/views/components/card/ui/Link'], resolve)
  },
  data() {
    return {
      showInput: false,
      replyUser: {}
    }
  },
  computed: {
    m() {
      return this.converMessage(this.message)
    }
  },
  methods: {
    ...mapActions(['setCurrentApp', 'showGroupContacts', 'setMenuType']),
    modify(m) {
      this.modifyChannelMessage(m)
    },
    userDetail(userId) {
      let uId = userId || this.message.fromUserId
      if (uId) {
        this.routePushModel({
          name: 'userDetail',
          params: {
            userId: uId
          },
          query: {
            groupId: this.message.groupId
          }
        })
      }
    },
    praise(u, callback) {},
    entryLogo(logo) {
      return {
        'background-image': 'url(' + logo + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center'
      }
    },
    getApp(type, groupId) {
      return this.$store.getters.getAppByType(type, groupId)
    },
    handleLogo({ queryType = 'appType', userId }) {
      let ms = this.message
      if (ms.type === '1068') {
        this.userDetail()
      } else if (queryType === 'appType') {
        let version = window.dataModule
        if (version.indexOf('chinamobile.html') !== -1) {
          this.setMenuType(ms.type)
          this.showGroupContacts(false)
          this.setCurrentApp(this.getApp(ms.type, ms.groupId))
        } else {
          this.routePushModel({
            path: '/vx/group/business',
            query: {
              appType: ms.type,
              groupId: ms.groupId
            }
          })
        }
      } else {
        this.userDetail()
      }
    },
    handleHref() {},
    handleReply(u) {
      this.showInput = !this.showInput
    },
    handleReplyInput(r) {
      if (r.fromUserId !== this.USER.id) {
        this.showInput = true
        this.replyUser = {
          userId: r.fromUserId,
          userName: r.fromUserName,
          userAvatar: r.fromUserAvatar
        }
      }
    },
    handlePraise() {
      let that = this
      let p = {
        groupId: that.m.groupId,
        msgId: that.m.id,
        userId: that.USER.id,
        isPraise: 1
      }
      if (Check.isRealArray(that.m.praises)) {
        that.m.praises.some((_p, i) => {
          if (_p.userId === that.USER.id) {
            p = {
              ..._p,
              isPraise: _p.isPraise === 1 ? 0 : 1
            }
          }
        })
      }
      Api.modifyPraise({ praise: p }).then(res => {
        that.modifyChannelMessage({
          ...that.message,
          praises: res.praises
        })
      })
    },
    handleReaded() {
      this.routePushModel({
        name: 'readedList',
        params: {
          msgId: this.message.id
        }
      })
    },
    // 转换卡片消息
    converMessage(m) {
      if (Check.isNull(m)) {
        return
      }
      const that = this
      let createTime = DateFormat.format(m.createTime, DateFormat.YMD_HMS)
      let _m = {
        ...m,
        // time: '昨天 18:22',
        time: DateFormat.converFormat(new Date(createTime)),
        name: (() => {
          if (m.type !== '' && m.type !== '1068') {
            return m.businessName
          }
          return m.fromUserName
        })(),
        label: (() => {
          if (m.type !== '' && m.type !== '1068') {
            return m.fromUserName
          }
          return ''
        })(),
        content: that.converContent(m.content),
        avatar: (() => {
          if (m.type !== '' && m.type !== '1068') {
            let app = that.$store.getters.getAppByType(m.type)
            if (app) {
              return that.url(app.cardShowLogo, 'thumb')
            }
          }
          return that.url(m.fromUserAvatar, 'thumb')
        })(),
        images: [],
        files: [],
        audios: [],
        video: null,
        urls: [],
        replys: (rs => {
          if (rs) {
            return rs.filter(r => {
              return r.fromClientId !== 'system' && r.status === '1'
            })
          }
        })(m.replys),
        showCounter: true,
        counter: (() => {
          return {
            label: '已阅',
            readCount: m.readCount,
            isPraise: (() => {
              if (m.praises) {
                return Check.isRealArray(
                  m.praises.filter(p => {
                    return p.userId === that.userId && p.isPraise === 1
                  })
                )
              }
            })()
          }
        })()
      }
      if (Check.isRealArray(m.medias)) {
        m.medias.forEach((v, i) => {
          if (v.status === 'd') {
            return
          }
          if (v.type === Media.PHOTO) {
            _m.images.push({
              ...v,
              thumb: v.thumb ? that.url(v.thumb) : that.url(v.fileId, 'thumb'),
              src: that.url(v.fileId)
            })
          } else if (v.type === Media.FILE) {
            let href = that.url(v.fileId)
            // 在线预览附件
            if ('doc/docx/xls/xlsx/ppt/pptx/pdf'.indexOf(v.extension) >= 0) {
              href = `${this.$store.state.FILE_URL}/view/${v.fileId}`
            }
            if (v.id < 0) {
              href = `/business/resource/import/download/${v.fileId}/${v.fileName}?userId=${this.userId}`
            }
            _m.files.push({
              href: href,
              sizeText: Media.size(v.size),
              ...v
            })
          } else if (v.type === Media.AUDIO) {
            _m.audios.push({
              ...v
            })
          } else if (v.type === Media.URL) {
            _m.urls.push({
              ...v
            })
          } else if (v.type === Media.VIDEO) {
            _m.video = { ...v }
          }
        })
      }
      return _m
    }
  }
}
