<template>
  <Setup>
    <template slot="others"
              v-if="isOrg">
      <item @click="periodicSetting"
            label="周期播放">
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      periodicSetting() {
        this.routePush({ name: 'periodicSetting1228' })
      }
    }
  }
</script>
