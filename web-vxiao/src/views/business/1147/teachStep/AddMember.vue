<template>
  <page :title="title">
    <Relate :items="us"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from '../api'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: [],
        removes: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      us() {
        return this.users.map(v => {
          return { ...v, avatar: this.url(v.avatar) }
        })
      },
      title() {
        return this.routeQuery('title') || ''
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.members) {
          this.users = [...this.obj.members]
          if (this.obj.users) {
            this.users.push(...this.obj.users)
            this.modifyCreateObjectField('users')
          }
          this.modifyCreateObjectField('members')
        } else if (this.obj.teachCache) {
          this.users = JSON.parse(JSON.stringify(this.obj.teachCache.relations || []))
        }
      },
      handleAdd() {
        this.setCreateObject({ members: this.users })
        this.routePush({ path: '/vx/group/business/1147/teachStep/selectMember' })
      },
      handleRemove(user, i) {
        let cell = this.obj.teachCache
        Api.modifyTeachInfo({
          cell: {
            courseId: cell.courseId,
            groupId: cell.groupId,
            relations: [
              {
                userId: user.userId,
                status: 'd'
              }
            ]
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.users.splice(i, 1)
        })
      }
    }
  }
</script>
