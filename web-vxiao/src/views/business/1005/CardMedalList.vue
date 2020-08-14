<template>
  <Dialogs :visible.sync="visible" ref="_dialog_list" v-on:close="handleClose">
    <DialogPage title="">
      <div class="card-medal-list">
        <Medal1 v-for="(medal,i) in medals" :key="i" :medal="medal"></Medal1>
      </div>
    </DialogPage>
  </Dialogs>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    medals: { type: [Array] }
  },
  data() {
    return {
      visible: this.show
    }
  },
  components: {
    Medal1: resolve => require(['@/views/components/medal/Medal1'], resolve)
  },
  computed: {},
  methods: {
    handleClose() {
      this.$emit('update:show', false)
    }
  },
  watch: {
    show(val) {
      this.visible = val
    }
  }
}

</script>
<style lang="scss">
@import "~scss/_mixin";
.card-medal-list {
  padding-bottom: rem(20);
  .medal-01 {
    float: none;
    margin: rem(10) auto 0;
  }
}

</style>
