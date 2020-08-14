<template>
  <Page title="选择部门"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item, i) in groups"
          :key="i"
          :item="item"
          @click="handleGroup(item)">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="item.remark"></div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        groups: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this

        let gMap = new Map()
        let objects = that.active.objects || []
        if (Check.isRealArray(objects)) {
          objects.map(c => {
            gMap.set(c.groupId, c)
          })
        }

        let group = that.active.group
        if (group && gMap.get(group.groupId)) {
          let objs = objects.map(v => {
            if (v.groupId === group.groupId) {
              v = group
            }
            return v
          })
          that.setCreateObject({ objects: objs })
        } else if (group) {
          that.setCreateObject({ objects: [...objects, group] })
        }
        group && gMap.set(group.groupId, group)

        GroupApi.getSchoolGroupsByType(that.currentGroup.parentId, '1').then(res => {
          that.groups = res.groups.map(g => {
            g = gMap.get(g.groupId)
              ? gMap.get(g.groupId)
              : {
                  ...g,
                  remark: '',
                  members: []
                }
            return g
          })
        })
      },
      handleSubmit() {
        const that = this
        let column = that.active.column
        let admins = that.active.admins
        let objs = that.active.objects || []
        let datas = objs.filter(v => {
          return Check.isRealArray(v.members)
        })
        if (!Check.isRealArray(datas)) {
          that.$message({ message: '请选择部门成员', type: 'warning' })
          return false
        }

        let users = []
        let uMap = new Map()
        datas.map(v => {
          v.members.map(m => {
            uMap.set(m.userId, m)
            users.push({
              schoolId: that.currentGroup.parentId,
              status: '1',
              type: '1011',
              userId: m.userId,
              categoryId: column.id
            })
          })
        })

        GroupApi.modifyAppAdmins(users).then(res => {
          let us = users.map(v => {
            let user = uMap.get(v.userId)
            v.name = user.name
            v.avatar = this.url(user.avatar)
            return v
          })
          that.setCreateObject({ admins: [...admins, ...us] })
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleGroup(item) {
        this.setCreateObject({ group: item })
        this.routePush({ name: 'selectMember1011' })
      }
    }
  }
</script>
