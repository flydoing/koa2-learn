<template>
  <Overlay :show.sync="visible" :width="w - 40" :height="h - 40" @close="handle">
    <div class="scanning-panel" @click="handle">
      <div v-for="(item, i) in list" :key="i" class="sp-block" :class="item.class" @mouseover="handleOver" @mouseout="handleOut">
        <div class="sp-container">
          <div class="sp-image">
            <img v-lazy="{src:item.imgSrc}" :style="itemStyle"/>
          </div>
            <div class="left-btn" @click.stop="handleLeft"></div>
            <div class="right-btn" @click.stop="handleRight"></div>
            <div class="sp-bottom">
              <div class="btm-title" v-html="item.title"></div>
              <div v-if="item.content" class="btm-content" v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div>
  </Overlay>
</template>
<script>
  import Check from '@/utils/check'
  export default {
    props: {
      show: { type: Boolean, default: false },
      messages: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        visible: this.show,
        ms: this.messages,
        list: [],
        index: 0,
        styles: ['rotate-scale', 'slide-in-up', 'fade-in', 'slide-in-right'],
        timer: null
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    computed: {
      itemStyle() {
        return {
          maxWidth: `${this.w - 56}px`,
          maxHeight: `${this.h - 56}px`
        }
      }
    },
    methods: {
      fetchData() {
        let list = []
        this.ms.map(v => {
          if (Check.isRealArray(v.medias)) {
            let title = v.fromUserName
            if (v.msgJson) {
              let mJson = JSON.parse(v.msgJson)
              title = `${title} ${mJson.className} ${mJson.campusName}`
            }
            v.medias.map(m => {
              list.push({
                imgSrc: this.url(m.fileId),
                title: title,
                content: v.content,
                class: {
                  active: false
                }
              })
            })
          }
        })
        this.list = list
        this.animate()
        this.setTimer()
      },
      animate() {
        let list = []
        this.list.forEach((v, i) => {
          if (this.index !== i) {
            this.$set(this.list[this.index], 'class', { active: false })
            list.push({ ...v, class: { active: false } })
          } else {
            let cls = { active: true }
            let value = Math.floor(Math.random() * (4 - 0)) + 0
            cls[this.styles[value]] = true
            list.push({ ...v, class: cls })
          }
        })
        this.list = list
      },
      setTimer() {
        if (!this.visible) {
          this.timer && clearInterval(this.timer)
          this.timer = null
          return false
        }

        if (this.list.length > 1) {
          this.timer = setInterval(() => {
            this.index === this.list.length - 1 ? (this.index = 0) : (this.index++)
            this.animate()
          }, this.list.length > 15 ? 3000 : 10000)
        }
      },
      handle() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        this.$emit('update:show', false)
      },
      handleOver() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      },
      handleOut() {
        this.setTimer()
      },
      handleLeft() {
        this.index === 0 ? (this.index = this.list.length - 1) : (this.index--)
        this.animate()
      },
      handleRight() {
        this.index === this.list.length - 1 ? (this.index = 0) : (this.index++)
        this.animate()
      }
    },
    watch: {
      show(val) {
        this.visible = val
        this.fetchData()
      },
      messages(val) {
        this.ms = val
        this.fetchData()
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";

  .scanning-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .sp-block {
      background: #FFF;
      border-radius: rem(5);
      position: relative;
      padding: rem(8);
      display: none;

      &:first-child .left-btn {
        display: none;
      }

      &:last-child .right-btn {
        display: none;
      }

      &.active {
        display: block;
      }

      .sp-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        min-width: rem(500);
        min-height: rem(500);
      }

      .left-btn,
      .right-btn {
        position: absolute;
        top: 0;
        height: 100%;
        bottom: 0;
        width: rem(80);
        z-index: 1;
        cursor: pointer;
      }

      .left-btn {
        left: 0;
        background: url(/static/ico/left_btn.png) no-repeat center center;
      }

      .right-btn {
        right: 0;
        background: url(/static/ico/right_btn.png) no-repeat center center;
      }

      &.active.rotate-scale {
        animation: rotateScale 1s ease-out;
      }

      &.active.slide-in-up {
        animation: slideInUp .8s ease-out;
      }

      &.active.fade-in {
        animation: fade-in .8s ease-out;
      }

      &.active.slide-in-right {
        animation: slideInRight .8s ease-out;
      }
    }

    .sp-image img {
      display: block;
      margin: 0 auto;
    }

    .sp-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, .5);
      width: 100%;
      color: #FFFFFF;
      left: 0;
    }

    .sp-bottom div {
      padding: rem(10) rem(16);
      line-height: rem(22);
    }

    .sp-bottom .btm-content {
      padding-top: 0 !important;
    }

    .sp-bottom .btm-title {
      padding-bottom: 0 !important;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0);
      opacity: 0.0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0)
    }
  }

  @keyframes rotateFall {
    0% {
      transform: rotateZ(0deg);
    }

    20% {
      transform: rotateZ(10deg);
      animation-timing-function: ease-out;
    }

    40% {
      transform: rotateZ(17deg);
    }

    60% {
      transform: rotateZ(16deg);
    }

    100% {
      transform: translateY(100%) rotateZ(17deg);
    }
  }

  @keyframes slideOutLeft {
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes rotateScale {
    from {
      transform: rotate(0deg) scale(0);
    }

    to {
      transform: rotate(360deg) scale(1);
    }
  }

  @keyframes scaleUp {
    from {
      opacity: 0.3;
      -webkit-transform: scale(0.1);
    }
  }

</style>
