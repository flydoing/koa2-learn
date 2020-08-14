<template>
  <Page title="消息"
        closePrompt
        ref="_page">
    <div class="im-box">
      <div class="im-before text-color"
           v-if="ms && ms.length>0"
           @click="onHistory">
        <i v-if="loading"
           class="el-icon-loading"></i>
        <template V-if="hasMore">查看更多消息</template>
      </div>
      <template v-for="(m,i) in messages">
        <div v-if="m.type==='time'"
             class="im-time"
             :key="i">{{m.content}}</div>
        <div v-else
             :class="imStyle(m)"
             :key="i">
          <img class="avatar"
               v-lazy="{src:url(m.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
               alt='头像' />
          <div class="main">
            <div v-if="m.extensionType === '1008'"
                 class="nick"
                 v-html="m.fromUserName"></div>
            <div class="content"
                 v-viewer.static>
              <i class="el-icon-loading"
                 v-if="!m.id"></i>
              <template v-for="(v,k) in getImMedia(m)">
                <template v-if="k==='image'">
                  <img :src="v.thumb"
                       :key="k"
                       :data-source="v.src">
                </template>
                <template v-else-if="k==='file'">
                  <a :href="v.href"
                     class="im-file"
                     target="_blank"
                     :key="k">
                    <div class="logo"><img :src="fileLogo(v)"
                           alt='头像'></div>
                    <div class="info">
                      <div class="title">{{v.fileName}}</div>
                      <div class="remark">{{v.sizeText}}</div>
                    </div>
                  </a>
                </template>
                <template v-else-if="k==='audio'"></template>
                <template v-else-if="k==='video'"></template>
                <template v-else>
                  <span v-html="converContent(v)"
                        :key="k"></span>
                </template>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div slot="bottom"
         class="send-block">
      <keep-alive>
        <EditorIm :store.sync="form"
                  @submit="send" />
      </keep-alive>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import ArrayUtils from '@/utils/array'
  import Media from '@/constant/media'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Emoji: resolve => require(['@/views/components/Emoji'], resolve),
      EditorIm: resolve => require(['@/components/editor/EditorIm'], resolve)
    },
    data() {
      return {
        form: {
          content: ''
        },
        hasMore: true,
        loading: false,
        showEmoji: false,
        options: {
          inline: false,
          button: false,
          navbar: false,
          title: false,
          toolbar: true,
          tooltip: false,
          movable: true,
          zoomable: true,
          rotatable: true,
          scalable: false,
          transition: true,
          fullscreen: false,
          keyboard: true,
          url: 'data-source'
        }
      }
    },
    computed: {
      ...mapGetters({
        currentSession: 'im/getCurrentSession',
        ms: 'im/getImMessages',
        toEnd: 'im/isScrollRefresh'
      }),
      commonImMessage() {
        let userId = this.routeQuery('userId')
        if (this.currentSession) {
          return {
            type: this.currentSession.type,
            parentId: this.currentSession.id,
            userId: this.currentSession.userId,
            groupId: this.currentSession.groupId
          }
        } else if (userId) {
          return {
            type: '1009',
            userId: userId
          }
        }
      },
      minMessage() {
        return this.ms[0]
      },
      messages() {
        let _ms = [...this.ms]
        if (Check.isRealArray(this.ms)) {
          let bTime = new Date(this.ms[0].createTime).getTime()
          let p = 0 // 用户记录新的索引位置
          this.ms.forEach((m, i) => {
            let cTime = new Date(m.createTime).getTime()
            if (cTime - bTime > 300000) {
              bTime = cTime
              _ms.splice(i + p, 0, {
                type: 'time',
                content: DateUtils.format(m.createTime, DateUtils.MDHM)
              })
              p++
            }
          })
        }
        return _ms
      }
    },
    methods: {
      ...mapActions({
        loadImMessageList: 'im/loadImMessageList',
        sendImMessage: 'im/sendImMessage',
        saveImMessage: 'im/saveImMessage'
      }),
      send(content, medias) {
        if (!Check.isNullString(this.form.content)) {
          let child = {
            content: this.form.content,
            ...this.commonMessage(),
            ...this.commonImMessage
          }
          this.saveImMessage({ ...child, type: '3003' })
          this.sendImMessage(child)
          if (!Check.isRealArray(this.form.medias)) {
            this.form = {}
          }
          setTimeout(() => {
            this.$set(this.form, 'content', '')
            this.scrollEnd()
          }, 500)
        }
        if (Check.isRealArray(this.form.medias)) {
          this.form.medias.some(media => {
            let child = {
              medias: [media],
              ...this.commonMessage(),
              ...this.commonImMessage
            }
            this.saveImMessage({ ...child, type: '3003' })
            this.sendImMessage(child)
            setTimeout(() => {
              this.scrollEnd()
            }, 500)
          })
          this.form = {}
        }
      },
      onHistory() {
        this.loading = true
        this.loadImMessageList({
          sessionId: this.currentSession.id,
          minId: this.minMessage.id,
          groupId: this.minMessage.groupId
        }).then(res => {
          this.loading = false
        })
      },
      enter(e) {
        e.returnValue = false
      },
      getImMedia(m) {
        let _m = {}
        if (Check.isRealArray(m.medias)) {
          m.medias.forEach((v, i) => {
            if (v.type === Media.PHOTO) {
              _m.image = {
                thumb: this.url(v.fileId, 'thumb'),
                src: this.url(v.fileId),
                ...v
              }
            } else if (v.type === Media.FILE) {
              let href = this.url(v.fileId)
              // 在线预览附件
              if ('doc/docx/xls/xlsx/ppt/pptx/pdf'.indexOf(v.extension) >= 0) {
                href = `${this.$store.state.FILE_URL}/view/${v.fileId}`
              }
              _m.file = {
                href: href,
                sizeText: Media.size(v.size),
                ...v
              }
            } else if (v.type === Media.AUDIO) {
              _m.audio = { ...v }
            } else if (v.type === Media.VIDEO) {
              _m.video = { ...v }
            } else if (v.type === Media.URL) {
              _m.url = { ...v }
            } else if (v.type === 'VOICE') {
              _m.content = '[语音通话]'
            } else {
              _m.content = m.content
            }
          })
        } else {
          _m.content = m.content
        }
        return _m
      },
      imStyle(m) {
        return [
          `im-block`,
          {
            [`right`]: m.fromUserId === this.USER.id
          }
        ]
      },
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            [
              '3gp',
              'aac',
              'amr',
              'apk',
              'avi',
              'doc',
              'docx',
              'gif',
              'jpg',
              'link',
              'mov',
              'mp3',
              'mp4',
              'pdf',
              'png',
              'ppt',
              'rar',
              'rtf',
              'test',
              'txt',
              'xlsx',
              'zip'
            ],
            file.extension
          )
        ) {
          return '/static/f/icon_query@2x.png'
        }
        return `/static/f/icon_${file.extension}@2x.png`
      },
      scrollEnd() {
        this.$refs._page.getScroller().scrollEnd()
      }
    },
    mounted() {
      if (this.currentSession && !Check.isRealArray(this.ms)) {
        this.loadImMessageList({ sessionId: this.currentSession.id }).then(res => {
          setTimeout(() => {
            this.scrollEnd()
          }, 100)
        })
      }
    },
    watch: {
      // 收到新消息，则滚到最下面
      toEnd() {
        setTimeout(() => {
          this.scrollEnd()
        }, 100)
      },
      currentSession() {
        if (!Check.isRealArray(this.ms) && this.currentSession) {
          this.loadImMessageList({ sessionId: this.currentSession.id }).then(res => {
            this.$nextTick(() => {
              this.scrollEnd()
            })
          })
        }
        this.$nextTick(() => {
          this.scrollEnd()
        })
      }
    }
  }
