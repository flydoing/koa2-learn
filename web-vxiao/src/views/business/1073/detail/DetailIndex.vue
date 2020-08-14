<template>
  <page title="课堂"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label v-if="!isClassed && parseInt(routeQuery('fromUserId')) === userId">开始上课</label>
      <label v-if="isExport"
             @click="onQualityReport">质量报告</label>
      <label v-if="!isTeacher && !isCommended"
             @click="handleCommend">评课</label>
    </div>
    <div class="classroom">
      <div class="classroom-before">
        <div class="classroom-before-bar">
          <div>课前</div>
          <!-- <i class="ico ico-plus" v-if="editBol"></i> -->
        </div>
        <CardList :messages="classBefore"
                  v-if="classBefore.length>0"></CardList>
      </div>
      <div class="category-title"></div>
      <div class="classroom-lesson">
        <div class="classroom-lesson-bar">
          <div>课中</div>
          <!-- <i class="ico ico-plus" v-if="editBol"></i> -->
        </div>
        <div class="classroom-lesson-show"
             v-if="classLesson.length>0">
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
      <div class="category-title"
           v-if="classAfter.length>0"></div>
      <div class="classroom-after"
           v-if="classAfter.length>0">
        <div class="classroom-after-bar">
          <div>课后</div>
          <!-- <i class="ico ico-plus" v-if="editBol" /> -->
        </div>
        <CardList :messages="classAfter"
                  v-if="classAfter.length>0"></CardList>
      </div>
      <div class="category-title"
           v-if="showTemplate"></div>
      <div class="classroom-template"
           v-if="showTemplate">
        <div class="classroom-template-bar">
          <div>评课</div>
          <div class="classroom-before-key"></div>
        </div>
        <CardList :messages="childMsg"
                  v-if="childMsg.length>0"></CardList>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '@/api/message'
  import Apis from '../api'
  import Check from '@/utils/check'
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
        metaDatas: [],
        childMsg: [],
        isNextPage: 0,
        isCurrentPage: 1
      }
    },
    computed: {
      isExport() {
        // 如果是自己创建，则一直存在下载报告
        // 其他人，根据学校中，课堂设置了质量报告开关
        return this.isAuth || parseInt(this.routeQuery('fromUserId')) === this.userId
      },
      classBefore() {
        return this.messages.filter(m => {
          return m.msgType === '1'
        })
      },
      isAuth() {
        // 检验后台返回的是否有值，然后做判断
        if (Check.isRealArray(this.metaDatas)) {
          return this.metaDatas[0].obj === '1'
        }
        return false
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
      }
    },
    created() {
      let that = this
      that.childMsg = that.messages.filter(m => {
        return m.type === '107301'
      })
      that.loadCommentMsgList()
      that.loadMessages()
      Api.getMessageById(this.routeQuery('msgId')).then(res => {
        if (res.message) {
          this.editBol = this.userId === res.message.fromUserId
          // 是否自评
          this.isCommended = res.message.remark === '1'
          // 是否上已上过课
          this.isClassed = res.message.extensionType === '1'
          this.showTemplate = res.message.msgJson && JSON.parse(res.message.msgJson).hasOwnProperty('templateId')
          this.templateId = res.message.msgJson && JSON.parse(res.message.msgJson).templateId
        }
      })
      // 查开关状态
      Apis.getClassSetting(this.userId, 'm_allow_non_creator_query_quality_report').then(res => {
        this.metaDatas = res.metaDatas
      })
    },
    methods: {
      loadMessages() {
        const that = this
        this.getMessages({
          type: '1073',
          groupId: that.currentGroup.groupId,
          queryType: 'parentId',
          parentId: this.routeQuery('msgId')
        })
          .then(res => {})
          .catch(res => {})
      },
      loadCommentMsgList() {
        let that = this
        that
          .getMessages({
            queryType: 'parentId',
            parentId: that.routeQuery('msgId'),
            currentPage: that.isCurrentPage,
            type: '107301',
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
            classroomType: '107301',
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
        return obj.medias
          ? obj.medias[0].type === 'url'
            ? obj.medias[0].fileId
            : obj.medias[0].fileName
          : this.getQestionType(JSON.parse(obj.extensionType).questions[0].type)
      },
      picText(obj) {
        return obj.medias
          ? obj.medias[0].type === 'photo'
            ? ''
            : obj.medias[0].extension
            ? obj.medias[0].extension
            : '链接'
          : JSON.parse(obj.extensionType).questions[0].title
      },
      boxStyle(obj) {
        // let media = obj.medias ? obj.medias[0] : obj
        // return this.bgImage(media)
        return obj.medias ? this.bgImage(obj.medias[0]) : { 'background-color': '#6ec9bd' }
      },
      scrollEnd() {
        this.isNextPage > 0 && this.loadCommentMsgList()
      },
      onQualityReport() {
        this.routePush({
          name: 'qualityReport1073',
          query: {
            msgId: this.routeQuery('msgId')
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
