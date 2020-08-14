<template>
  <page title="选择对象">
    <item @click="handleSelect(currentGroup)">
      <div slot="main"
           v-html="currentGroup.name"></div>
    </item>
    <div class="category-title"></div>
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleSelect(item, i)"
          :label="item.name"
          :hasArrow="false">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        GroupApi.getGroupStyleUsers(that.currentGroup.groupId, 'student').then(res => {
          that.list = res.relations
        })
      },
      handleSelect(item) {
        this.setCreateObject({ user: item })
        this.routeBack()
      }
    }
  }
</script>
