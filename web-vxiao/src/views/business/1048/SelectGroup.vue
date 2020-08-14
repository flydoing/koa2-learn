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
      commend: 'getCommend'
    })
  },
  methods: {
    ...mapActions(['setCommend']),
    fetchData() {
      const that = this

      let gMap = new Map()
      let objects = that.commend.cmdn.objects || []
      if (Check.isRealArray(objects)) {
        objects.map(c => { gMap.set(c.groupId, c) })
      }

      let users = that.commend.users
      let group = that.commend.group
      if (group && Check.isRealArray(users)) {
        let g = {
          ...group,
          remark: users.length ? `${users.length}位成员` : '',
          total: that.commend.total,
          members: users
        }
        if (gMap.get(group.groupId)) {
          let objs = objects.map(v => {
            if (v.groupId === group.groupId) {
              v = g
            }
            return v
          })
          that.setCommend({ cmdn: { ...that.commend.cmdn, objects: objs, users: [] } })
        } else {
          that.setCommend({ cmdn: { ...that.commend.cmdn, objects: [...objects, g], users: [] } })
        }
        gMap.set(group.groupId, g)
      }

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

      let gs = []
      that.groups.map(v => {
        if (Check.isRealArray(v.members)) { gs.push(v) }
      })
      that.campuses.map(v => {
        v.classes.map(c => {
          if (Check.isRealArray(c.members)) { gs.push(c) }
        })
      })

      if (!Check.isRealArray(gs)) {
        that.$message({ message: '请选择表彰对象', type: 'warning' })
        return false
      }

      that.setCommend({ cmdn: { ...that.commend.cmdn, objects: gs } })
      that.routeBack()
    },
    handleGroup(item) {
      this.setCommend({ group: item, users: item.members })
      let query = { groupId: item.groupId }
      item.type !== '1' && (query.type = '2_4')
      this.routePush({ name: 'selectMember1048', query: query })
    }
  }
}

</script>
