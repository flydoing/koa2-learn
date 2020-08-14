<template>
  <Page title="WIFI考勤"
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false"
          label="名称">
      <input slot="remark"
             v-model="form.wifiName"
             placeholder="必填" />
    </item>
    <item :hasClick="false"
          label="MAC地址">
      <input slot="remark"
             v-model="form.wifiAddr"
             placeholder="必填" />
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          wifiName: '',
          wifiAddr: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    created() {
      if (this.attendance.wifi) {
        this.form = { ...this.attendance.wifi }
      }
    },
    methods: {
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.wifiName)) {
          this.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.wifiAddr)) {
          this.$message({ message: 'MAC地址不能为空', type: 'warning' })
          return false
        }

        Api.saveWifiInfo(this.groupId, {
          workAttendanceWifi: {
            ...this.form,
            groupId: this.groupId
          }
        }).then(res => {
          if (res.workAttendanceWifi) {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          }
        })
      }
    }
  }
</script>
