<template>
  <page title="新建课堂"
        closePrompt
        hasSubmit
        @submit="handleCommend"
        listenBack
        @back="back">
    <div class="classroom">
      <div class="classroom-category"
           v-if="isCourse"
           @click="selectCategory">
        <div class="classroom-template-bar">
          <div>
            目录
          </div>
          <div class="classroom-before-key">
            {{classRoom.category.name}}
            <i class="ico ico-right"></i>
          </div>
        </div>
        <div class="category-title"></div>
      </div>
      <item @click="classRoom.isChallengerMode = !classRoom.isChallengerMode"
            v-if="classRoom.isChallengerModeShow">
        <div>竞赛模式</div>
        <div slot="remark">
          <i-switch :value="classRoom.isChallengerMode"
                    @click="classRoom.isChallengerMode = !classRoom.isChallengerMode" />
        </div>
        <span slot="after"></span>
      </item>
      <div class="category-title"
           v-if="classRoom.isChallengerModeShow"></div>
      <div class="classroom-before"
           @click="resourceCategory(1)">
        <div class="classroom-before-bar">
          <div>
            <i class="ico ico-help hlpe"
               @click.stop="showHelp(1)"></i> 课前
          </div>
          <i class="ico ico-add"></i>
        </div>
      </div>
      <div class="classroom-before-list"
           v-if="classRoom.classBefore.length>0">
        <template v-for="(m, i) in classRoom.classBefore">
          <template v-if="classRoom.classBefore.length>0">
            <card1002 :message="m"
                      v-if="m.type==='1002'"
                      :key="m.id"
                      @remove="removeBeforCard(i)" />
            <card1047 :message="m"
                      v-else-if="m.type==='1047'"
                      :key="m.id"
                      @remove="removeBeforCard(i)" />
            <card1069 :message="m"
                      v-else-if="m.type==='1069'"
                      :key="m.id"
                      @remove="removeBeforCard(i)" />
            <DefaultCard :message="m"
                         v-else
                         :key="m.id"
                         @remove="removeBeforCard(i)" />
          </template>
        </template>
      </div>
      <div class="category-title"></div>
      <div class="classroom-lesson"
           @click="resourceCategory(2)">
        <div class="classroom-lesson-bar">
          <div>
            <i class="ico ico-help hlpe"
               @click.stop="showHelp(2)"></i> 课中
          </div>
          <i class="ico ico-add"></i>
        </div>
      </div>
      <div class="classroom-lesson-show"
           v-if="classRoom.classLesson.length>0">
        <draggable v-if="classRoom.classLesson.length>0"
                   v-model="classRoom.classLesson"
                   class="design-box-list">
          <div class="design-box"
               v-for="(media, m) in classRoom.classLesson"
               :key="m">
            <i class="ico ico-delete"
               @click="deleteBox(m, media)"></i>
            <div>
              <div class="titleText"
                   :style="boxStyle(media)"
                   v-html="picText(media)"></div>
            </div>
            <p v-html="picTitle(media)" class="first-p-title"></p>
            <p v-if="media.type === '6' || media.type === '7' || media.type === '8' || media.type === '9' || media.type === '12' || media.type === '14' || media.type === '16'" 
            @click="handleSetTime(media)">
              <i class="ico ico-shezhi icoFontSize18"></i></p>
          </div>
        </draggable>
      </div>
      <div class="category-title"></div>
      <div class="classroom-after"
           @click="resourceCategory(3)">
        <div class="classroom-after-bar">
          <div>
            <i class="ico ico-help hlpe"
               @click.stop="showHelp(3)"></i> 课后
          </div>
          <i class="ico ico-add"></i>
        </div>
      </div>
      <div class="classroom-after-list"
           v-if="classRoom.classAfter.length>0">
        <template v-for="(m, i) in classRoom.classAfter">
          <template v-if="classRoom.classAfter.length>0">
            <card1002 :message="m"
                      v-if="m.type==='1002'"
                      :key="m.id"
                      @remove="removeAfterCard(i)" />
            <card1047 :message="m"
                      v-else-if="m.type==='1047'"
                      :key="m.id"
                      @remove="removeAfterCard(i)" />
            <card1069 :message="m"
                      v-else-if="m.type==='1069'"
                      :key="m.id"
                      @remove="removeAfterCard(i)" />
            <DefaultCard :message="m"
                         v-else
                         :key="m.id"
                         @remove="removeAfterCard(i)" />
          </template>
        </template>
      </div>
      <div class="category-title"></div>
      <div class="classroom-template"
           @click="selectTemplate">
        <div class="classroom-template-bar">
          <div>
            <i class="ico ico-help hlpe"
               @click.stop="showHelp(4)"></i> 评课
          </div>
          <div class="classroom-before-key">{{classRoom.template.title}}
            <i class="ico ico-right"></i>
          </div>
        </div>
      </div>
      <template v-if="classRoom.allowUploadBackground">
        <div class="category-title"></div>
        <div class="classroom-bg-img">
          <div class="classroom-after-bar">
            <div>
              课中习题背景图
            </div>
          </div>
        </div>
        <div class="classroom-bg-show"
             ref="bgDom">
          <div class="bg-preview"
               v-if="classRoom.backgroundImg">
            <img :src="url(classRoom.backgroundImg.id)"
                 class="bg-img">
            <i class="ico ico-delete"
               @click="bgDelete"></i>
          </div>
          <el-upload class="upload-box"
                     :action="uploadURL"
                     :show-file-list="false"
                     :on-success="uploadSuccess"
                     accept="image/png, image/jpeg,.gif"
                     :before-upload="onPhotoBefore"
                     :on-error="onError">
            <div class="add-btn">
              <i class="ico ico-plus"
                 v-if="!classRoom.backgroundImg"></i>
              <i class="ico ico-change"
                 v-else></i>
            </div>
          </el-upload>
        </div>
      </template>
    </div>
  </page>
