<template>
  <Setup appType="'1192'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1192'))" slot="others">
      <item @click="itemClick">
        <div>评价模板</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      itemClick() {
        this.routePush({
          name: 'templateList1192',
          query: {
            appType: this.routeQuery('appType')
          }
        })
      }
    }
  }

</script>