</script>
<style lang="scss">
  .im {
    &-block {
      overflow: hidden;
      padding: nth($padding, 2) rem(0);

      .avatar {
        float: left;
        width: rem(35);
        height: rem(35);
        margin: rem(0) rem(10);
      }
      .main {
        float: left;
        .nick {
          font-size: rem(13);
          margin-bottom: rem(5);
          color: nth($font-color, 7);
        }
        .content {
          position: relative;
          background: nth($background, 9);
          padding: nth($padding, 2);
          line-height: rem(20);
          min-height: rem(20);
          border-radius: rem(3);
          word-break: break-all;
          max-width: rem(400);

          i {
            position: absolute;
            left: rem(-20);
            @include fc;
            top: rem(5);
          }
        }
      }

      &.right {
        .avatar,
        .main {
          float: right;
          .nick {
            text-align: right;
          }
        }
        .content {
          // @include bc;
          // color: #fff;
          color: #606266;

          .text-color {
            color: #fff !important;
          }
        }
      }
    }

    &-before,
    &-time {
      margin: 0 auto;
      text-align: center;
      font-size: rem(12);
      line-height: rem(22);
      display: table;
    }

    &-time {
      color: #fff;
      border-radius: rem(3);
      padding: 0 rem(10);
      background: nth($background, 5);
    }

    &-file {
      display: block;
      position: relative;
      overflow: hidden;
      background: nth($background, 9);

      &:hover {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(225, 225, 225, 0.3);
        }
      }

      & > div {
        float: left;
      }

      .logo {
        img {
          display: block;
          width: rem(45);
          height: rem(45);
        }
      }

      .info {
        height: rem(45);
        padding: 0 nth($padding, 3);
        @include flex;
        @include jc;
        @include ai(flex-start);
        @include fd;
      }

      .remark {
        font-size: rem(12);
      }
    }
  }

  .send {
    &-block {
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
      height: rem(130);
    }

    &-bar {
      height: rem(30);
      line-height: rem(30);
      padding: rem(0) rem(10);

      .ico {
        font-size: rem(18);
        margin: rem(0) rem(5);
      }
    }

    &-textarea {
      position: relative;
      height: rem(100);

      textarea {
        border: 0;
        width: 100%;
        height: rem(60);
        font-size: rem(13);
        padding: rem(0) rem(15);
      }

      .button {
        position: absolute;
        bottom: rem(10);
        right: rem(10);
      }
    }
  }
</style>
