<template>
  <Setup appType="'1104'">
    <template slot="others">
      <item @click="universityLibrary">
        <div slot="main">默认接收人</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        approvers: ''
      }
    },
    components: {
      ...mapGetters({
        approve: 'getShipments'
      }),
      Setup: (resolve) => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      ...mapActions(['setShipments']),
      universityLibrary() {
        // this.setShipments({ form: this.form, isApprover: true, user: [] })
        this.routePush({ name: 'selectHandler1104' })
      }
    }
  }
</script>
