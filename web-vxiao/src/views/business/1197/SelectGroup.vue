<template>
  <page title="选择考勤对象"
        @submit="handleSubmit"
        hasSubmit>
    <item className="vx-item-show"
          v-for="(item, i) in groups"
          :key="i"
          :item="item"
          @click="handleItem(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.active}"></i>
      </div>
      <div slot="main"
           class="vx-item-text"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="item.remark"></div>
    </item>
    <div v-for="(item,i) in campuses"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item class="vx-item-show"
            v-for="(grade,j) in item.grades"
            :key="j"
            :hasArrow="false"
            @click="handleItem(grade)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':grade.active}"></i>
        </div>
        <div slot="main"
             class="vx-item-text"
             v-html="grade.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
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
        attendance: 'getAttendance'
      })
    },
    methods: {
      ...mapActions(['getAttendance']),
      fetchData() {
        const that = this

        let gMap = new Map()
        let groupMap = that.attendance.node.groupMap
        if (groupMap) {
          for (let g in groupMap) {
            gMap.set(g, g)
          }
        }

        Api.getAttendanceObjects(that.currentGroup.parentId).then(res => {
          let d = res.notifyGradeMap
          that.groups = d.departments.map(v => {
            gMap.get(v.groupId) ? (v.active = true) : (v.active = false)
            return v
          })
          that.campuses = d.campuses.map(v => {
            v.grades = v.grades.map(g => {
              gMap.get(g.groupId) ? (g.active = true) : (g.active = false)
              return g
            })
            return v
          })
        })
      },
      handleSubmit() {
        const that = this
        let groups = that.groups.filter(v => {
          return v.active
        })

        let grades = []
        that.campuses.map(v => {
          v.grades.map(g => {
            g.active && grades.push(g)
          })
        })

        let gs = [...grades, ...groups]
        if (!Check.isRealArray(gs)) {
          that.$message({ message: '请选择考勤对象', type: 'warning' })
          return false
        }

        let postData = { schoolId: that.currentGroup.parentId }
        let node = {
          ...that.attendance.node,
          attendanceGroup: gs.map(g => {
            return g.groupId
          })
        }
        that.attendance.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])
        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleItem(item) {
        item.active = !item.active
      }
    }
  }
</script>
