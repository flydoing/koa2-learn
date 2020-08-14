<template>
  <Page :title="titleText" hasSubmit></Page>
</template>
<script>
  export default {
    data() {
      return {
        titleText: `${this.routeQuery('titleText')}分制`,
        gardes: {
          '100': []
        }
      }
    }
  }

</script>
