<template>
  <page :title="title">
    <Relate :items="us"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        order: 'getOrder'
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
      ...mapActions(['setOrder', 'deleteOrderProp']),
      fetchData() {
        if (this.order.members) {
          this.users = [...this.order.members]
          if (this.order.users) {
            this.users.push(...this.order.users)
            this.deleteOrderProp('users')
          }
          this.deleteOrderProp('members')
        } else if (this.order.item) {
          this.users = JSON.parse(JSON.stringify(this.order.item.toUsers || []))
        }
      },
      handleAdd() {
        this.setOrder({ members: this.users })
        this.routePush({ name: 'selectMember1039', query: { request: 1 } })
      },
      handleRemove(user, i) {
        Api.modifyHandler({
          metaDatas: [
            {
              id: user.id,
              userId: user.userId,
              status: 'd',
              metaType: 'm_group_audit_default_type'
            }
          ]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.users.splice(i, 1)
        })
      }
    }
  }
</script>
