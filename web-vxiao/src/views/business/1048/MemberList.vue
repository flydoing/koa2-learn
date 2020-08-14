<template>
  <page title="表彰成员">
    <Relate :items="us" :plus="false" :reduce="false" />
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
      commend: 'getCommend'
    }),
    us() {
      return this.users.map(v => { return { ...v, avatar: this.url(v.avatar) } })
    }
  },
  components: {
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  methods: {
    ...mapActions(['setCommend']),
    fetchData() {
      this.users = this.commend.members || []
      this.setCommend({ members: [] })
    }
  }
}

</script>
