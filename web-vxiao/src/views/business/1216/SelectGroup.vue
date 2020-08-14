<template>
  <page title="选择班级/群组" @submit="handleSubmit" hasSubmit>
    <item v-for="(item, i) in groups" :key="i" @click="handleGroup(item)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="item.remark"></div>
    </item>
    <div v-for="(item, i) in campuses" :key="i">
      <div class="category-title text" v-html="item.name"></div>
      <item v-for="(cls, j) in item.classes" :key="j" @click="handleGroup(cls)">
        <div slot="main" v-html="cls.name"></div>
        <div slot="remark" v-html="cls.remark"></div>
      </item>
    </div>
  </page>
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
        groups: [],
        campuses: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        inspection: 'getInspection'
      })
    },
    methods: {
      ...mapActions(['setInspection']),
      fetchData() {
        const that = this

        let gMap = new Map()
        let objects = that.inspection.objects || []
        if (Check.isRealArray(objects)) {
          objects.map(c => { gMap.set(c.groupId, c) })
        }

        let group = that.inspection.group
        if (group && gMap.get(group.groupId)) {
          let objs = objects.map(v => {
            if (v.groupId === group.groupId) {
              v = group
            }
            return v
          })
          that.setInspection({ objects: objs })
        } else if (group) {
          that.setInspection({ objects: [...objects, group] })
        }
        group && gMap.set(group.groupId, group)

        GroupApi.getSchoolGroups(that.currentGroup.groupId).then(res => {
          let cMap = new Map()
          res.groups.map(g => {
            g = gMap.get(g.groupId) ? gMap.get(g.groupId) : { ...g, remark: '', members: [], total: 0 }
            if (g.cId) {
              let campus = cMap.get(g.campusId)
              if (campus) {
                campus.classes.push(g)
                cMap.set(g.campusId, campus)
              } else {
                cMap.set(g.campusId, { id: g.campusId, name: g.campus, classes: [g] })
              }
            } else {
              that.groups.push(g)
            }
          })
          cMap.forEach((v, k, i) => {
            that.campuses.push(v)
          })
        })
      },
      handleSubmit() {
        const that = this
        let users = that.inspection.users
        let us = []
        that.groups.map(v => {
          if (Check.isRealArray(v.members)) { us.push(...v.members) }
        })
        that.campuses.map(v => {
          v.classes.map(c => {
            if (Check.isRealArray(c.members)) { us.push(...c.members) }
          })
        })

        if (!Check.isRealArray(us)) {
          that.$message({ message: '请选择群组/班级成员', type: 'warning' })
          return false
        }

        if (Check.isRealArray(users)) {
          us = [...users, ...us]
        }
        that.setInspection({ users: us, objects: [], group: null })
        that.routeBack()
      },
      handleGroup(item) {
        this.setInspection({ group: item })
        this.routePush({ name: 'selectMember1216' })
      }
    }
  }

</script>
