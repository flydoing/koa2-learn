<template>
  <transition name="modal">
    <div v-transfer-dom
         data-transfer="true">
      <div class="overlay"
           :style="styleObj"
           @click="handle">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
  import TransferDom from '@/directives/transfer-dom'
  export default {
    name: 'overlay',
    directives: { TransferDom },
    props: {
      styleObj: {
        type: Object,
        default() {
          return {
            background: 'rgba(0,0,0,.3)'
          }
        }
      }
    },
    methods: {
      handle() {
        this.$emit('click')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .overlay {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include ct;
    transition: opacity 0.8s ease;
    background-color: rgba(0, 0, 0, 0.5);
    &.modal-enter {
      opacity: 0;
    }
    &.modal-leave-active {
      opacity: 0;
    }
  }
</style>
