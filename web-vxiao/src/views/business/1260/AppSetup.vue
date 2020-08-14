<template>
  <Setup>
    <template v-if="isSchool &&(isSuperAdmin || isAdmin || isAppAdmin('1260'))"
              slot="others">
      <item @click="templateSetting">
        <div slot="main">家访模板</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: (resolve) => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      templateSetting() {
        this.routePush({ name: 'templateEdit1260' })
      }
    }
  }
</script>
