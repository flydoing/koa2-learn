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
            @click="handleGrade(grade,i,j)">
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
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

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
        let tableType = that.attendance.tableType
        let gMap = new Map()
        let groupMap = that.attendance.node.groupMap
        if (groupMap) {
          for (let g in groupMap) {
            gMap.set(g, { groupId: g })
          }
        }
        if (tableType !== '4') {
          Api.getAttendanceObjects(that.currentGroup.parentId).then(res => {
            let d = res.notifyGradeMap
            that.groups = d.departments.map(v => {
              v.active = Check.isObject(gMap.get(v.groupId))
              return v
            })
            that.campuses = d.campuses.map(v => {
              v.grades = v.grades.map(g => {
                g.active = Check.isObject(gMap.get(g.groupId))
                return g
              })
              return v
            })
          })
        } else {
          that.groups.push({
            name: '宿舍考勤',
            groupId: 'DORMITORY',
            active: Check.isObject(gMap.get('DORMITORY'))
          })
        }
      },
      handleSubmit() {
        const that = this
        let groups = that.groups.filter(v => {
          return v.active
        })
        let tableType = that.attendance.tableType

        let grades = []
        that.campuses.map(v => {
          v.grades.map(g => {
            g.active && grades.push(g)
          })
        })

        let gs = [...grades, ...groups]
        let postData = { schoolId: that.currentGroup.parentId }
        let node = {
          ...that.attendance.node,
          attendanceGroup:
            gs.length > 0
              ? gs.map(g => {
                  return g.groupId
                })
              : []
        }
        if (tableType === '1') {
          that.attendance.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])
        } else if (tableType === '4') {
          postData.dormitoryAttendances = [node]
        } else if (tableType === '3') {
          postData.dutyAttendances = [node]
        } else {
          postData.inOrOutAttendances = [node]
        }
        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleItem(item) {
        item.active = !item.active
      },
      handleGrade(item, i, j) {
        item.active = !item.active
        this.$set(this.campuses[i].grades, j, item)
      }
    }
  }
</script>
