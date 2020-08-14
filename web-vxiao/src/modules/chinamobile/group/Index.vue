<template>
  <div class="vx-space">
    <div class="vx-main">
      <keep-alive>
        <GroupMain />
      </keep-alive>
    </div>
    <ModelPage :show="openPage" />
  </div>
</template>
<script>
  export default {
    components: {
      GroupMain: resolve => require(['./Main'], resolve)
    },
    computed: {},
    created() {},
    methods: {}
  }
</script>
