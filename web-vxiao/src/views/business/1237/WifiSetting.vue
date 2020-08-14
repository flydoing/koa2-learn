<template>
  <Page title="WIFI考勤"
        @scrollEnd="scrollEnd"
        hasAdd
        @add="handleAdd">
    <item v-for="(item, i) in list"
          :key="i"
          :hasClick="false">
      <div slot="main">
        <div v-html="item.wifiName"></div>
        <div v-html="item.wifiAddr"></div>
      </div>
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    created() {
      if (this.attendance.wifi) {
        this.deleteAttendanceProp('wifi')
      }
      Api.getWifiList(this.groupId).then(res => {
        this.list = res.workAttendanceWifis || []
      })
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      handleItem(item) {
        this.setAttendance({ wifi: item })
        this.routePush({ name: 'wifiEdit1237' })
      },
      handleAdd() {
        this.routePush({ name: 'wifiEdit1237' })
      },
      handleRemove(item, i) {
        this.$confirm('确定删除该WIFI？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.saveWifiInfo(this.groupId, {
            workAttendanceWifi: {
              id: item.id,
              method: 'delete'
            }
          }).then(res => {
            if (res.workAttendanceWifi) {
              this.$message({ message: '操作成功', type: 'success' })
              this.list.splice(i, 1)
            }
          })
        })
      }
    }
  }
</script>
