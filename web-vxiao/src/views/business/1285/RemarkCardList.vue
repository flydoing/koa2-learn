<template>
  <page title="宿舍评比备注"
        @scrollEnd="scrollEnd">
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
        let d = this.rating.dormitory
        that.sDate = that.routeQuery('sDate')
        let postData = null
        if (p) {
          postData = {
            type: '128501',
            queryType: 'category',
            groupId: that.groupId,
            categoryId: p.id
          }
        } else {
          postData = {
            type: '128501',
            queryType: 'category',
            groupId: that.groupId,
            placeId: d.id
          }
        }
        that.sDate && (postData.keyword = that.sDate)
        this.getMessages(postData)
          .then(res => {})
          .catch(res => {})
      }
    },
    mounted() {
      this.loadMessages()
    }
  }
</script>
