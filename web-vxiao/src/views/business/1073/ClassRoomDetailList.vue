<template>
  <page :title="title"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label @click="selectedSubmit">已选{{selectedCard.length>0 ? `(${selectedCard.length})` : ''}}</label>
    </div>
    <item>
      <div>目录</div>
      <div slot="remark">{{routeQuery('categoryName')}}</div>
    </item>
    <div class="class-room-resourceList"
         v-if="messages.length>0">
      <div class="category-title"></div>
      <template v-if="messages.length>0">
        <div v-for="(m, i) in messages"
             :key="i"
             class="card-item"
             @click="cardClick(m)"
             :class="{'active': m.isSelect}">
          <ResourceCard v-if="routeQuery('type')!=='1047'"
                        :message='m'
                        :showBtn="routeQuery('type')==='1069'" />
          <QuetionCard :quetion="m"
                       :serail="i"
                       @analysis="handleAnalysis"
                       v-else />
        </div>
      </template>
    </div>
    <div v-else>
      <CardTips text="暂无内容" />
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import CardMixin from '@/views/components/card/mixin'
  import Mixin1047 from '@/views/business/1047/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [CardMixin, Mixin1047],
    components: {
      ResourceCard: resolve => require(['./ResourceCard'], resolve),
      QuetionCard: resolve => require(['./QuetionCard'], resolve)
    },
    data() {
      return {
        title: '',
        currentPage: 1,
        hasNextPage: 0,
        messages: [],
        selectedCard: []
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      })
    },
    created() {
      this.title = this.routeQuery('appName')
      this.loadResources()
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      loadResources() {
        if (Number(this.routeQuery('range')) === 17 || Number(this.routeQuery('range')) === 14 || Number(this.routeQuery('range')) === 16) {
          // 教学设计、课件、视频
          Api.getResourceDetail1({
            groupId: this.routeQuery('groupId'),
            currentPage: this.currentPage,
            categoryId: this.routeQuery('categoryId'),
            extensionType: this.routeQuery('type'),
            type: 'down'
          }).then(res => {
            this.successCallback(res)
          })
        } else if (Number(this.routeQuery('range')) === 8) {
          // 习题
          Api.getResourceDetail2(this.routeQuery('categoryId'), '1073', this.routeQuery('range'), this.currentPage).then(res => {
            if (res.hasNextPage > 0) {
              this.currentPage = res.currentPage
              this.hasNextPage = res.hasNextPage
            } else {
              this.hasNextPage = 0
            }
            res.questions ? (this.messages = [...this.messages, ...res.questions]) : this.messages ? (this.messages = [...this.messages]) : (this.messages = [])
          })
        } else if (Number(this.routeQuery('range')) === 18 || Number(this.routeQuery('range')) === 12 || Number(this.routeQuery('range')) === 19) {
          // 阅读作业、微课、作业
          Api.getResourceDetail3(this.routeQuery('groupId'), this.routeQuery('type'), this.routeQuery('categoryId'), this.currentPage).then(res => {
            this.successCallback(res)
          })
        } else if (Number(this.routeQuery('range')) === 9) {
          // 资源
          Api.getResourceDetail4(this.routeQuery('categoryId'), this.routeQuery('range'), this.currentPage).then(res => {
            this.successCallback(res)
          })
        }
      },
      successCallback(res) {
        if (res.hasNextPage > 0) {
          this.currentPage = res.currentPage
          this.hasNextPage = res.hasNextPage
        } else {
          this.hasNextPage = 0
        }
        if (res.messages) {
          this.messages = [...this.messages, ...res.messages]
        } else {
          this.messages ? (this.messages = [...this.messages]) : (this.messages = [])
        }
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadResources()
      },
      cardClick(m) {
        if (this.routeQuery('type') !== '1047' && (!m.medias || m.medias.length === 0) && this.routeQuery('msgType') === '2') {
          this.$message({
            type: 'warning',
            message: '无附件内容可选'
          })
          return false
        }
        let isSelect = !m.isSelect
        this.$set(m, 'isSelect', isSelect)
        this.selectedCard = this.messages.filter(m => {
          return m.isSelect
        })
      },
      handleAnalysis(question) {
        this.setStorage('question', question)
        this.routePush({ name: 'praxiAnaly1047' })
      },
      selectedSubmit() {
        if (this.selectedCard.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择题目'
          })
          return false
        }
        if (this.routeQuery('type') === '1047') {
          // 如果是习题，则先跳转预览界面
          let chachPreviewQuetions = this.cacheClassRoom.previewQuetions || []
          this.saveClassRoomCreate({
            previewQuetions: [...chachPreviewQuetions, ...this.selectedCard]
          })
          this.routePush({
            name: 'classRoomQuestions1073',
            query: {
              msgType: this.routeQuery('msgType'),
              isDelete: 1,
              categoryName: this.routeQuery('categoryName'),
              groupId: this.routeQuery('groupId'),
              appName: this.routeQuery('appName'),
              range: this.routeQuery('range')
            }
          })
          return false
        }
        // 课前
        if (Number(this.routeQuery('msgType')) === 1) {
          let selectedCard = [...this.cacheClassRoom.classBefore, ...this.selectedCard]
          this.saveClassRoomCreate({
            classBefore: selectedCard
          })
          this.$router.go(-3)
        } else if (Number(this.routeQuery('msgType')) === 2) {
          // 课中
          let lessonMedia = []
          const that = this
          const loading = that.$loading({
            text: '请稍后',
            background: 'rgba(255, 255, 255, .3)'
          })
          that.selectedCard.forEach((msg, i) => {
            msg.medias &&
              msg.medias.forEach((media, m) => {
                if (media.extension === 'pptx' || media.extension === 'ppt') {
                  // PPT转图片
                  Api.pptTOImages(media.fileId)
                    .then(res => {
                      if (res.files && res.files.length > 0) {
                        let mark = []
                        JSON.parse(res.files[0].mark).forEach(m => {
                          m.type = 'photo'
                          m.remark = '1101'
                          mark.push(m)
                        })
                        lessonMedia = [...lessonMedia, ...mark]
                        if (i === that.selectedCard.length - 1 && m === msg.medias.length - 1) {
                          that.saveClassRoomCreate({
                            classLesson: [...that.cacheClassRoom.classLesson, ...lessonMedia]
                          })
                          loading.close()
                          that.$router.go(-3)
                        }
                      }
                    })
                    .catch(res => {
                      loading.close()
                    })
                } else {
                  media.remark = '1100'
                  lessonMedia.push(media)
                  if (i === that.selectedCard.length - 1 && m === msg.medias.length - 1) {
                    that.saveClassRoomCreate({
                      classLesson: [...that.cacheClassRoom.classLesson, ...lessonMedia]
                    })
                    loading.close()
                    that.$router.go(-3)
                  }
                }
              })
          })
        } else if (Number(this.routeQuery('msgType')) === 3) {
          // 课后
          let selectedCard = [...this.cacheClassRoom.classAfter, ...this.selectedCard]
          this.saveClassRoomCreate({
            classAfter: selectedCard
          })
          this.$router.go(-3)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .class-room-resourceList {
    background-color: #ededed;
    .card-item {
      margin-bottom: rem(10);
      position: relative;
      background-color: #fff;
      &.active::before {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: block;
        pointer-events: none;
        @include borderColor(3);
      }
    }
  }
</style>
