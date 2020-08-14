<template>
  <Page title="选择群组">
    <SelectGroup :groups="groups"
                 @change="handleGroup" />
  </Page>
</template>
<script>
  import R from '../mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R],
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    computed: {},
    data() {
      return {
        groups: []
      }
    },
    created() {
      GroupApi.getSchoolGroups(this.groupId).then(res => {
        if (Check.isRealArray(res.groups)) {
          this.groups = res.groups
        }
      })
    },
    methods: {
      handleGroup(gp) {
        this.routePush({
          path: '/vx/group/business/app/select/user',
          query: { groupId: gp.groupId }
        })
      }
    }
  }
</script>
