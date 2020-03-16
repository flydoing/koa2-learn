<template>
  <div class="jc-toast">
    <transition name="mint-toast-pop">
      <div class="mint-toast" v-show="visible" :class="customClass" :style="{ 'padding': iconClass === '' ? '10px' : '20px' }">
        <!-- <i class="mint-toast-icon" :class="iconClass" v-if="iconClass !== ''"></i> -->
        <!-- <i class="mint-toast-icon" :class="iconClass" ></i> -->
        <svg v-if="iconClass !== ''" :class="iconClass" class="icon user-logo" aria-hidden="true"><use :xlink:href="`#${iconClass}`" /></svg>
        <span class="mint-toast-text" :style="{ 'padding-top': iconClass === '' ? '0' : '10px' }">{{ message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'toast',
  head: {
    link: [],
    script: [
      // { src: '//at.alicdn.com/t/font_1691530_i4id929hxk.js', async: true, defer: true }
      { src: '//at.alicdn.com/t/font_1691530_h4rsuyy1kx.js', async: true, defer: true }
    ]
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    },
    iconClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // visible: false
    };
  },
  computed: {
    customClass() {
      var classes = [];
      switch (this.position) {
        case 'top':
          classes.push('is-placetop');
          break;
        case 'bottom':
          classes.push('is-placebottom');
          break;
        default:
          classes.push('is-placemiddle');
      }
      classes.push(this.className);
      return classes.join(' ');
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.user-logo{
  width: 125px;
  height: 50px;
  color: #de3d96;
}
.jc-toast{
  text-align: center;
}
.mint-toast {
    position: fixed;
    max-width: 80%;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;
    -webkit-transition: opacity .3s linear;
    transition: opacity .3s linear
}
.mint-toast.is-placebottom {
    bottom: 50px;
    left: 50%;
    -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0)
}
.mint-toast.is-placemiddle {
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%)
}
.mint-toast.is-placetop {
    top: 50px;
    left: 50%;
    -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0)
}
.mint-toast-icon {
    display: block;
    text-align: center;
    font-size: 56px
}
.mint-toast-text {
    font-size: 14px;
    display: block;
    text-align: center
}
.mint-toast-pop-enter, .mint-toast-pop-leave-active {
    opacity: 0
}
</style>
