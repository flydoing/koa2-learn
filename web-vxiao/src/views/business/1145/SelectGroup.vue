<template>
  <page title="选择群组/班级" @submit="handleSubmit" hasSubmit>
    <div v-if="groups.length>0" class="category-title text">群组</div>
    <item v-for="(item, i) in groups" :key="i" :item="item" @click="handleGroup(item)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="item.remark"></div>
    </item>
    <div v-if="classes.length>0" class="category-title text">班级</div>
    <item v-for="(item, i) in classes" :key="i" :item="item" @click="handleGroup(item)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="item.remark"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import GroupApi from '@/api/group'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      groups: [],
      classes: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      onDuty: 'getOnDuty'
    })
  },
  methods: {
    ...mapActions(['setOnDuty']),
    fetchData() {
      const that = this

      let gMap = new Map()
      let objects = that.onDuty.objects || []
      if (Check.isRealArray(objects)) {
        objects.map(c => { gMap.set(c.groupId, c) })
      }

      let group = that.onDuty.group
      if (group && gMap.get(group.groupId)) {
        let objs = objects.map(v => {
          if (v.groupId === group.groupId) {
            v = group
          }
          return v
        })
        that.setOnDuty({ objects: objs })
      } else if (group) {
        that.setOnDuty({ objects: [...objects, group] })
      }
      group && gMap.set(group.groupId, group)

      GroupApi.getSchoolAllGroups(that.currentGroup.parentId).then(res => {
        that.groups = res.groups.map(g => {
          g = gMap.get(g.groupId) ? gMap.get(g.groupId) : {
            ...g,
            remark: '',
            members: []
          }
          return g
        })
        that.classes = res.classes.map(g => {
          g = gMap.get(g.groupId) ? gMap.get(g.groupId) : {
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
      let item = that.onDuty.dutyItem
      let type = that.onDuty.type
      let isOddWeek = that.onDuty.isOddWeek

      let datas = []
      if (Check.isRealArray(that.onDuty.objects)) {
        datas = [...that.onDuty.objects].filter(v => { return Check.isRealArray(v.members) })
      }
      if (!Check.isRealArray(datas)) {
        that.$message({ message: '请选择群组/班级成员', type: 'warning' })
        return false
      }

      let users = []
      datas.map(v => {
        v.members.map(m => {
          let user = {
            userId: m.userId,
            itemId: item.id,
            status: '1',
            extension: item.gradeType === '1' ? '1' : '2'
          }
          item.gradeType === '1' ? (user.groupId = item.groupId) : (user.rangeId = item.gradeId)
          isOddWeek && (user.isOddWeeks = type.value)
          users.push(user)
        })
      })

      Api.commitOnDutyMembers(users).then(res => {
        let us = res.dutyUsers.map(v => {
          v.avatar = this.url(v.avatar)
          return v
        })
        that.setOnDuty({ users: us })
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    },
    handleGroup(item) {
      this.setOnDuty({ group: item })
      this.routePush({ name: 'selectMember1145' })
    }
  }
}

</script>
