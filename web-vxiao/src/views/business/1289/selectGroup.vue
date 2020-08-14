<template>
  <SelectUser title="选择小组"
              :cache="cache"
              :users="groups"
              :multiselect="true"
              @submit="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        teams: [],
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        order: 'getOrder'
      }),
      groups() {
        return this.teams
      }
    },
    methods: {
      ...mapActions(['setOrder']),
      fetchData() {
        this.cache = this.order.users
        GroupApi.getGroupTeams(this.currentGroup.groupId).then(res => {
          this.teams = res.groups
        })
      },
      handleSubmit(users) {
        if (!Check.isRealArray(users)) {
          this.$message({ message: '请选择小组', type: 'warning' })
          return false
        }
        users.forEach(item => {
          item['userId'] = item.id
          delete item.id
        })
        console.log(users, 'users')
        this.setOrder({ users: users })
        this.routeBack()
      }
    }
  }
</script>