</template>
<script>
  import CradMixin from '@/views/components/card/mixin'
  import Draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import Api from './api'
  export default {
    mixins: [CradMixin, MixinMessage],
    components: {
      DefaultCard: resolve => require(['./DefaultCard'], resolve),
      Card1002: resolve => require(['@/views/business/1002/Card'], resolve),
      Card1047: resolve => require(['@/views/business/1047/Card'], resolve),
      Card1069: resolve => require(['@/views/business/1069/Card'], resolve),
      Draggable
    },
    data() {
      return {
        classRoom: {
          category: {
            name: ''
          },
          classBefore: [],
          classLesson: [],
          classAfter: [],
          template: {
            id: '',
            title: '不评'
          },
          backgroundImg: null,
          allowUploadBackground: false,
          isChallengerMode: false,
          isChallengerModeShow: false
        },
        loading: null
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate',
        settingTime: 'getSettingTime'
      })
    },
    activated() {
      if (this.cacheClassRoom.isHasCache) {
        this.classRoom = JSON.parse(JSON.stringify(this.cacheClassRoom))
      } else {
        Api.getClassSetting(this.currentGroup.parentId, 'm_classroom_question_background,m_classroom_challenger_mode').then(res => {
          res.metaDatas &&
            res.metaDatas.forEach(meta => {
              if (meta.metaType === 'm_classroom_question_background' && meta.obj === '1') {
                this.$set(this.classRoom, 'allowUploadBackground', true)
              }
              if (meta.metaType === 'm_classroom_challenger_mode' && meta.obj === '1') {
                this.$set(this.classRoom, 'isChallengerModeShow', true)
              }
            })
        })
      }
      this.initSettingTime()
    },
    methods: {
      ...mapActions(['saveSettingTime', 'clearSettingTime', 'saveClassRoomCreate', 'clearClassRoomCreate']),
      initSettingTime() {
        let settingTime = this.settingTime || []
        let settingTimeIds = []
        this.settingTime.map(item => {
          settingTimeIds.push(item.id)
        })
        let newArray = []
        this.classRoom.classLesson.forEach(lesson => {
          settingTime.map(item => {
            if (item.isAllExtensionType && !settingTimeIds.includes(lesson.id)) {
              newArray.push({
                countdownTime: item.countdownTime,
                points: item.points,
                isAllExtensionType: false,
                id: lesson.id
              })
            }
          })
        })
        // settingTime.concat(newArray)
        newArray.map(item => {
          settingTime.push(item)
        })
        this.saveSettingTime(settingTime)
      },
      handleCommend() {
        if (this.classRoom.classLesson.length === 0) {
          this.$message({
            type: 'warning',
            message: '课中资料不能为空'
          })
          return false
        }
        let beforeArr = []
        let whenArr = []
        let afterArr = []
        this.classRoom.classBefore.forEach(before => {
          if (before.type === '1047') {
            beforeArr.push({
              content: before.content,
              extensionType: before.extensionType,
              msgType: '1',
              status: '1',
              type: before.type
            })
          } else {
            beforeArr.push({
              content: before.content,
              medias: before.medias,
              msgType: '1',
              status: '1',
              type: before.type
            })
          }
        })
        this.classRoom.classLesson.forEach(lesson => {
          if (lesson.remark === '1047') {
            // 加入倒计时、分数: settingTime
            let question = {}
            let settingTime = this.settingTime
            question = {
              id: lesson.id
            }
            settingTime.map(item => {
              if (lesson.id === item.id) {
                question = {
                  id: lesson.id,
                  countdownTime: item.countdownTime,
                  points: item.points
                }
              }
            })
            whenArr.push({
              // extensionType: JSON.stringify({ questions: [{ id: lesson.id }] }),
              extensionType: JSON.stringify({ questions: [question] }),
              msgType: '2',
              status: '1',
              type: lesson.remark
            })
          } else if (lesson.type === 'photo') {
            whenArr.push({
              medias: [
                {
                  fileId: lesson.fileId || lesson.id,
                  fileName: lesson.fileName || lesson.name,
                  size: lesson.size,
                  type: lesson.type
                }
              ],
              msgType: '2',
              status: '1',
              type: '1100'
            })
          } else {
            whenArr.push({
              medias: [
                {
                  fileId: lesson.fileId || lesson.id,
                  fileName: lesson.fileName || lesson.name,
                  size: lesson.size,
                  type: lesson.type
                }
              ],
              msgType: '2',
              status: '1',
              type: lesson.remark
            })
          }
        })
        this.classRoom.classAfter.forEach(after => {
          if (after.type === '1047') {
            afterArr.push({
              extensionType: after.extensionType,
              content: after.content,
              msgType: '3',
              status: '1',
              type: after.type
            })
          } else {
            afterArr.push({
              content: after.content,
              medias: after.medias,
              msgType: '3',
              status: '1',
              type: after.type
            })
          }
        })
        let reqBody = {
          type: '1073',
          categoryId: this.classRoom.category.id || void 0,
          categoryName: this.classRoom.category.name || void 0,
          title: this.classRoom.category.name || void 0,
          groupId: this.currentGroup.groupId,
          msgJson: JSON.stringify({
            templateId: this.classRoom.template.id || void 0,
            background: this.classRoom.backgroundImg ? this.classRoom.backgroundImg.id : void 0,
            isChallengerMode: this.classRoom.isChallengerMode ? '1' : '0'
          }),
          children: [...beforeArr, ...whenArr, ...afterArr],
          ...this.constructionMessage()
        }
        this.addMessage(reqBody).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })

          this.clearClassRoomCreate()
          this.clearSettingTime()
          this.routeBack()
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
      selectCategory() {
        this.saveClassRoomCreate({
          ...this.classRoom,
          isHasCache: true
        })
        this.routePush({
          name: 'classRoomCategorys1073'
        })
      },
      selectTemplate() {
        this.saveClassRoomCreate({
          ...this.classRoom,
          isHasCache: true
        })
        this.routePush({
          name: 'classRoomTemplates1073'
        })
      },
      resourceCategory(type) {
        // type 1=>课前 2=>课中 3=>课后
        this.saveClassRoomCreate({
          ...this.classRoom,
          isHasCache: true
        })
        this.routePush({
          name: 'classRoomCategory1073',
          query: {
            msgType: type
          }
        })
      },
      showHelp(type) {
        let str = ''
        switch (type) {
          case 1:
            str = '创建好互动课堂后，学生马上就能看见课前资料的内容'
            break
          case 2:
            str = '1.课中设计的内容，只会在上课模式下展示；2.按住卡片拖拽可以调整顺序'
            break
          case 3:
            str = '上课结束后，学生即可查看课后部分'
            break
          case 4:
            str = '设置评课模板，上课结束，老师、学生可以对课堂进行留言评价'
        }
        this.$alert(str, '提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {}
        })
      },
      removeBeforCard(i) {
        this.classRoom.classBefore.splice(i, 1)
      },
      removeAfterCard(m) {
        this.classRoom.classAfter.splice(m, 1)
      },
      boxStyle(obj) {
        let media = obj.medias ? obj.medias[0] : obj
        return this.bgImage(media)
      },
      picTitle(media) {
        return media.type === 'url' ? media.fileId : media.fileName || this.getQestionType(media.type) || media.name
      },
      picText(media) {
        return media.type === 'photo' ? '' : media.extension ? media.extension : media.title || '链接'
      },
      deleteBox(i, obj) {
        this.classRoom.classLesson.splice(i, 1)
      },
      uploadSuccess(res) {
        this.classRoom.backgroundImg = res.file
        this.loading.close()
      },
      onPhotoBefore() {
        this.loading = this.$loading({ target: this.$refs.bgDom })
      },
      onError() {
        this.$message({ type: 'warning', message: '上传失败，请重新上传' })
      },
      bgDelete() {
        this.classRoom.backgroundImg = null
      },
      handleSetTime(media) {
        this.routePush({
          name: 'SettingTime1073',
          query: {
            id: media.id
          }
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearClassRoomCreate()
            this.clearSettingTime()
            this.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .classroom {
    background-color: nth($background, 1);
    &-before,
    &-lesson,
    &-after,
    &-template,
    &-bg-img {
      &-bar {
        position: relative;
        @include flex;
        justify-content: space-between;
        padding: 0 rem(10) 0 rem(25);
        height: rem(45);
        line-height: rem(45);
        border-bottom: $border;
        font-size: rem(14);
        cursor: pointer;
        background-color: #fff;
        @include before {
          top: 50%;
          height: rem(20);
          width: rem(5);
          left: rem(10);
          margin-top: rem(-10);
          @include bc;
        }
        i {
          font-size: rem(15);
          line-height: rem(45);
          &:hover {
            color: #9f9f9f;
          }
        }
        .hlpe {
          line-height: normal;
          font-size: rem(17);
          color: #cdcdcd;
        }
      }
    }
    &-bg-show {
      padding: rem(10);
      background-color: #fff;
      @include flex;
      .bg-preview {
        margin-right: rem(15);
        width: rem(180);
        height: rem(180);
        position: relative;
        i {
          position: absolute;
          right: rem(-4);
          top: rem(-5);
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: rem(4);
        }
      }
      .add-btn {
        display: inline-block;
        @include flex;
        @include ai;
        @include jc;
        width: rem(180);
        height: rem(180);
        border: rem(1) dashed #ededed;
        border-radius: rem(4);
        i {
          font-size: rem(30);
        }
      }
    }
    &-lesson {
      &-show {
        .design-box-list {
          width: 100%;
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
            & > div {
              width: rem(186);
              height: rem(112);
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: #fff;
              .titleText {
                width: 100%;
                height: 100%;
                padding: rem(10);
                overflow: hidden;
                div {
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  img {
                    display: none !important;
                  }
                  p {
                    audio {
                      display: none;
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
              display:inline-block;
              .icoFontSize18{
                font-size: rem(18)
              }
            }
            & > .first-p-title{
              width: 70%;
            }
            & > i {
              position: absolute;
              font-size: rem(20);
              top: rem(-5);
              right: rem(-7);
            }
          }
        }
      }
    }
  }
</style>
