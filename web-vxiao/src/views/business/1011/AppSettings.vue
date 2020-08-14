<template>
  <page title="应用设置">
    <Setup/>
  </page>
</template>
<script>
export default {
  components: {
    Setup: resolve => require(['./AppSetup'], resolve)
  }
}

</script>
