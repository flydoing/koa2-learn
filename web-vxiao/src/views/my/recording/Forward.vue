<template>
  <Page title="转发"
        hasSubmit
        @submit="handleSubmit">
    <SelectGroup :groups="groups"
                 :multiselect="true"
                 ref="_select_group" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MR from '@/views/business/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [R, MR, MixinMessage],
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    computed: {
      ...mapGetters(['getGroups']),
      groups() {
        let that = this
        return this.getGroups.filter(g => {
          return (g.type === '1' || g.type === '2') && g.groupId !== that.groupId
        })
      }
    },
    data() {
      return {
        groupIds: [],
        message: {}
      }
    },
    created() {
      this.message = this.getStorage('_cache_forward_message_recording')
    },
    methods: {
      handleSubmit() {
        let keys = this.$refs._select_group.getKeys()
        this.groupIds = keys
        const that = this
        let message = that.message
        message.msgJson = JSON.stringify(message.msgJson)
        let postData = that.constructionMessage({
          ...that.message,
          groupIds: that.groupIds
        })
        console.log(postData)
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
