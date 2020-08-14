<template>
  <SchoolCourseTbl v-if="isSchool" />
  <ClassCourseTbl v-else />
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {
      SchoolCourseTbl: resolve => require(['./School'], resolve),
      ClassCourseTbl: resolve => require(['./Class'], resolve)
    }
  }
</script>
