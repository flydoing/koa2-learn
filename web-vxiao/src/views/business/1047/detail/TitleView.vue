<template>
  <div class="titleview">{{serial !== null ? serial+1 +'、' : ''}}
    <span v-if="title" v-html="title"></span>
  </div>
</template>
<script>
  export default {
    props: {
      serial: {
        type: Number,
        default: null
      },
      title: {
        type: String,
        default: ''
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .titleview {
    @include flex;
    padding-left: rem(10);
    padding: rem(10) 0;
    span {
      border: none !important;
    }
    table {
      display: none;
    }
  }

</style>
