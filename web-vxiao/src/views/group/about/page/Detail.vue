<template>
  <Page :title="currentGroup.name">
    <Course v-if="isCourse" />
    <School v-else-if="isOrg" />
    <Default v-else />
  </Page>
</template>
<script>
  import R from '../../mixin'
  export default {
    mixins: [R],
    components: {
      Default: resolve => require(['../Default'], resolve),
      School: resolve => require(['../School'], resolve),
      Course: resolve => require(['../Course'], resolve)
    }
  }
</script>
