<template>
  <Page title="答卷详情"
        @scrollEnd="onScrollEnd"
        @submit="commitResponHandle"
        :hasSubmit="respondBol">
    <label slot="btn"
           v-if="!respondBol && batchBol && messages.length>0"
           @click="showAllStudentScore">成绩</label>
    <div class="homework-content">
      <p v-html="converContent(homeworkContent.content)"></p>
      <CardImages v-if="homeworkContentImgs.length>0"
                  :images="homeworkContentImgs"></CardImages>
      <CardFiles v-if="homeworkContentFiles.length>0"
                 :files="homeworkContentFiles"></CardFiles>
    </div>
    <div class="homework-answer-box"
         v-if="(answer.content || answerImages.length>0 || answerFiles.length>0) && !respondBol">
      <div class="category-title text">参考答案</div>
      <div class="homework-answer-content">
        <div class="answer-show"
             v-if="answer.content">{{answer.content}}</div>
        <CardImages v-if="answerImages.length>0"
                    :images="answerImages"></CardImages>
        <CardFiles v-if="answerFiles.length>0"
                   :files="answerFiles"></CardFiles>
      </div>
    </div>
    <div class="homework-child-list"
         v-if="!respondBol">
      <div v-if="isRecommend()">
        <div class="category-title text">推荐</div>
        <template v-for="m in messages">
          <card1067 :message="ruleMessage(m)"
                    :key="m.id"
                    v-if="m.msgJson==='1'&&messages.length>0" />
        </template>
      </div>
      <div v-if="isNormal()">
        <div class="category-title text">答卷</div>
        <template v-for="m in messages">
          <card1067 :message="ruleMessage(m)"
                    :key="m.id"
                    v-if="m.msgJson==='0'&&messages.length>0" />
        </template>
      </div>
      <div v-if="messages.length<=0">
        <div class="category-title">答卷</div>
        <CardTips text="暂无答卷" />
      </div>
    </div>
    <div class="input-box"
         v-if="respondBol">
      <div class="category-title text">答卷</div>
      <!-- <ueSimple id="student-answer" :rows="3" placeholder="内容" :tools="['pic']" v-model="inputStr" @getMedias="fromSimpleImage"
        :noBottom="true"></ueSimple> -->
      <keep-alive>
        <ueSimple placeholder="内容"
                  :toolbars="['photo']"
                  :store.sync="replyObj" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import Media from '@/constant/media'
  import M from '@/views/business/mixin'
  import CategoryEnum from '@/constant/category'
  export default {
    mixins: [CardMixin, M],
    components: {
      Card1067: resolve => require(['@/views/business/1067/Card'], resolve),
      UeSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        messages: [],
        answerImages: [],
        answerFiles: [],
        answer: JSON.parse(this.getStorage('homeworkAnswer', true)) || {},
        homeworkContent: this.getStorage('homeworkContent', true),
        homeworkContentImgs: [],
        homeworkContentFiles: [],
        nullIcon: '/static/ico/icon_commoneuse.png',
        respondBol: this.routeQuery('respond') ? this.routeQuery('respond') : false,
        replyObj: {
          content: '',
          medias: []
        },
        childPage: 1,
        chaildNext: 0,
        // scoreType: null,
        scoreTyepChild: [],
        batchBol: this.routeQuery('batchBol') ? this.routeQuery('batchBol') : false
      }
    },
    created() {
      let that = this
      that.answer && that.answer.medias && that.formatImageOrFile(that.answer.medias, that.answerImages, that.answerFiles)
      that.homeworkContent &&
        that.homeworkContent.medias &&
        that.formatImageOrFile(that.homeworkContent.medias, that.homeworkContentImgs, that.homeworkContentFiles)
      if (!this.respondBol) {
        let sgroupId = that.getSchoolGroupId(that.currentGroup.parentId)
        Api.getScoreType(sgroupId, that.routeQuery('appType')).then(res => {
          if (res && res.code === '1') {
            res.categories.forEach(c => {
              if (c.id === Number(res.metaDatas[0].obj)) {
                that.scoreType = c
              }
            })
            that.loadHomeworkChildren()
            that.scoreType.value === '1' &&
              Api.getScoreTypeChild(CategoryEnum.SCORESHOW_CHILD, that.scoreType.id, '0').then(res => {
                if (res && res.code === '1') {
                  that.scoreTyepChild = res.categorys
                }
              })
          }
        })
      }
    },
    methods: {
      ruleMessage(m) {
        m.scoreTyepChild = this.scoreTyepChild
        m.scoreType = this.scoreType || {}
        return m
      },
      formatImageOrFile(medias, imgArr, fileArr) {
        let that = this
        medias.forEach((m, i) => {
          if (m.type === Media.PHOTO) {
            imgArr.push({
              thumb: that.url(m.fileId, 'thumb'),
              src: that.url(m.fileId),
              ...m
            })
          } else {
            let href = that.url(m.fileId)
            // 在线预览附件
            if ('doc/docx/xls/xlsx/ppt/pptx/pdf'.indexOf(m.extension) >= 0) {
              href = `${this.$store.state.FILE_URL}/view/${m.fileId}`
            }
            fileArr.push({
              href: href,
              sizeText: Media.size(m.size),
              ...m
            })
          }
        })
      },
      commitResponHandle() {
        let that = this
        let reqBody = {
          message: {
            content: that.replyObj.content || '',
            groupId: that.currentGroup.groupId,
            medias: that.replyObj.medias.length > 0 ? that.replyObj.medias : void 0,
            parentId: that.routeQuery('msgId'),
            status: '1',
            type: '1067',
            ...that.commonMessage()
          }
        }
        if (this.routeQuery('childId')) {
          reqBody.message.fromUserId = this.routeQuery('childId')
        }
        Api.commitOnlineHomework(reqBody).then(res => {
          if (res && res.code === '1') {
            that.$store.commit('modifyGroupMessage', {
              groupId: res.messages[0].groupId,
              m: res.messages[0]
            })
            if (this.routeQuery('childId')) {
              that.routeBack(-2)
            } else {
              that.routeBack()
            }
          }
        })
      },
      onScrollEnd(staus) {
        let that = this
        if (that.chaildNext > 0) {
          that.loadHomeworkChildren(that.childPage)
        }
      },
      loadHomeworkChildren(page) {
        let that = this
        Api.getHomeworkChildMsg(that.currentGroup.groupId, that.routeQuery('msgId'), that.routeQuery('appType'), page).then(res => {
          if (res && res.code === '1') {
            if (res.hasNextPage > 0) {
              this.childPage = res.currentPage
              this.chaildNext = res.hasNextPage
            } else {
              this.chaildNext = 0
            }
            res.messages &&
              res.messages.forEach(m => {
                that.messages.push(m)
              })
          }
        })
      },
      showAllStudentScore() {
        this.setStorage('scoreType', this.scoreType)
        this.routePush({
          name: 'studentScoreList1002',
          query: {
            subjectName: this.homeworkContent.subjectName,
            msgId: this.routeQuery('msgId')
          }
        })
      },
      isRecommend() {
        return (
          this.messages.filter(m => {
            return m.msgJson === '1'
          }).length > 0
        )
      },
      isNormal() {
        return (
          this.messages.filter(m => {
            return m.msgJson === '0'
          }).length > 0
        )
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .homework {
    &-child-list {
      background-color: nth($background, 1);
    }
    &-content {
      padding: rem(10);
      background-color: #fff;
    }
    &-answer-content {
      padding: rem(10);
      background-color: #fff;
    }
    &-tips {
      @include flex;
      @include jc;
      @include ai;
      height: rem(300);
      background-color: #fff;
      div {
        p {
          margin-top: rem(20);
          font-size: rem(16);
          color: #9f9f9f;
        }
      }
    }
  }

  .input-box {
    background-color: #fff;
  }
</style>
