<template>
  <page title="相关人">
    <Relate :items="us"
            :plus="canEdit"
            :reduce="canEdit"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
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
        crm: 'getCrm'
      }),
      us() {
        return this.users.map(v => {
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
          this.users.push(...users)
          this.deleteOrderProp('members')
        } else if (this.crm.relations) {
          this.users = JSON.parse(JSON.stringify(this.crm.relations || []))
          this.deleteCrmProp('relations')
        }
      },
      modifyRelation(datas, cback) {
        let form = this.crm.form
        GroupApi.addGroupRelation({
          relations: datas
        }).then(res => {
          Api.modifyCustomer(
            {
              clients: [
                {
                  id: form.id
                }
              ]
            },
            form.msgId
          ).then(result => {
            this.modifyChannelMessage(result.messages[0])
            this.$message({ message: '操作成功', type: 'success' })
            cback && cback(res.relations)
          })
        })
      },
      handleAdd() {
        let form = this.crm.form
        let params = {
          multiple: true,
          property: 'users'
        }
        if (form.id) {
          params.callback = (datas, cback) => {
            this.modifyRelation(
              datas.map(v => {
                return {
                  groupId: form.groupId,
                  userId: v.userId,
                  type: '2'
                }
              }),
              cback
            )
          }
        }
        this.setCrm({ members: this.users, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleRemove(user, i) {
        let form = this.crm.form
        if (form.userId === user.userId) {
          this.$message({ message: '不能删除客户创建人', type: 'warning' })
          return false
        }
        this.modifyRelation(
          [
            {
              id: user.id,
              groupId: form.groupId,
              status: 'd'
            }
          ],
          () => {
            this.users.splice(i, 1)
          }
        )
      }
    }
  }
</script>
