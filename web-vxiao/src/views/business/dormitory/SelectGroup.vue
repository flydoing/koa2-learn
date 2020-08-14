<template>
  <page title="选择班级"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="handleBack">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleGroup(item)">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="remarkTxt(item)"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      remarkTxt(item) {
        return Check.isRealArray(item.members) ? `${item.members.length}位成员` : ''
      },
      fetchData() {
        const that = this

        let gMap = new Map()
        let objects = that.getStorage('_dormitory_objects') || []
        if (Check.isRealArray(objects)) {
          objects.map(c => {
            gMap.set(c.groupId, c)
          })
        }

        let group = that.getStorage('_dormitory_group')
        if (group) {
          if (gMap.get(group.groupId) && Check.isRealArray(objects)) {
            let objs = objects.map(v => {
              if (v.groupId === group.groupId) {
                v = group
              }
              return v
            })
            that.setStorage('_dormitory_objects', objs)
          } else {
            that.setStorage('_dormitory_objects', [...objects, group])
          }
          gMap.set(group.groupId, group)
        }

        let campusId = that.routeQuery('cId')
        GroupApi.getSchoolGroups(that.currentGroup.groupId).then(res => {
          let cMap = new Map()
          res.groups.map(g => {
            if (g.cId) {
              g = gMap.get(g.groupId) ? gMap.get(g.groupId) : { ...g, members: [] }

              let campus = cMap.get(g.cId)
              if (campus) {
                campus.classes.push(g)
                cMap.set(g.cId, campus)
              } else {
                cMap.set(g.cId, { id: g.cId, name: g.campus, classes: [g] })
              }
            }
          })
          that.list = cMap.get(parseInt(campusId)).classes
        })
      },
      handleSubmit() {
        let users = []
        this.list.map(v => {
          if (Check.isRealArray(v.members)) {
            users.push(...v.members)
          }
        })

        if (!Check.isRealArray(users)) {
          this.$message({ message: '请选择成员', type: 'warning' })
          return false
        }

        let dormitory = this.getStorage('_dormitory_cache', true)
        Api.addDormitoryMember({
          dormitoryUserRelations: users.map(v => {
            return {
              placeId: dormitory.id,
              groupId: v.groupId,
              cId: dormitory.cid,
              schoolId: this.currentGroup.parentId,
              userId: v.userId
            }
          })
        }).then(res => {
          this.getStorage('_dormitory_member_filter')
          this.getStorage('_dormitory_objects')
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleGroup(item) {
        this.setStorage('_dormitory_group', item)
        this.routePush({
          path: '/vx/group/business/dormitory/selectMember',
          query: {
            groupId: item.groupId,
            title: item.name
          }
        })
      },
      handleBack() {
        this.getStorage('_dormitory_member_filter')
        this.getStorage('_dormitory_objects')
        this.routeBack()
      }
    }
  }
</script>
