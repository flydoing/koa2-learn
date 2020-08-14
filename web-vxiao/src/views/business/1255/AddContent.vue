<template>
  <page title="立即打卡" @submit="handleSubmit" hasSubmit :hasAdd="false">
    <item :hasClick="false">
      <div slot="main">打卡日期</div>
      <div slot="remark" v-html="date"></div>
    </item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage" :toolbars="['photo', 'file', 'at']" />
    </keep-alive>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        date: this.routeQuery('date')
      }
    },
    created() {},
    computed: {},
    methods: {
      ...mapActions(['modifyChannelMessage', 'setPunchClock']),
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          ...that.editorMessage,
          parentId: that.routeQuery('msgId'),
          type: '125501',
          groupId: that.groupId
        })

        MessageApi.addMessage(postData).then(res => {
          this.setPunchClock({ readed: 1 })
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }

</script>
