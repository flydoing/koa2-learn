<template>
  <Student v-if="user.userType==='4'"
           :relations="relations"></Student>
  <Parent v-else-if="user.userType==='3'"
          :relations="relations"></Parent>
  <Teacher v-else
           :relations="relations"></Teacher>
</template>
<script>
  import Api from '@/api/group'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Parent: resolve => require(['./Parent'], resolve),
      Student: resolve => require(['./Student'], resolve),
      Teacher: resolve => require(['./Teacher'], resolve)
    },
    data() {
      return {
        relations: [],
        user: {}
      }
    },
    computed: {
      ...mapGetters({ currentGroup: 'getCurrentGroup' })
    },
    methods: {
      fetchData() {
        let userId = this.routeParam('userId')
        let groupId = this.routeQuery('groupId') || this.currentGroup.groupId
        Api.getGroupUser(groupId, userId).then(res => {
          this.user = res.relations[0]
          this.$nextTick(() => {
            this.relations = res.relations
          })
        })
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route.params'(v) {
        this.fetchData()
      }
    }
  }
</script>
