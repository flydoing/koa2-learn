<template>
  <page title="班主任"
        hasSubmit
        @submit="handleSubmit">
    <Relate :items="us"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

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
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.removes) {
          this.removes = [...this.obj.removes]
          this.modifyCreateObjectField('removes')
        }
        if (this.obj.members) {
          this.users = [...this.obj.members]
          if (this.obj.users) {
            this.users.push(...this.obj.users)
            this.modifyCreateObjectField('users')
          }
          this.modifyCreateObjectField('members')
        } else if (this.obj.teachers) {
          let users = JSON.parse(JSON.stringify(this.obj.teachers))
          users.forEach(v => {
            if (v.status !== 'd') {
              this.users.push(v)
            } else {
              this.removes.push(v)
            }
          })
        }
      },
      handleAdd() {
        this.setCreateObject({ members: this.users, removes: this.removes })
        this.routePush({ path: '/vx/group/business/1147/classStep/selectMember' })
      },
      handleRemove(user, i) {
        if (user.id) {
          this.removes.push({ ...this.users[i], status: 'd' })
        }
        this.users.splice(i, 1)
      },
      handleSubmit() {
        let users = []
        let userMap = new Map()
        if (Check.isRealArray(this.users)) {
          users = this.users.map(v => {
            userMap.set(v.userId, v)
            return v
          })
        }

        let removeMap = new Map()
        if (Check.isRealArray(this.removes)) {
          this.removes.map(v => {
            removeMap.set(v.userId, v)
            return v
          })
          let us = this.removes.filter(v => {
            return Check.isNullObject(userMap.get(v.userId))
          })
          users.push(...us)
        }

        users = users.map(v => {
          if (userMap.get(v.userId) && removeMap.get(v.userId)) {
            let u = removeMap.get(v.userId)
            return { ...u, status: '1' }
          }
          return v
        })
        this.setCreateObject({ teachers: users })
        this.routeBack()
      }
    }
  }
</script>
