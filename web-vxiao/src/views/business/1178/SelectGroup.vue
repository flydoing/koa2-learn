<template>
  <page :title="title" @submit="handleSubmit" hasSubmit>
    <item :hasClick="false">
      <div slot="main">共选择{{total}}人</div>
    </item>
    <div class="category-title text" v-html="remarkTxt"></div>
    <item v-for="(item, i) in list" :key="i" @click="handleGroup(item)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="itemTxt(item)"></div>
    </item>
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
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getTeacherAppraisal'
    }),
    title() {
      let range = this.appraisal.range
      return range ? `选择${range.name}评估人` : ''
    },
    total() {
      let total = 0
      this.list.map(v => {
        total += v.members.length
      })
      return total
    },
    remarkTxt() {
      return this.appraisal.range ? this.appraisal.range.name : ''
    }
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    fetchData() {
      const that = this

      let gMap = new Map()
      let objects = that.appraisal.objects || []
      if (Check.isRealArray(objects)) {
        objects.map(c => { gMap.set(c.groupId, c) })
      }

      let users = that.appraisal.users
      let group = that.appraisal.group
      if (group && users) {
        let g = {
          ...group,
          remark: users.length ? `${users.length}位成员` : '',
          members: users
        }
        if (gMap.get(group.groupId)) {
          let objs = objects.map(v => {
            if (v.groupId === group.groupId) {
              v = g
            }
            return v
          })
          that.setTeacherAppraisal({ objects: objs, users: [], group: null })
        } else {
          that.setTeacherAppraisal({ objects: [...objects, g], users: [], group: null })
        }
        gMap.set(group.groupId, g)
      }

      GroupApi.getSchoolGroupsByType(that.currentGroup.parentId, '1').then(res => {
        that.list = res.groups.map(g => {
          g = gMap.get(g.groupId) ? gMap.get(g.groupId) : { ...g, remark: '', members: [], total: 0 }
          return g
        })
      })
    },
    itemTxt(item) {
      return item.members.length > 0 ? `${item.members.length}人` : ''
    },
    handleSubmit() {
      const that = this

      let gs = []
      that.list.map(v => {
        if (Check.isRealArray(v.members)) { gs.push(v) }
      })

      that.setTeacherAppraisal({ objects: gs, total: that.total })
      that.routeBack()
    },
    handleGroup(item) {
      this.setTeacherAppraisal({ group: item, users: item.members })
      let query = { groupId: item.groupId }
      item.type !== '1' && (query.type = '4')
      this.routePush({ name: 'selectMember1178', query: query })
    }
  }
}

</script>
