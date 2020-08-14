<template>
  <Overlay :show.sync="visible" :width="400" :height="150" @close="handle">
    <div class="inspection-select-time">
      <el-time-picker v-model="time" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="选择时间" format="HH:mm" value-format="HH:mm" @change="handleConfirm">
      </el-time-picker>
    </div>
  </Overlay>
</template>
<script>
import DateUtils from '@/utils/date'
export default {
  props: {
    show: { type: Boolean, default: false },
    sTime: { type: String }
  },
  data() {
    return {
      visible: this.show,
      time: ''
    }
  },
  created() {
    this.fetchData()
  },
  components: {},
  computed: {},
  methods: {
    fetchData() {
      if (this.sTime) {
        let date = DateUtils.format(new Date(), DateUtils.YMD)
        this.time = new Date(DateUtils.format(`${date} ${this.sTime}`, DateUtils.YMD_HM))
      }
    },
    handle() {
      this.$emit('update:show', false)
    },
    handleConfirm(time) {
      this.$emit('confirm', time)
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
@import "~scss/_mixin";
.inspection-select-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

</style>
