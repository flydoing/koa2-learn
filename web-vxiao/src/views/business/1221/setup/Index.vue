<template>
  <Setup appType="'1221'">
    <template v-if="isSuperAdmin || isAdmin || isAppAdmin('1221')"
              slot="others">
      <Item @click="manager">
        <div slot="main">储物管理</div>
      </Item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: {},
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      manager() {
        if (this.isSchool) {
          this.routePush({
            path: `/vx/group/business/1221/setup`,
            query: {
              schoolId: this.currentGroup.parentId
            }
          })
        }
      }
    }
  }
</script>
