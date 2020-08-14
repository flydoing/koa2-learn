<template>
  <Setup appType="'1148'">
    <template v-if="isOrg && (isSuperAdmin || isAdmin || isAppAdmin('1148'))"
              slot="others">
      <item label="岗位设置"
            @click="postSetting">
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    computed: {},
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      postSetting() {
        this.routePush({ name: 'postSetting1148' })
      }
    }
  }
</script>
