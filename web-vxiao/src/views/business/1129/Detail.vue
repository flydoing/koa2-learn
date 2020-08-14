<template>
  <Page title="任务详情"
        @scrollEnd="scrollEnd">
    <div class="task-detail">
      <div class="category-title">任务内容</div>
      <div class="td-content"
           v-html="content"></div>
      <img class="task-img"
           v-for="(image,i) in task.medias"
           :key="i"
           v-lazy="{src:url(image.fileId),error:'/static/ico_im_empty.png'}" />
      <div class="category-title">答卷</div>
      <CardList :messages="messages" />
    </div>
  </Page>
</template>
<script>
  import MessageApi from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        task: {}
      }
    },
    computed: {
      content() {
        return this.converContent(this.task.content)
      }
    },
    methods: {
      loadMessages() {
        this.getMessages({
          groupId: this.currentGroup.groupId,
          type: '1130',
          queryType: 'parentId',
          parentId: this.routeParam('msgId')
        })
          .then(res => {})
          .catch(res => {})
      }
    },
    mounted() {
      const that = this
      let msgId = that.routeParam('msgId')
      MessageApi.getMessageById(msgId).then(res => {
        that.task = res.message
      })
      this.loadMessages()
    }
  }
</script>
<style lang="scss">
  .td-content {
    padding: 10px 20px;
  }
  .task-img {
    display: inline-block;
    margin: 5px;
    width: 100px;
    height: 100px;
  }
</style>
