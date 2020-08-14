<template>
  <Page title="发布">
    <Create />
  </Page>
</template>
<script>
  export default {
    components: {
      Create: resolve => require(['@/views/group/create/Index'], resolve)
    }
  }
</script>
