<template>
  <div class="vx-space">
    <div class="vx-main">
      <keep-alive>
        <GroupMain />
      </keep-alive>
    </div>
    <div class="vx-contacts"
         v-if="hasContacts">
      <div class="vx-main-header">
        <i class="ico ico-d-left"
           @click="showGroupContacts(false)"></i>
      </div>
      <keep-alive>
        <GroupContacts />
      </keep-alive>
    </div>
    <ModelPage :show="openPage" />
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      GroupMain: resolve => require(['./Main'], resolve),
      GroupContacts: resolve => require(['./Contacts'], resolve)
    },
    computed: {
      ...mapGetters({
        hasContacts: 'showGroupContacts'
      })
    },
    created() {
      this.showGroupContacts(true)
    },
    methods: {
      ...mapActions(['showGroupContacts'])
    }
  }
</script>
