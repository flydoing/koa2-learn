<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item className="vx-item-show"
          :hasClick="false">
      <div slot="main">
        <input placeholder="名称"
               v-model="node.name" />
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        node: {
          name: ''
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      }),
      title() {
        return this.attendance.node ? '编辑节次' : '新建节次'
      }
    },
    methods: {
      ...mapActions(['setAttendance']),
      fectchData() {
        let node = this.attendance.node
        if (node) {
          this.node = node
          this.node.name = node.attendanceName
        }
      },
      handleSubmit() {
        const that = this
        let sTime = that.attendance.sTime
        let eTime = that.attendance.eTime
        let node = that.attendance.node

        if (Check.isNullString(that.node.name)) {
          that.$message({ message: '节次名称不能为空', type: 'warning' })
          return false
        }

        let postData = null
        if (node) {
          postData = { ...node, attendanceName: that.node.name }
        } else {
          postData = {
            attendanceName: that.node.name,
            attendanceType: '1',
            startTime: sTime,
            endTime: eTime,
            restrictedPlace: false,
            normalNotify: {
              headTeacher: false,
              sectionTeacher: false,
              studentParent: false
            },
            abnormalNotify: {
              headTeacher: false,
              sectionTeacher: false,
              student: false,
              studentParent: false,
              appManager: false
            }
          }
        }

        Api.commitTimeNode({ schoolId: that.currentGroup.parentId, customerAttendances: [postData] }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
