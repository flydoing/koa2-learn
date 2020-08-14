<template>
  <page title="课堂"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label v-if="routeQuery('fromUserId')==userId"
             @click="onBegin">开始上课</label>
    </div>
    <div class="classroom">
      <div class="classroom-lesson">
        <div class="classroom-lesson-show"
             v-if="classLesson.length > 0">
          <div class="design-box"
               v-for="(obj, o) in classLesson"
               :key="o">
            <div class="titleText">
              <div :style="boxStyle(obj)"
                   v-html="picText(obj)"></div>
            </div>
            <p v-html="picTitle(obj)"></p>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        editBol: false,
        showTemplate: false,
        isCommended: false,
        templateId: null,
        isClassed: true,
        childMsg: [],
        isNextPage: 0,
        isCurrentPage: 1,
        mainMessage: {},
        messagesResult: {} // 方便PC客户端处理逻辑
      }
    },
    computed: {
      classBefore() {
        return this.messages.filter(m => {
          return m.msgType === '1'
        })
      },
      classLesson() {
        return this.messages.filter(m => {
          return m.msgType === '2'
        })
      },
      classAfter() {
        return this.messages.filter(m => {
          return m.msgType === '3'
        })
      },
      isRefresh() {
        return !!this.socketlisten('VCourseRefresh') || false
      }
    },
    created() {
      // this.childMsg = this.messages.filter(m => {
      //   return m.type === '126901'
      // })
      this.init()
    },
    methods: {
      init() {
        // this.loadCommentMsgList()
        Api.getMessageById(this.routeQuery('msgId')).then(res => {
          if (res.message) {
            this.loadMessages()
            this.mainMessage = res.message
            this.editBol = this.userId === res.message.fromUserId
            // 是否自评
            this.isCommended = res.message.remark === '1'
            // 是否上已上过课
            this.isClassed = res.message.extensionType === '1'
            this.showTemplate = res.message.msgJson && JSON.parse(res.message.msgJson).hasOwnProperty('templateId')
            this.templateId = res.message.msgJson && JSON.parse(res.message.msgJson).templateId
          }
        })
      },
      leaveRoute(to, from, next) {
        this.socketSend({
          command: 'VCourse',
          commandValue: '1001'
        })
        return true
      },
      onBegin() {
        this.socketSend({
          command: 'VCourse',
          commandValue: '1002',
          data: {
            groupId: this.groupId,
            parentId: this.routeQuery('msgId'),
            VCourse: this.messagesResult
          }
        })
      },
      loadMessages() {
        const that = this
        this.getMessages({
          type: '1269',
          groupId: that.currentGroup.groupId,
          queryType: 'parentId',
          parentId: this.routeQuery('msgId')
        })
          .then(res => {
            this.messagesResult = res
          })
          .catch(res => {})
      },
      loadCommentMsgList() {
        let that = this
        that
          .getMessages({
            queryType: 'parentId',
            parentId: that.routeQuery('msgId'),
            currentPage: that.isCurrentPage,
            type: '126901',
            groupId: that.currentGroup.groupId
          })
          .then(res => {
            if (res.isNextPage && res.isNextPage > 0) {
              that.hasNextPage = res.hasNextPage
              that.isCurrentPage = res.isCurrentPage
            } else {
              that.hasNextPage = 0
            }
            if (res.messages.length > 0) {
              this.childMsg = [...this.childMsg, ...res.messages]
            }
          })
          .catch(res => {})
      },
      handleCommend() {
        this.routePush({
          name: 'createComment1192',
          query: {
            classroomType: '126901',
            templateId: this.templateId,
            msgId: this.routeQuery('msgId')
          }
        })
      },
      bgImage(image) {
        let that = this
        switch (image.type) {
          case 'photo':
            const url = that.url(image.fileId || image.id, 'thumb')
            return {
              'background-image': `url(${url})`,
              'background-repeat': 'no-repeat',
              'background-size': '100% 100%',
              'background-position': 'center'
            }
          case 'url':
            return {
              'background-color': '#fac965'
            }
          default:
            return {
              'background-color': '#64bfe6'
            }
        }
      },
      getQestionType(str) {
        switch (str) {
          case '6':
            return '单选题'
          case '7':
            return '多选题'
          case '8':
            return '解答题'
          case '12':
          case '9':
            return '填空题'
          case '16':
            return '连线题'
          case '14':
            return '判断题'
          default:
            return ''
        }
      },
      picTitle(obj) {
        return obj.medias ? (obj.medias[0].type === 'url' ? obj.medias[0].fileId : obj.medias[0].fileName) : this.getQestionType(JSON.parse(obj.extensionType).questions[0].type)
      },
      picText(obj) {
        return obj.medias ? (obj.medias[0].type === 'photo' ? '' : obj.medias[0].extension ? obj.medias[0].extension : '链接') : JSON.parse(obj.extensionType).questions[0].title
      },
      boxStyle(obj) {
        // let media = obj.medias ? obj.medias[0] : obj
        // return this.bgImage(media)
        return obj.medias ? this.bgImage(obj.medias[0]) : { 'background-color': '#6ec9bd' }
      },
      scrollEnd() {
        this.isNextPage > 0 && this.loadCommentMsgList()
      },
      handleQualityReport() {
        this.routePush({
          name: 'qualityReport1269',
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      }
    },
    destroyed() {
      this.socketSend({
        command: 'VCourse',
        commandValue: '1001'
      })
    },
    watch: {
      isRefresh(val) {
        if (val) {
          this.init()
        }
      },
      messagesResult(v) {
        // 给PC互动课堂用子消息
        this.socketSend({
          command: 'VCourse',
          commandValue: '1000',
          data: {
            groupId: this.mainMessage.groupId,
            msgCard: this.mainMessage,
            VCourse: v
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .classroom {
    background-color: nth($background, 1);

    &-before,
    &-lesson,
    &-after,
    &-template {
      &-bar {
        position: relative;
        @include flex;
        justify-content: space-between;
        padding: 0 rem(10) 0 rem(25);
        height: rem(40);
        line-height: rem(40);
        border-bottom: $border;
        background-color: #fff;
        font-size: rem(14);

        @include before {
          top: 50%;
          height: rem(20);
          width: rem(5);
          left: rem(10);
          margin-top: rem(-10);
          @include bc;
        }
      }
    }

    &-lesson {
      &-show {
        @include flex;
        @include jc(flex-start);
        @include ai(flex-start);
        flex-wrap: wrap;
        background-color: #fff;

        .design-box {
          margin: rem(10) rem(12);
          width: rem(186);
          height: rem(149);
          position: relative;
          background: #f8f8f8;

          .titleText {
            width: rem(186);
            height: rem(112);
            color: #fff;

            & > div {
              width: 100%;
              height: 100%;
              padding: rem(10);
              overflow: hidden;

              p {
                audio {
                  display: none;
                }

                div {
                  @include flex;
                  @include jc;
                  text-align: center;

                  img {
                    display: none !important;
                  }
                }
              }
              img {
                display: none !important;
              }
            }
          }

          & > p {
            height: rem(37);
            font-size: rem(16);
            line-height: rem(37);
            text-align: center;
            max-width: rem(197);
            box-sizing: border-box;
            padding: 0 rem(10);
            color: #525252;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
