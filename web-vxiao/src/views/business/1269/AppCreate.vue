<template>
  <page title="新建双师课堂"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleCommend"
        @back="back"
        class="classroom">
    <Item fullInput
          :hasClick="false">
      <input placeholder="名称"
             v-model="classRoom.title" />
    </Item>
    <el-dropdown trigger="click"
                 placement="bottom"
                 class="block-element"
                 @command="onCheckTime">
      <Item>
        <div>听讲检测</div>
        <div slot="remark">{{classRoom.checkTime==='0'?'关闭':classRoom.checkTime+'分钟'}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <slot name="dropItem">
          <el-dropdown-item command="0">关闭</el-dropdown-item>
          <el-dropdown-item command="3">3分钟</el-dropdown-item>
          <el-dropdown-item command="15">5分钟</el-dropdown-item>
          <el-dropdown-item command="10">10分钟</el-dropdown-item>
          <el-dropdown-item command="15">15分钟</el-dropdown-item>
        </slot>
      </el-dropdown-menu>
    </el-dropdown>
    <Item @click="onPrelectObject">
      <div>授课对象</div>
      <div slot="remark"
           class="ellipsis">{{selectGroups.length}}个班群</div>
    </Item>
    <Item @click="resourceCategory(2)">
      <div>内容</div>
      <div slot="remark"></div>
    </Item>
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
          <p v-html="picTitle(media)"></p>
        </div>
      </draggable>
    </div>
    <template v-if="classRoom.allowUploadBackground">
      <div class="category-title"></div>
      <div class="classroom-bg-img">
        <div class="classroom-after-bar">
          <div>
            习题背景图
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
        selectGroups: [],
        classRoom: {
          title: '',
          checkTime: '0',
          classLesson: [],
          backgroundImg: null,
          allowUploadBackground: false
        },
        loading: null
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
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
            })
        })
      }
      this.selectGroups = this.getStorage('_cache_groups') || this.selectGroups
    },
    methods: {
      ...mapActions(['saveClassRoomCreate', 'clearClassRoomCreate']),
      onPrelectObject() {
        this.setStorage('_cache_groups', this.selectGroups)
        this.routePush({
          name: 'basiceTeacherGroups'
        })
      },
      onCheckTime(command) {
        this.$set(this.classRoom, 'checkTime', command)
      },
      handleCommend() {
        if (this.classRoom.classLesson.length === 0) {
          this.$message({ type: 'warning', message: '课中资料不能为空' })
          return false
        }
        if (this.selectGroups.length === 0) {
          this.$message({ type: 'warning', message: '授课对象不能为空' })
          return
        }
        let toUsers = []
        this.selectGroups.forEach(g => {
          toUsers.push({
            userId: g.id,
            groupId: g.groupId,
            userType: g.type === '2' ? 'class' : 'group',
            name: g.name,
            type: 'cc'
          })
        })
        let whenArr = []
        this.classRoom.classLesson.forEach(lesson => {
          if (lesson.remark === '1047') {
            whenArr.push({
              extensionType: JSON.stringify({ questions: [{ id: lesson.id }] }),
              msgType: '2',
              status: '1',
              type: lesson.remark
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
        let reqBody = {
          type: '1269',
          title: this.classRoom.title || '',
          groupId: this.currentGroup.groupId,
          msgJson: JSON.stringify({
            background: this.classRoom.backgroundImg ? this.classRoom.backgroundImg.id : void 0,
            checkTime: this.classRoom.checkTime
          }),
          toUsers: toUsers,
          children: [...whenArr],
          ...this.constructionMessage()
        }
        this.addMessage(reqBody).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.clearClassRoomCreate()
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
          name: 'classRoomCategorys1269'
        })
      },
      selectTemplate() {
        this.saveClassRoomCreate({
          ...this.classRoom,
          isHasCache: true
        })
        this.routePush({
          name: 'classRoomTemplates1269'
        })
      },
      resourceCategory(type) {
        // type 1=>课前 2=>课中 3=>课后
        this.saveClassRoomCreate({
          ...this.classRoom,
          isHasCache: true
        })
        this.routePush({
          name: 'classRoomCategory1269',
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
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearClassRoomCreate()
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
    // background-color: nth($background, 1);
    &-lesson,
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
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
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
