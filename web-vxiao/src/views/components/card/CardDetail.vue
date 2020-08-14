<template>
  <page :title="title"
        :loading="loading">
    <div class="card-detail">
      <slot>
        <div class="pd">
          <div class="cd-title">{{message.title}}</div>
          <div class="cd-sub-title">
            <span class="text-color has-click"
                  v-html="message.categoryName || message.businessName"></span>
            <span class="text-label f12">{{time}}</span>
          </div>
          <div v-if="content"
               class="cd-content ql-editor"
               v-html="content"></div>
          <div v-html='jsonTxt.range'></div>
          <div class="cd-images"
               v-if="noHtmlContent">
            <img v-for="(image, i) in images"
                 :key="i"
                 v-lazy="{src: image.src}" />
          </div>
          <div class="file-list"
               v-for="(file, i) in files"
               :key="i">
            <a class="file-block"
               target="_blank"
               :href="url(file.href)">
              <div class="logo"><img :src="fileLogo(file)"
                     alt='头像'></div>
              <div class="title">{{file.fileName}}</div>
              <div class="remark">{{file.sizeText}}</div>
            </a>
          </div>
        </div>
      </slot>
      <slot name="operate">
        <div class="cd-operate-bar pd">
          <div class="op-right">
            <span>已阅 {{message.readCount}}</span>
            <a @click="handleAccusation">举报</a>
            <i :class="icoPraise"
               @click="handlePraise" /> {{message.praiseCount || 0}}</div>
        </div>
      </slot>
      <!-- <div class="cd-tabs">
        <div class="tab-item"
             v-for="(tab,i) in tabs"
             :key="i"
             :tab="tab"
             @click="handleTab(tab)"
             :class="{active: tab.selected}">
          <template v-if="tab.type==1">
            {{tab.name}}（{{replies.length}}）
          </template>
          <template v-else>
            {{tab.name}}（{{message.praiseCount || 0}}）
          </template>
        </div>
      </div> -->
      <div class="cd-tabs-content"
           v-if="replies.length>0">
        <div class="category-title"></div>
        <template v-if="curTab.type==1">
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
                  v-html="converContent(reply.content)"></span>
            <span slot="remark"
                  v-html="toDate(reply.createTime)"></span>
            <template slot="after"></template>
          </ItemList>
        </template>
        <!-- <template v-else>
          <Relate :items="users"
                  :plus="false"
                  :reduce="false" />
        </template> -->
      </div>
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
  </page>
</template>
<script>
  import 'quill/dist/quill.snow.css'
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import GroupApi from '@/api/group'
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'
  import Media from '@/constant/media'
  import ArrayUtils from '@/utils/array'

  export default {
    mixins: [R],
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve),
      Emoji: resolve => require(['@/views/components/Emoji'], resolve),
      EditorIm: resolve => require(['@/components/editor/EditorIm'], resolve)
    },
    props: {
      m: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        loading: true,
        form: {
          replyUser: null,
          content: ''
        },
        message: {},
        replies: [],
        praises: [],
        tabs: [
          {
            name: `评论`,
            selected: true,
            type: 1
          },
          {
            name: `点赞`,
            selected: false,
            type: 2
          }
        ]
      }
    },
    computed: {
      title() {
        return this.app ? `${this.app.name}详情` : ''
      },
      noHtmlContent() {
        return Check.isNullString(this.message.htmlContent)
      },
      icoPraise() {
        return [
          `ico`,
          {
            [`ico-heart`]: this.message.praiseCount < 1,
            [`ico-heart-press`]: this.message.praiseCount > 0
          }
        ]
      },
      images() {
        let ims = []
        if (Check.isRealArray(this.message.medias)) {
          this.message.medias.forEach((v, i) => {
            if (v.type === Media.PHOTO) {
              ims.push({
                ...v,
                thumb: v.thumb ? this.url(v.thumb) : this.url(v.fileId, 'thumb'),
                src: this.url(v.fileId)
              })
            }
          })
        }
        return ims
      },
      files() {
        let that = this
        let _files = []
        if (Check.isRealArray(this.message.medias)) {
          that.message.medias.forEach((v, i) => {
            if (v.type === Media.FILE) {
              let href = that.url(v.fileId)
              // 在线预览附件
              if ('doc/docx/xls/xlsx/ppt/pptx/pdf'.indexOf(v.extension) >= 0) {
                href = `${that.$store.state.FILE_URL}/view/${v.fileId}`
              }
              _files.push({
                href: href,
                sizeText: Media.size(v.size),
                ...v
              })
            }
          })
        }
        return _files
      },
      placeholder() {
        let user = this.form.replyUser
        return user ? `回复${user.fromUserName}：` : '输入内容'
      },
      content() {
        return this.message.htmlContent || this.converContent(this.message.content)
      },
      time() {
        return DateUtils.converFormat(new Date(this.message.createTime))
      },
      users() {
        const that = this
        if (Check.isRealArray(that.praises)) {
          return that.praises.map(v => {
            v.avatar = that.url(v.avatar)
            return v
          })
        }
        return []
      },
      jsonTxt() {
        let mJson = this.message.msgJson ? JSON.parse(this.message.msgJson) : null
        if (mJson) {
          return {
            range: mJson.extension
          }
        }
        return {}
      }
    },
    created() {
      const that = this
      that.msgId = that.routeParam('msgId')
      that.appType = that.routeQuery('type')
      that.app = that.$store.getters.getAppByType(that.appType, that.currentGroup.grougId)
      that.curTab = this.tabs[0]
      that.loadReplyList()
      that.loadPraiseList()
      if (!Check.isNullObject(that.m)) {
        that.message = Object.assign(that.message, that.m)
        this.loading = false
      } else {
        MessageApi.getMessageById(that.msgId).then(res => {
          that.message = res.message
          this.loading = false
        })
      }
    },
    methods: {
      toAvatar(value) {
        return this.url(value)
      },
      toDate(value) {
        return DateUtils.format(value, DateUtils.MDHM)
      },
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
            file.extension
          )
        ) {
          return '/static/f/icon_query@2x.png'
        }
        return `/static/f/icon_${file.extension}@2x.png`
      },
      handleAccusation() {
        this.routePushModel({
          path: '/vx/group/business/complaints',
          query: {
            msgId: this.message.id
          }
        })
      },
      loadReplyList() {
        MessageApi.getReplyList(this.msgId).then(res => {
          this.replies = res.replys || []
        })
      },
      loadPraiseList() {
        MessageApi.getPraiseList(this.msgId).then(res => {
          this.praises = res.praises || []
          this.message.praiseCount = res.praises ? res.praises.length : 0
        })
      },
      handlePraise() {
        let that = this
        let p = {
          groupId: that.message.groupId,
          msgId: that.message.id,
          userId: that.userId,
          isPraise: '1'
        }
        if (Check.isRealArray(that.praises)) {
          that.praises.some((_p, i) => {
            if (_p.userId === that.userId) {
              p = {
                ..._p,
                isPraise: _p.isPraise === 1 ? 0 : 1
              }
            }
          })
        }
        MessageApi.modifyPraise({
          praise: p
        }).then(res => {
          that.loadPraiseList()
        })
      },
      handleTab(item) {
        this.curTab = item
        this.tabs = this.tabs.map(t => {
          item.type === t.type ? (t.selected = true) : (t.selected = false)
          return t
        })
        if (item.type === 1) {
          this.loadReplyList()
        } else {
          this.loadPraiseList()
        }
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
          this.loadReplyList()
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
<style lang="scss">
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
</style>
