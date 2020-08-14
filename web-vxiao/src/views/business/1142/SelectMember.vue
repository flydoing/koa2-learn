<template>
  <SelectUser title="被访人" :cache="cache" :users="members" :multiselect="false" @change="handleSelect"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        members: [],
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        visitor: 'getVisitor'
      })
    },
    methods: {
      ...mapActions(['setVisitor']),
      fetchData() {
        this.cache = this.visitor.member ? [this.visitor.member] : []
        GroupApi.getGroupUsers(this.groupId).then(res => {
          this.members = res.relations
        })
      },
      handleSelect(m) {
        this.setVisitor({ member: m })
        this.routeBack()
      }
    }
  }

</script>
