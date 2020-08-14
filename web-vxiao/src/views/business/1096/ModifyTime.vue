<template>
  <page title="延期">
    <item :hasClick="false">
      <div slot="main">延期至</div>
      <div slot="after">
        <el-date-picker v-model="time"
                        prefix-icon="x"
                        :clearable="false"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="MM-dd HH:mm"
                        format="MM-dd HH:mm"></el-date-picker>
      </div>
    </item>
    <div class="pd remark-txt">已录取的学生不会受影响，未录取的学生可以继续申报或改选</div>
    <div class="button button-common"
         @click="handleConfirm">确定</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        time: ''
      }
    },
    computed: {},
    created() {},
    methods: {
      handleConfirm() {
        let pId = this.routeQuery('pId')
        let date = new Date()
        Api.modifyTime({ id: pId, endTime: DateUtils.format_0800(`${date.getFullYear()}-${this.time}`) }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .remark-txt {
    margin-top: rem(10);
    color: #999;
  }
</style>
