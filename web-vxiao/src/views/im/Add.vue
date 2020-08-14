<template>
  <Page title="群组选择">
    <SelectGroup @change="handleGroup"
                 :groups="gs" />
  </Page>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    computed: {
      ...mapGetters({
        groups: 'getGroups'
      }),
      gs() {
        return this.groups.filter(v => {
          return (v.type === '1' || v.type === '2') && v.status !== 'd'
        })
      }
    },
    methods: {
      handleGroup(g) {
        this.routePush({
          path: '/vx/im/members',
          query: {
            groupId: g.groupId,
            name: g.name
          }
        })
      }
    }
  }
</script>
