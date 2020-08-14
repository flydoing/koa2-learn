<template>
  <div class="vx-tab-content"
       :class="prefixCls">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'TabPane',
    props: {
      name: { type: [String, Number] },
      label: { type: [String, Function], default: '' },
      icon: { type: String },
      currentData: { type: [String, Number, Object] },
      disabled: { type: Boolean, default: false },
      closable: { type: Boolean, default: null },
      badge: { type: [String, Boolean], default: false }
    },
    data() {
      return {
        prefixCls: '',
        bindData: this.currentData,
        currentName: this.name
      }
    },
    methods: {
      updateNav() {
        this.$parent.updateNav && this.$parent.updateNav()
      }
    },
    watch: {
      currentData(d) {
        this.bindData = d
        this.updateNav()
      },
      name(val) {
        this.currentName = val
        this.updateNav()
      },
      label() {
        this.updateNav()
      },
      icon() {
        this.updateNav()
      },
      disabled() {
        this.updateNav()
      },
      badge() {
        this.updateNav()
      }
    },
    mounted() {
      this.updateNav()
    },
    destroyed() {
      this.updateNav()
    }
  }
</script>
