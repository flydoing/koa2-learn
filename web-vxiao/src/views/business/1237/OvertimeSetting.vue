<template>
  <Page title="加班设置"
        hasSubmit
        @submit="handleSubmit">
    <item label="工作日加班"
          :hasClick="false">
      <el-time-picker slot="remark"
                      prefix-icon="x"
                      :clearable="false"
                      v-model="workTime"
                      value-format="HH:mm"
                      format="HH:mm"
                      placeholder="输入时间"></el-time-picker>
      <div slot="after">后</div>
    </item>
    <item class="week-time"
          label="周末加班"
          :hasClick="false">
      <div slot="remark">上班时长超过<input class="min-input"
               v-model="minutes"
               placeholder="输入时长" />分钟</div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        workTime: '',
        minutes: ''
      }
    },
    computed: {},
    created() {
      Api.getOvertimeSetting(this.schoolId).then(res => {
        if (res.data) {
          this.workTime = res.data.workdayOver
          this.minutes = res.data.weekendOver
        }
      })
    },
    methods: {
      handleSubmit() {
        if (Check.isNullString(this.workTime)) {
          this.$message({ message: '时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.minutes)) {
          this.$message({ message: '上班时长不能为空', type: 'warning' })
          return false
        }
        Api.saveOvertimeSetting({
          workAttendanceNotifyExt: {
            attendanceType: '5',
            schoolId: this.schoolId,
            workdayOver: this.workTime,
            weekendOver: this.minutes
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .week-time.vx-item {
    .min-input {
      width: rem(70);
      text-align: center !important;
    }
  }
</style>
