<template>
  <Overlay :show.sync="visible"
           :span="3"
           @close="handle">
    <div class="attend-select-time">
      <el-date-picker type="datetimerange"
                      v-model="times"
                      range-separator="至"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="handleConfirm"></el-date-picker>
    </div>
  </Overlay>
</template>
<script>
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'
  export default {
    props: {
      show: { type: Boolean, default: false },
      startTime: { type: String },
      endTime: { type: String }
    },
    data() {
      return {
        visible: this.show,
        times: []
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    computed: {},
    methods: {
      fetchData() {
        if (!Check.isNullString(this.startTime) && !Check.isNullString(this.endTime)) {
          let sTime = new Date(DateUtils.format(this.startTime, DateUtils.YMD_HM))
          let eTime = new Date(DateUtils.format(this.endTime, DateUtils.YMD_HM))
          this.times = [sTime, eTime]
        }
      },
      handle() {
        this.$emit('close')
      },
      handleConfirm(times) {
        this.$emit('confirm', times)
      }
    },
    watch: {
      show(val) {
        this.visible = val
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss">
  .attend-select-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
