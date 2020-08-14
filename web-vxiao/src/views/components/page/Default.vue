<template>
  <div class="vx-model-menu">
    <div class="vx-model-left"
         v-if="$slots.left">
      <scroller :height="sh">
        <slot name="left"></slot>
      </scroller>
    </div>
    <div class="vx-model-center">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      sh() {
        return this.innerHeight - 125 - 40
      }
    }
  }
</script>
