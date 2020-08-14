<template>
  <page title="校务评比备注"
        @scrollEnd="scrollEnd">
    <CardList :messages="messages"></CardList>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {}
    },
    computed: {},
    methods: {
      loadMessages() {
        const that = this
        that.sDate = that.routeQuery('sDate')
        let postData = {
          type: '128301',
          queryType: 'category',
          groupId: this.groupId
        }

        that.sDate && (postData.keyword = that.sDate)
        this.getMessages(postData).then(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }
</script>
