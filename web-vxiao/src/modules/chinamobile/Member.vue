<template>
  <Page title="成员">
    <keep-alive>
      <GroupContacts />
    </keep-alive>
  </Page>
</template>
<script>
  export default {
    components: {
      GroupContacts: resolve => require(['@/views/group/Contacts'], resolve)
    }
  }
</script>
