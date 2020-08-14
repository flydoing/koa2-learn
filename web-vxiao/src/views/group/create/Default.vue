<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        @submit="submit">
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    props: { app: Object },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        content: '',
        medias: []
      }
    },
    computed: {
      title() {
        if (this.app) {
          return `新建${this.app.name}`
        } else {
          return '新建'
        }
      }
    },
    methods: {
      submit() {
        let that = this
        if (Check.isNullString(this.editorMessage.content) && !Check.isRealArray(this.editorMessage.medias)) {
          that.$message({ message: '分享内容不能为空', type: 'warning' })
          return false
        }

        that
          .addMessage(
            that.constructionMessage({
              type: that.app.type,
              groupId: that.currentGroup.groupId,
              ...this.editorMessage
            })
          )
          .then(res => {
            this.content = ''
            this.$message({ message: '操作成功', type: 'success' })
            this.editorMessage = {}
            this.routeBack()
          })
      },
      handleBack() {
        if (this.content.length > 0) {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.routeBack()
          })
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
