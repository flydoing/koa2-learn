<template>
  <page title="自定义"
        @submit="handleSubmit"
        hasSubmit>
    <div class="modify-deadline">
      <item :hasClick="false"
            label="当前时间截止至">
        <div slot="after">
          <el-date-picker v-model="deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import ApiUser from '@/api/user'

  export default {
    components: {},
    data() {
      return {
        deadline: ''
      }
    },
    methods: {
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.deadline)) {
          that.$message({ message: '时间不能为空', type: 'warning' })
          return false
        }
        let time = new Date(that.deadline).getTime() - new Date().getTime()
        let days = Math.floor(time / (24 * 3600 * 1000))
        let hours = Math.floor((time % (24 * 3600 * 1000)) / (3600 * 1000))
        if (days > 0) {
          hours += days * 24
        }
        ApiUser.modifyUser({
          id: this.USER.id,
          userState: {
            state: this.routeQuery('state'),
            duration: (hours / 0.5) * 30
          }
        }).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.setStorage('_state_refresh', true)
          this.routeBack()
        })
      }
    }
  }
</script>
