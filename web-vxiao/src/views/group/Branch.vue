<template>
  <Page :title="branchGroup.name"
        @back="onBack"
        listenBack>
    <div class="vx-space vx-branch">
      <div class="vx-main">
        <GroupMain />
      </div>
      <div class="vx-contacts"
           v-if="hasContacts">
        <div class="vx-main-header">
          &nbsp;
        </div>
        <GroupContacts />
      </div>
    </div>
  </Page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      GroupMain: resolve => require(['./Main'], resolve),
      GroupContacts: resolve => require(['./Contacts'], resolve)
    },
    computed: {
      ...mapGetters(['getGroupById', 'getBranchId']),
      ...mapGetters({
        hasContacts: 'showGroupContacts'
      }),
      branchGroup() {
        return this.getGroupById(this.getBranchId) || {}
      }
    },
    methods: {
      ...mapActions(['modifyBranchId']),
      onBack() {
        this.modifyBranchId(null)
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  .vx-branch {
    background-color: #ededed;
    margin-left: 0;
  }
</style>
