<template>
  <DetailTeacher v-if="isTeacher || isAdmin" />
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
    methods: {}
  }

</script>
