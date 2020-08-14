<template>
  <Overlay :show.sync="visible"
           :width="300"
           :height="100"
           @close="handle">
    <div class="attend-select-date">
      <el-date-picker v-model="value"
                      prefix-icon="x"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :clearable="false"
                      @change="handleConfirm"></el-date-picker>
    </div>
  </Overlay>
</template>
<script>
  export default {
    props: {
      show: { type: Boolean, default: false },
      date: { type: String }
    },
    data() {
      return {
        visible: this.show,
        value: this.date
      }
    },
    created() {},
    components: {},
    computed: {},
    methods: {
      handle() {
        this.$emit('update:show', false)
      },
      handleConfirm(date) {
        this.$emit('confirm', date)
      }
    },
    watch: {
      show(val) {
        this.visible = val
      },
      date(val) {
        this.value = val
      }
    }
  }
</script>
<style lang="scss">
  .attend-select-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    .el-input input {
      text-align: center !important;
    }
  }
</style>
