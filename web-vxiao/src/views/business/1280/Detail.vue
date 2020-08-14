<template>
  <Page title="直播详情">
    <div v-lazy:background-image="bg"
         class="live-block"
         @click="onClick">
      <div class="live-status"
           :class="{'begin':message.status==='1','end':message.status==='6'}">
        <!-- <div :class="{'begin': true}"> -->
        <span>{{statusText}}</span>
      </div>
      <div class="live-full"
           v-if="message.status==='1'">
        <img :src='liveFullscreen'
             alt="">
      </div>
    </div>
    <div class="category-title"></div>
    <item @click="handleAudience()">
      <div slot="main"
           v-html="'当前观众'"></div>
      <div slot="remark"
           class="ellipsis">{{count}}</div>
    </item>
    <!-- move============== -->
    <div class="cd-tabs-content"
         v-if="replies.length>0">
      <div class="category-title"></div>
      <!-- <template v-if="curTab.type==1"> -->
      <template>
        <ItemList v-for="(reply,i) in replies"
                  :key="i"
                  @click="handleReply(reply)">
          <div slot="avatar">
            <img class="avatar"
                 v-lazy="{src:toAvatar(reply.fromUserAvatar),error:Image.ICO_USER}"
                 alt='头像' />
          </div>
          <span slot="title">
            {{reply.fromUserName}}
            <template v-if="reply.userName">
              <span>回复</span>
              <span class="text-color"> {{reply.userName}}</span>：
            </template>
          </span>
          <span slot="main"
                class="main-wrap"
                v-html="converContent(reply.content)"></span>
          <span slot="remark"
                v-html="toDate(reply.createTime)"></span>
          <template slot="after"></template>
        </ItemList>

      </template>
    </div>
    <div class='pagination-more'
         @click="getAudienceBackward()"
         :class="{'is-click':hasMore}">
      {{text}}
    </div>
    <div slot="bottom"
         class="send-block">
      <keep-alive>
        <EditorIm :store.sync="form"
                  @submit="send"
                  :placeholder="placeholder"
                  :toolbars="['emoji']" />
      </keep-alive>
    </div>
    <!-- move============= -->
  </Page>
