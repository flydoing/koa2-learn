<template>
  <SelectUser v-if="users.length>0"
              title="新建评价"
              :cache="cache"
              :users="users"
              :multiselect="true"
              :closePromp="true"
              @submit="handleNext"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import Api from './api'
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
        relations: [],
        cache: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCreateObject'
      }),
      users() {
        return [...this.teams, ...this.relations]
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        const that = this
        that.cache = that.evaluate.users || []
        that.modifyCreateObjectField('users')

        if (that.isParent) {
          GroupApi.getGroupUserChildren(that.currentGroup.groupId).then(res => {
            if (Check.isRealArray(res.relations)) {
              that.relations = res.relations || []
            }
          })
        } else if (that.isTeacher || that.isAdmin) {
          GroupApi.getGroupTeams(that.currentGroup.groupId).then(res => {
            if (Check.isRealArray(res.groups)) {
              res.groups.map(g => {
                that.teams.push({
                  id: g.id,
                  userId: g.id,
                  avatar: g.logo ? g.logo : 'group',
                  name: g.name,
                  type: 'group',
                  userType: g.type,
                  selected: false
                })
              })
            }
          })
          GroupApi.getGroupStudents(that.currentGroup.groupId).then(res => {
            that.relations = res.relations || []
          })
        } else {
          Api.loadStudentsAndTeams(that.currentGroup.groupId).then(res => {
            if (Check.isRealArray(res.groups)) {
              res.groups.map(g => {
                that.teams.push({
                  id: g.id,
                  userId: g.id,
                  avatar: g.logo ? g.logo : 'group',
                  name: g.name,
                  type: 'group',
                  userType: g.type,
                  selected: false
                })
              })
            }
            that.relations = res.relations || []
          })
        }
      },
      handleNext(users) {
        if (!Check.isRealArray(users)) {
          this.$message({ message: '请选择成员', type: 'warning' })
          return false
        }
        this.setCreateObject({ users: users })
        this.routePush({ name: 'sendMedal1005' })
      }
    }
  }
</script>
