<template>
  <div class="overlay vx-dialog-panel"
       v-show="visible"
       ref="_dialog_list"
       v-on:close="close">
    <!-- v-drag="{targetClass:'vx-dialog-title'}" -->
    <div class="vx-dialogs"
         :style="style">
      <div class="vx-dialogs-body"
           :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  import Drag from '@/directives/drag'
  export default {
    directives: { Drag },
    name: 'DialogList',
    props: {
      value: { type: [String, Number] },
      visible: { type: Boolean, default: false },
      width: { type: [String, Number], default: 450 },
      height: { type: [String, Number], default: (window.innerHeight / 3) * 2 }
    },
    data() {
      return {
        prefixCls: '',
        navList: [],
        activeKey: this.value
      }
    },
    computed: {
      style() {
        return {
          width: `${this.innerWidth}px`,
          height: `${this.innerHeight}px`
        }
        // const top = (this.innerHeight - this.height) / 2
        // const left = (this.innerWidth - this.width) / 2
        // return {
        //   width: `${this.width}px`,
        //   height: `${this.height}px`,
        //   top: `${top}px`,
        //   left: `${left}px`
        // }
      },
      contentStyle() {
        const x = this.navList.findIndex(nav => nav.name === this.activeKey)
        const p = x * this.innerWidth * -1
        return {
          transform: `translate3d(${p}px, 0px, 0px)`
        }
      }
    },
    methods: {
      return() {
        const x = this.navList.findIndex(nav => nav.name === this.activeKey)
        if (x === 0) {
          this.close()
        } else if (x >= 1) {
          this.showDialog(this.navList[x - 1].name)
        }
      },
      close() {
        this.$emit('close')
        this.$emit('update:visible', false)
      },
      getDialog() {
        return this.$children.filter(item => item.$options.name === 'DialogPage')
      },
      updataDialog() {
        const that = this
        this.navList = []
        this.getDialog().forEach((dialog, index) => {
          this.navList.push({
            name: dialog.currentName || index
          })
          dialog.width = that.width || 450
          dialog.height = that.height || (this.innerHeight / 3) * 2
          if (!dialog.currentName) {
            dialog.currentName = index
          }
          if (index === 0 && !this.activeKey) {
            this.activeKey = dialog.currentName || index
          }
        })
      },
      showDialog(key) {
        const that = this
        this.navList.forEach((nav, i) => {
          if (nav.name === key) {
            that.activeKey = nav.name
          }
        })
      }
    },
    mounted() {
      document.body.appendChild(this.$el)
    }
  }
</script>
<style lang="scss">
  .vx-dialog-panel {
    z-index: 99999;
  }

  .vx-dialogs {
    overflow: hidden;
    position: relative;
    border-radius: rem(3);
    .vx-dialogs-body {
      transition-duration: 0.5s;
      @include prefixer(box-sizing, content-box);
      @include prefixer(transition-property, transform);
      @include prefixer(transform, translate3d(0, 0, 0));
      @include flex;
      display: -moz-box;
      display: -ms-flexbox;
      width: 100%;
      height: 100%;
    }
    .vx-dialog-container {
      margin-right: rem(5);
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
      -ms-flex: 0 0 auto;
      position: relative;
      width: 100%;
      height: 100%;
      @include ct;
    }
  }
</style>
