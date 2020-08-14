<template>
  <page title="选择班级">
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title"
           v-html="item.name"></div>
      <item v-for="(cls,j) in item.groups"
            :key="j"
            :hasArrow="false"
            @click="handleSelect(cls)">
        <div slot="main"
             v-html="cls.name"></div>
      </item>
    </div>
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
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this
        GroupApi.getSchoolClasses(this.currentGroup.parentId).then(res => {
          that.list = res.groups || []
        })
      },
      handleSelect(item) {
        this.setAttendance({ cls: item })
        this.routeBack()
      }
    }
  }
</script>
