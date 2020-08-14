<template>
  <page title="立即接龙" @submit="handleSubmit" hasSubmit :hasAdd="false">
    <keep-alive>
      <EditorSimple :store.sync="editorMessage" :toolbars="['photo', 'file', 'at']" />
    </keep-alive>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    created() {},
    computed: {},
    methods: {
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          ...that.editorMessage,
          parentId: that.routeQuery('msgId'),
          type: '125701',
          groupId: that.groupId
        })

        MessageApi.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routePushModel({
            name: 'detail1257',
            query: {
              msgId: that.routeQuery('msgId'),
              skip: '1'
            }
          })
        })
      }
    }
  }

</script>
