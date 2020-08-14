<template>
  <page title="习题"
        @scrollEnd="scrollEnd"
        @back="handleBack"
        listenBack>
    <div slot="btn">
      <label @click="handleSelected">已选{{selectedItem.length>0 ? `(${selectedItem.length})` : ''}}</label>
    </div>
    <div class="praxis-detail-list"
         v-if="messages.length>0">
      <div class="category-title"></div>
      <template v-for="(m, i) in messages">
        <div :key="i"
             v-if="messages.length>0"
             class="card-item"
             @click="cardClick(m)"
             :class="{'active': m.isSelect}">
          <QuetionCard :quetion="m"
                       :serail="i"
                       @analysis="handleAnalysis" />
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
      QuetionCard: resolve => require(['@/views/business/1073/QuetionCard'], resolve)
    },
    data() {
      return {
        title: '',
        currentPage: 1,
        hasNextPage: 0,
        messages: []
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      }),
      selectedItem() {
        if (this.messages.length > 0) {
          return this.messages.filter(m => {
            return m.isSelect
          })
        }
        return []
      }
    },
    created() {
      this.loadResources()
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      loadResources() {
        let cMap = new Map()
        let caches = this.cacheClassRoom.previewQuetions
        if (caches && caches.length > 0) {
          caches.map(v => {
            cMap.set(v.id, v)
          })
        }
        Api.getPraxisList(this.groupId, this.currentPage).then(res => {
          if (res.hasNextPage > 0) {
            this.currentPage = res.currentPage
            this.hasNextPage = res.hasNextPage
          } else {
            this.hasNextPage = 0
          }
          if (res.questions) {
            let qts = res.questions.map(v => {
              if (cMap.get(v.id)) {
                v.isSelect = true
              }
              return v
            })
            this.messages = [...this.messages, ...qts]
          }
        })
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadResources()
      },
      cardClick(m) {
        let isSelect = !m.isSelect
        this.$set(m, 'isSelect', isSelect)
      },
      handleAnalysis(question) {
        this.setStorage('question', question)
        this.routePush({ name: 'praxiAnaly1047' })
      },
      handleSelected() {
        if (this.selectedItem.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择题目'
          })
          return false
        }
        // 如果是习题，则先跳转预览界面
        this.saveClassRoomCreate({
          previewQuetions: [...this.selectedItem]
        })
        this.routePush({ name: 'previewList1200' })
      },
      handleBack() {
        this.saveClassRoomCreate({
          previewQuetions: []
        })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .praxis-detail-list {
    background-color: #ededed;
    .card-item {
      margin-bottom: rem(10);
      position: relative;
      background-color: #fff;
      &.active::before {
        content: '';
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: block;
        position: absolute;
        pointer-events: none;
        @include borderColor(3);
      }
    }
  }
</style>
