<template>
  <page title="落款名称">
    <item @click="handleSelect">
      <div slot="main"
           v-html="userInfo.name"></div>

    </item>
    <div class="category-title"></div>
    <item v-for="(item, i) in groups"
          @click="handleSelect(item)"
          :key="i"
          :hasArrow="false">
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    data() {
      return {
        groups: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        GroupApi.getSchoolDepartmentsAndTeams(that.currentGroup.parentId).then(res => {
          that.groups = res.groups
        })
      },
      handleSelect(item) {
        this.setStorage('_inscription_cache', item || {})
        this.routeBack()
      }
    }
  }
</script>
