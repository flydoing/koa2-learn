<template>
  <Setup appType="'1186'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1186'))" slot="others">
      <item @click="setScore">
        <div>分数设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Str from '@/utils/string'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      setScore() {
        this.routePush({
          name: 'chantSetting',
          query: {
            appType: this.routeQuery('appType'),
            userId: this.userId,
            clientId: this.clientId,
            refId: Str.uuid(),
            groupId: this.currentGroup.groupId,
            isSchool: this.isSchool,
            schoolId: this.currentGroup.parentId
          }
        })
      }
    }
  }

</script>
