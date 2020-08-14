<template>
  <page title="巡检人" @submit="handleSubmit" hasSubmit>
    <Relate :items="us" :plus="true" :reduce="true" @plus="handleAdd" @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        inspection: 'getInspection'
      }),
      us() {
        return this.users.map(v => { return { ...v, avatar: this.url(v.avatar) } })
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setInspection']),
      fetchData() {
        this.users = this.inspection.users || []
      },
      handleAdd() {
        this.setInspection({ users: this.users })
        this.routePush({ name: 'selectGroup1216' })
      },
      handleRemove(u, index) {
        this.users.splice(index, 1)
      },
      handleSubmit() {
        this.setInspection({ users: this.users })
        this.routeBack()
      }
    }
  }

</script>
