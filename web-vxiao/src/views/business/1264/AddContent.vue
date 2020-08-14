<template>
  <page title="添加评价内容"
        @submit="handleSubmit"
        hasSubmit>
    <keep-alive>
      <EditorSimple :store.sync="form"
                    :toolbars="['photo']" />
    </keep-alive>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import MessageApi from '@/api/message'
import Check from '@/utils/check'

export default {
  mixins: [R],
  data() {
    return {
      form: {},
      medias: []
    }
  },
  components: {
    EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
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
    handleSubmit() {
      const that = this
      if (Check.isNullString(that.form.content)) {
        that.$message({ message: '内容不能为空', type: 'warning' })
        return false
      }
      let postData = {
        ...this.form,
        id: that.message.id,
        content: `${that.message.content}${that.form.content}\n`,
        type: that.message.type,
        groupId: that.message.groupId
      }
      that.modifyMessage(postData).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.form = {}
        that.routeBack()
      })
    }
  }
}
</script>
