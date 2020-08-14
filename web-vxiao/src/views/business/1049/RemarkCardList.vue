<template>
  <page title="评比备注" @scrollEnd="scrollEnd">
    <CardList :messages="messages"></CardList>
  </page>
</template>
<script>
  import { mapGetters } from 'vuex'
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
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      loadMessages() {
        const that = this
        let p = this.rating.project
        let c = this.rating.cls
        that.sDate = that.routeQuery('sDate')
        let postData = null
        if (p) {
          postData = {
            type: '1107',
            queryType: 'category',
            groupId: that.currentGroup.groupId,
            categoryId: p.id
          }
        } else {
          postData = {
            type: '1107',
            queryType: 'category',
            groupId: c.groupId
          }
        }
        that.sDate && (postData.keyword = that.sDate)
        this.getMessages(postData).then(res => {}).catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }

</script>
