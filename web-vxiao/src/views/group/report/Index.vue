<template>
  <Page :title="title">
    <Detail @title="changeTitle" />
  </Page>
</template>
<script>
  export default {
    components: {
      Detail: resolve => require(['./h5/Detail'], resolve)
    },
    data() {
      return { title: `${this.routeQuery('appName')}报表` }
    },
    methods: {
      changeTitle(txt) {
        this.title = txt
      }
    }
  }

</script>