</template>
<script>
  import http from '@/utils/http'
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [R],
    data() {
      return {
        liveFullscreen: `/static/live_fullscreen.png`,
        msgId: '',
        message: {},
        total: 0,
        appPayUsers: [],
        replies: [],
        form: {
          replyUser: null,
          content: ''
        },
        audienceTimeout: null,
        count: 0,
        id: '',
        queryType: '', // forward:拉取最新,backward:拉取历史,now:提交评论后拉取最新
        id_forward: '',
        id_backward: '',
        textType: 1,
        hasMore: true
      }
    },
    components: {
      Emoji: resolve => require(['@/views/components/Emoji'], resolve),
      EditorIm: resolve => require(['@/components/editor/EditorIm'], resolve)
    },
    computed: {
      bg() {
        return '/static/live_.png'
      },
      statusText() {
        return this.message.status === 'u' ? '未开始' : this.message.status === '1' ? '正在直播' : '已结束'
      },
      placeholder() {
        let user = this.form.replyUser
        return user ? `回复${user.fromUserName}：` : '输入内容'
      },
      text() {
        if (this.textType === 0) {
          return '没有更多了'
        }
        if (this.textType === 1) {
          return '加载更多历史评论'
        }
        if (this.textType === 2) {
          return '加载中...'
        }
      }
    },
    activated() {
      this.msgId = this.routeQuery('msgId')
      http.get(`/business/message/query/detail/${this.msgId}`).then(res => {
        this.message = res.message
      })
      this.getAudienceBackward()
      this.getAudienceInterval()
    },
    beforeDestroy() {
      clearInterval(this.audienceTimeout)
    },
    methods: {
      onUser(u) {
        if (u.status === '1') {
          this.$message({ type: 'warning', message: '请使用App进行缴费' })
        }
      },
      onClick() {
        if (this.message.status === '6') {
          this.$message({ type: 'warning', message: '已结束' })
          return
        }
        this.openBrowser(`/papers/live/vlive?msgId=${this.message.id}`)
      },
      handleAudience() {
        this.routePushModel({
          path: '/vx/group/business/1280/audience',
          query: {
            groupId: this.groupId,
            msgId: this.message.id
          }
        })
      },
      toAvatar(value) {
        return this.url(value)
      },
      toDate(value) {
        return DateUtils.format(value, DateUtils.MDHM)
      },
      handleReply(data) {
        if (data.fromUserId !== this.userId) {
          this.form.replyUser = data
        } else {
          this.form.replyUser = null
        }
      },
      send(content, medias) {
        let postData = this.constructionMessage()
        if (!Check.isNullString(this.form.content)) {
          postData = {
            ...postData,
            content: this.form.content,
            parentId: this.message.id
          }
        }

        if (!Check.isNullString(this.form.medias)) {
          postData = {
            ...postData,
            medias: this.form.medias,
            parentId: this.message.id
          }
        }

        let user = this.form.replyUser
        if (user) {
          postData = {
            ...postData,
            userAvatar: user.fromUserAvatar,
            userId: user.fromUserId,
            userName: user.fromUserName
          }
        }

        GroupApi.addReply(postData).then(res => {
          this.$set(this.form, 'content', '')
          // this.loadReplyList()
          this.getAudienceComment()
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      loadReplyList() {
        MessageApi.getReplyList(this.msgId).then(res => {
          this.replies = res.replys || []
        })
      },
      // 拉去backward数据
      getAudienceBackward() {
        if (!this.hasMore) {
          return
        }
        let url = ''
        if (this.id_backward) {
          url = `/business/streaming/replys/${this.msgId}?id=${this.id_backward}&queryType=backward`
        } else {
          url = `/business/streaming/replys/${this.msgId}?queryType=backward`
        }
        this.textType = 2
        http.get(url).then(res => {
          this.count = res.count || 0
          if (!res.replies) {
            this.hasMore = false
            this.textType = 0
            return
          }
          this.replies = [...this.replies, ...res.replies]
          this.id_backward = this.replies.length > 0 ? this.replies[this.replies.length - 1].id : ''
          if (res.replies && res.replies.length >= 20) {
            this.hasMore = true
            this.textType = 1
          } else {
            this.hasMore = false
            this.textType = 0
          }
        })
      },
      // 6s轮询拉取forward数据
      getAudienceInterval() {
        // 轮询一次
        let that = this
        clearInterval(that.audienceTimeout)
        that.audienceTimeout = setInterval(() => {
          let id = this.id_forward
          let url = ''
          if (id) {
            url = `/business/streaming/replys/${this.msgId}?id=${id}&queryType=forward`
          } else {
            url = `/business/streaming/replys/${this.msgId}?queryType=forward`
          }
          http.get(url).then(res => {
            if (res.replies) {
              let newReplies = res.replies || []
              this.id_forward = newReplies.length > 0 ? newReplies[newReplies.length - 1].id : ''
              // this.id_forward = newReplies.length > 0 ? newReplies[0].id : ''
              this.replies = [...newReplies, ...this.replies]
            }
          })
        }, 6 * 1000)
      },
      // 评论时拉取now数据
      getAudienceComment() {
        let that = this
        clearInterval(that.audienceTimeout)
        // let id = this.id_forward || this.replies.length > 0 ? this.replies[0].id : ''
        let url = ''
        url = `/business/streaming/replys/${this.msgId}?queryType=now`
        http.get(url).then(res => {
          if (res.replies) {
            let newReplies = res.replies || []
            this.id_forward = newReplies.length > 0 ? newReplies[newReplies.length - 1].id : ''
            // this.id_forward = newReplies.length > 0 ? newReplies[0].id : ''
            this.replies = [...newReplies, ...this.replies]
          }
          that.getAudienceInterval()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .live-block {
    width: rem(354);
    height: rem(200);
    position: relative;
    margin-top: rem(5);
    margin: rem(5) auto 0;
    cursor: pointer;
    & > .live-status {
      position: absolute;
      top: rem(5);
      right: rem(5);
      width: rem(90);
      height: rem(25);
      line-height: rem(25);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      text-align: right;
      padding: rem(0) rem(10);
      color: #fff;
      &:before {
        content: '';
        position: absolute;
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        top: rem(9);
        left: rem(10);
        background: nth($background, 10);
      }
      &.begin:before {
        background: #26c85e;
      }
      &.end:before {
        background: #fdcb34;
      }
    }
    & > .live-full {
      position: absolute;
      bottom: rem(0);
      right: rem(0);
      cursor: pointer;
      img {
        width: rem(50);
        height: rem(50);
      }
    }
  }
  .card-detail {
    .cd-title {
      padding: rem(5) 0;
    }
    .cd-sub-title {
      margin-bottom: rem(5);
    }
    .cd-content.ql-editor {
      padding: rem(0);
      text-align: justify;
      max-height: none !important;
      min-height: none !important;
      img {
        display: inline-block !important;
      }
    }
    .cd-images {
      img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        margin-top: rem(10) !important;
        &:first-child {
          margin-top: 0 !important;
        }
      }
    }
    .cd-operate-bar {
      height: rem(25);
      line-height: rem(25);
      margin: rem(5) 0;
      font-size: rem(12);
      color: nth($font-color, 7);
      @extend %clearfix;
      .op-left {
        float: left;
        cursor: pointer;
      }
      .op-right {
        float: right;
        & > span,
        & > a {
          display: inline-block;
          margin-right: rem(5);
        }
        a {
          cursor: pointer;
          color: nth($font-color, 7);
        }
      }
      .praise-Icon {
        margin-left: rem(15);
        display: inline-block;
        vertical-align: top;
      }
    }
    .cd-tabs {
      overflow: hidden;
      display: table;
      width: auto;
      .tab-item {
        min-width: rem(80);
        padding: rem(10);
        line-height: rem(20);
        text-align: center;
        cursor: pointer;
        font-size: rem(14);
        position: relative;
        display: table-cell;
        &.active {
          @include fc;
          &:after {
            content: ' ';
            height: rem(4);
            position: absolute;
            bottom: rem(-1);
            width: 100%;
            left: 0;
            @include bc;
          }
        }
      }
    }
    .cd-tabs-content {
      // min-height: rem(200);
      border-top: rem(1) solid #ededed;
      .vx-item img {
        margin: rem(5) 0;
      }
    }
  }

  .send {
    &-block {
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
      height: rem(130);
      .ql-editor {
        max-height: 90px !important;
      }
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
  .pagination-more {
    height: rem(35);
    line-height: rem(35);
    text-align: center;
    @include fs($font-small);
    &.is-click:hover {
      background: nth($background, 2);
    }
  }
</style>
<style lang="scss">
  .vx-item-list .main .main-wrap {
    white-space: pre-wrap;
    padding-bottom: 5px;
  }
</style>
