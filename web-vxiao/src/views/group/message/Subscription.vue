<template>
  <page title="转发至公众号"
        hasSubmit
        @submit="handleSubmit">
    <item v-for="(item, i) in list"
          :key="i">
      <div slot="main"
           v-html="item.title"></div>
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        MessageApi.getForwardMessage({
          parentId: that.routeQuery('msgId'),
          fromUserId: that.USER.id,
          recommend: JSON.stringify({
            type: '3',
            status: '1'
          })
        }).then(res => {
          that.list = res.messages || []
        })
      },
      handleRemove(item, i) {
        const that = this
        MessageApi.getForwardMessage({
          id: item.id,
          recommend: JSON.stringify({
            type: '3',
            status: '3'
          })
        }).then(res => {
          that.list.splice(i, 1)
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleSubmit() {
        if (this.list.length < 1) {
          this.$message({ message: '推荐消息不能为空', type: 'warning' })
          return false
        }
        MessageApi.forwardToWechatSubscription(this.groupId, {
          messages: this.list.map(v => {
            return { id: v.id }
          })
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
