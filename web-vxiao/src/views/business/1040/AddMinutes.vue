<template>
  <page title="添加会议纪要"
        @submit="handleSubmit"
        hasSubmit>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'emoji', 'at', 'topic']" />
    </keep-alive>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        message: null
      }
    },
    created() {
      const that = this
      that.msgId = that.routeParam('msgId')
      MessageApi.getMessageById(that.msgId).then(res => {
        that.message = res.message
      })
    },
    computed: {},
    methods: {
      ...mapActions(['modifyChannelMessage']),
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }
        let postData = that.constructionMessage({
          parentId: that.msgId,
          title: '会议纪要',
          type: '1041',
          groupId: that.currentGroup.groupId,
          ...this.editorMessage
        })
        MessageApi.addMessage(postData).then(res => {
          if (res.messages) {
            let m = { ...that.message, children: res.messages }
            that.modifyChannelMessage(m)
          }
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          that.routeBack()
        })
      }
    }
  }
</script>
