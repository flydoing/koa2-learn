<template>
  <SelectUser title="选择成员"
              :users="users"
              :multiselect="false"
              @change="handleSubmit" />
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
        users: [],
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      fetchData() {
        const that = this
        GroupApi.getSchoolTeachers(this.currentGroup.parentId).then(res => {
          that.users = res.relations
        })
      },
      handleSubmit(user) {
        this.setRating({ user: user })
        this.routeBack()
      }
    }
  }
</script>
