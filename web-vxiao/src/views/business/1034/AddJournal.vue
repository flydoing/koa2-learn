<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasAdd="false">
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'topic']" />
    </keep-alive>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: (resolve) => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        message: null
      }
    },
    created() {
      const that = this
      that.msgId = that.routeParam('msgId')
      MessageApi.getMessageById(that.msgId).then((res) => {
        that.message = res.message
      })
    },
    computed: {
      ...mapGetters({
        journal: 'getJournal'
      }),
      title() {
        return this.journal.weekday ? this.journal.weekday.title : ''
      }
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      handleSubmit() {
        const that = this

        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let weekday = that.journal.weekday
        let postData = that.constructionMessage({
          ...that.editorMessage,
          parentId: that.msgId,
          title: weekday.title,
          extensionType: weekday.time,
          type: '1035',
          groupId: that.groupId
        })

        MessageApi.addMessage(postData).then((res) => {
          let ms = that.message.children || []
          that.message.children = [...ms, res.messages[0]]
          that.modifyChannelMessage(that.message)
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          that.routeBack()
        })
      }
    }
  }
</script>
