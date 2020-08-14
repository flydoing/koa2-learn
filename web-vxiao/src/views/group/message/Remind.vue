<template>
  <Scroller :height="sh"
            style="background:#FFF;" class="vx-remind">
    <div class="category-title text first"
         v-if="bubblesNews.length !== 0">未读</div>
    <ItemList v-for="m in bubblesNews"
              :key="m.id"
              @click="handle(m, 1)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(m.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
           alt='LOGO'>
      <span slot="title"
            v-html="titleTxt(m)"></span>
      <span slot="remark">{{m.time}}</span>
      <span slot="main"
            v-html="changeAnd(m.content)"></span>
      <template slot="after">&nbsp;</template>
    </ItemList>
    <div class="category-title text"
         v-if="bubblesTodo.length !== 0">待办</div>
    <ItemList v-for="m in bubblesTodo"
              :key="m.id"
              @click="handle(m, 2)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(m.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
           alt='LOGO'>
      <span slot="title"
            v-html="titleTxt(m)"></span>
      <span slot="remark">{{m.time}}</span>
      <span slot="main"
            v-html="changeAnd(m.content)"></span>
      <template slot="after">&nbsp;</template>
    </ItemList>
    <!-- <div class='pagination-more'
         @click="getAudienceBackward()"
         :class="{'is-click':hasMore}">
      {{text}}
    </div> -->
    <div class="category-title text"
         v-if="bubblesHistory.length !== 0">已读</div>
    <ItemList v-for="m in bubblesHistory"
              :key="m.id"
              @click="handle(m, 2)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(m.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
           alt='LOGO'>
      <span slot="title"
            v-html="titleTxt(m)"></span>
      <span slot="remark">{{m.time}}</span>
      <span slot="main"
            v-html="changeAnd(m.content)"></span>
      <template slot="after">&nbsp;</template>
    </ItemList>
    <div class='pagination-more'
         @click="handleGetHistory()">
      {{loadMoreHistoryText}}
    </div>
    <div class="vx-model-tips"
         v-if="bubbles.length === 0 && bubblesHistory.length === 0">
      <slot name="tips">
        <img src="/static/ico/icon_commoneuse.png" />
        <span>暂无内容</span>
      </slot>
    </div>
  </Scroller>
</template>
<script>
  import IMApi from '@/api/im'
  import R from '../mixin'
  import Text from '@/utils/text'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        timeout: null,
        bubblesHistory: [],
        loadMoreHistoryText: '加载历史已读消息...'
      }
    },
    computed: {
      ...mapGetters(['getNotifyBubble']),
      sh() {
        return this.innerHeight - 75 - 40 - 10
      },
      bubbles() {
        return this.getNotifyBubble
          .filter(m => {
            return m.groupId === this.currentGroup.groupId
          })
          .reverse()
      },
      bubblesNews() {
        return this.getNotifyBubble
          .filter(m => {
            return m.groupId === this.currentGroup.groupId && (m.type === '1' || m.type === '26') && m.msgType !== '27'
          })
          .reverse()
      },
      bubblesTodo() {
        return this.getNotifyBubble
          .filter(m => {
            return m.groupId === this.currentGroup.groupId && m.msgType === '27' && m.status !== '4' && m.status !== 'd'
          })
          .reverse()
      }
    },
    created() {},
    methods: {
      ...mapActions(['modifyNotify']),
      changeAnd(value) {
        return Text.changeAnd(value)
      },
      titleTxt(ms) {
        return `${ms.fromUserName || ''}${this.changeAnd(ms.title)}`
      },
      initHistory() {
        this.bubblesHistory = []
        this.loadMoreHistoryText = '加载历史已读消息...'
      },
      handleGetHistory() {
        let bubblesHistory = []
        for (var i = 0, len = localStorage.length; i < len; ++i) {
          // _readTodo,_readNews
          // 当前grouid,含有read
          if (localStorage.key(i).indexOf('RM_') >= 0) {
            let message = JSON.parse(localStorage.getItem(localStorage.key(i)))
            if (message.groupId === this.currentGroup.groupId && localStorage.key(i).indexOf('read') >= 0) {
              bubblesHistory.push(message)
            }
          }
        }
        this.bubblesHistory = bubblesHistory
        this.loadMoreHistoryText = '历史已读消息加载完毕'
        if (this.bubblesHistory.length === 0) {
          this.loadMoreHistoryText = '暂无历史已读消息'
        }
      },
      handle(m, isTodo) {
        // 是否待办isTodo: 1不是，2是
        if (isTodo === 1) {
          this.modifyNotify(m)
          this.loadMoreHistoryText = '加载历史已读消息...'
        }
        if (m.extension === 'report') {
          let q = JSON.parse(m.extensionType)
          this.routePush({
            path: '/vx/group/business/report/message/detail/1',
            query: { ...q, groupId: this.groupId, appType: q.type }
          })
        } else if (m.type === '26') {
          this.setStorage('_cache_batch_face', m)
          this.routePush({
            path: '/vx/group/user/batch/face/detail'
          })
        } else if (m.parentId || m.id) {
          this.routePush({
            path: '/vx/group/remind/detail',
            query: {
              id: m.parentId || m.id
            }
          })
        } else {
          this.$message({ type: 'warning', message: '该消息已经被删除' })
        }
      },
      onClear() {
        this.bubbles.some(m => {
          // 只清空消息，待办的不清空
          if (m.msgType === '27') {
            // 待办的不清空
          } else {
            this.modifyNotify(m)
          }
        })
        // this.bubbles.some(m => {
        //   this.modifyNotify(m)
        // })
      },
      // onClear() {
      //   this.bubbles.some(m => {
      //     this.modifyNotify(m)
      //   })
      // },
      queryTodoList() {
        IMApi.queryTodoList(this.groupId).then(data => {
          console.log(data)
          // this.modifyGroup({ groupId: this.groupId, redotCount: 11 })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pagination-more {
    height: rem(35);
    line-height: rem(35);
    text-align: center;
  }
  .vx-remind .category-title{
    background-color: #f3f3f3;
  }
</style>
