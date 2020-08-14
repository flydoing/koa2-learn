<template>
  <page title="相关人"
        hasSubmit
        @submit="handleSubmit">
    <Relate :items="us"
            :plus="canEdit"
            :reduce="canEdit"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
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
        crm: 'getCrm'
      }),
      us() {
        let datas = this.users.filter(v => {
          return v.status !== 'd'
        })
        return datas.map(v => {
          return { ...v, avatar: this.url(v.avatar) }
        })
      },
      canEdit() {
        return this.crm.canEdit || true
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyChannelMessage']),
      fetchData() {
        if (this.crm.members) {
          this.users = [...this.crm.members]
          let users = this.getStorage('_crm_business_users_cache') || []
          users = users.map(v => {
            return {
              userId: v.userId,
              name: v.name,
              userType: v.userType,
              avatar: v.avatar
            }
          })
          this.users.push(...users)
          this.deleteOrderProp('members')
        } else if (this.crm.relations) {
          this.users = JSON.parse(JSON.stringify(this.crm.relations || []))
          this.deleteCrmProp('relations')
        }
      },
      handleAdd() {
        this.setCrm({
          members: this.users,
          params: {
            multiple: true,
            property: 'users'
          }
        })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleRemove(user, i) {
        let form = this.crm.form
        if (form.userId === user.userId) {
          this.$message({ message: '不能删除代理商创建人', type: 'warning' })
          return false
        }
        if (user.id) {
          this.$set(this.users, i, { ...user, status: 'd' })
        }
      },
      handleSubmit() {
        this.setStorage('_crm_business_relations_cache', this.users)
        this.routeBack()
      }
    }
  }
</script>
