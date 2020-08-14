<template>
  <page title="提交任务"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <div class="commit-task">
      <div class="ct-content"
           v-html="taskContent"></div>
      <div class="category-title"></div>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        task: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      taskContent() {
        return this.converContent(this.task.content)
      }
    },
    methods: {
      fetchData() {
        let msgId = this.routeParam('msgId')
        MessageApi.getMessageById(msgId).then(res => {
          this.task = res.message
        })
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }
        let postData = that.constructionMessage({
          parentId: that.task.id,
          type: '1130',
          groupId: that.currentGroup.groupId,
          ...this.editorMessage
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .commit-task {
    .ct-content {
      padding: rem(5) rem(8);
      text-align: justify;
    }
    textarea {
      height: rem(150);
    }
  }
</style>
