<template>
  <page title="选择类型">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item, i)">
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

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
    computed: {
      ...mapGetters({
        getSchool: 'getSchoolBySchoolId',
        order: 'getOrder'
      })
    },
    methods: {
      ...mapActions(['setOrder']),
      fetchData() {
        let school = this.getSchool(this.currentGroup.parentId) || {}
        CategoryApi.getCategorys({
          type: '18',
          groupId: school.groupId || void 0
        }).then(res => {
          this.list = res.categorys
        })
      },
      handleItem(item, index) {
        this.setOrder({ type: item })
        this.routeBack()
      }
    }
  }
</script>
