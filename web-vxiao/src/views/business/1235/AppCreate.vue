<template>
  <keep-alive>
    <StudentLeave v-if="isClass" />
    <TeacherLeave v-else />
  </keep-alive>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {
      TeacherLeave: resolve => require(['./TeacherLeave'], resolve),
      StudentLeave: resolve => require(['./StudentLeave'], resolve)
    },
    created() {},
    computed: {},
    methods: {}
  }

</script>
