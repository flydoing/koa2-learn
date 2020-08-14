<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        closePrompt
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
        return this.attendance.node ? '编辑' : '新建'
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
        let tableType = that.attendance.tableType

        if (Check.isNullString(that.node.name)) {
          that.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }

        let postData = null
        if (tableType === '1') {
          postData = {
            schoolId: that.currentGroup.parentId,
            customerAttendances: [
              node
                ? {
                    ...node,
                    attendanceName: that.node.name
                  }
                : {
                    attendanceName: that.node.name,
                    attendanceType: '1',
                    startTime: sTime,
                    endTime: eTime,
                    restrictedPlace: false
                  }
            ]
          }
        } else if (tableType === '4') {
          postData = {
            schoolId: that.currentGroup.parentId,
            dormitoryAttendances: [
              node
                ? {
                    ...node,
                    attendanceName: that.node.name
                  }
                : {
                    attendanceName: that.node.name,
                    attendanceType: '4',
                    startTime: sTime,
                    endTime: eTime,
                    restrictedPlace: false
                  }
            ]
          }
        } else if (tableType === '2') {
          postData = {
            schoolId: that.currentGroup.parentId,
            inOrOutAttendances: [
              node
                ? {
                    ...node,
                    attendanceName: that.node.name,
                    sendMsg: true
                  }
                : {
                    attendanceName: that.node.name,
                    attendanceType: '3',
                    startTime: sTime,
                    endTime: eTime,
                    sendMsg: true
                  }
            ]
          }
        } else {
          postData = {
            schoolId: that.currentGroup.parentId,
            dutyAttendances: [
              node
                ? {
                    ...node,
                    attendanceName: that.node.name
                  }
                : {
                    attendanceName: that.node.name,
                    attendanceType: '5',
                    startTime: sTime,
                    endTime: eTime,
                    restrictedPlace: false
                  }
            ]
          }
        }
        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
