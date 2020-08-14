<template>
  <Page title="选择群组"
        hasSubmit
        @submit="onSubmit">
    <SelectGroup :groups="groups"
                 :multiselect='true'
                 :cache="caches"
                 ref="_select_groups" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
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
        groups: [],
        caches: []
      }
    },
    activated() {
      this.caches = this.getStorage('_cache_groups') || []
      GroupApi.getSchoolGroups(this.groupId).then(res => {
        if (Check.isRealArray(res.groups)) {
          this.groups = res.groups
        }
      })
    },
    methods: {
      onSubmit() {
        let groups = this.$refs._select_groups.getGroups()
        this.setStorage('_cache_groups', groups)
        this.routeBack(-1)
      }
    }
  }
</script>
