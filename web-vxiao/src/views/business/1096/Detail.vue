<template>
  <DetailTeacher v-if="role==='1'" />
  <DetailStudent v-else />
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      DetailTeacher: resolve => require(['./DetailTeacher'], resolve),
      DetailStudent: resolve => require(['./DetailStudent'], resolve)
    },
    data() {
      return {
        role: ''
      }
    },
    created() {
      let role = this.routeQuery('role')
      this.role = role || ((this.isTeacher || this.isAdmin) ? '1' : '2')
    },
    methods: {}
  }

</script>
