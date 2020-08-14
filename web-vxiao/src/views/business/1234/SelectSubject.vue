<template>
  <page title="选择科组">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleSelect(item)">
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters } from 'vuex'

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
        getSchool: 'getSchoolBySchoolId'
      })
    },
    methods: {
      fetchData() {
        let school = this.getSchool(this.schoolId)
        CategoryApi.getCategorys({
          type: '1',
          groupId: school.groupId
        }).then(res => {
          this.list = res.categorys || []
        })
      },
      handleSelect(item) {
        this.routePush({
          name: 'selectTeacher1234',
          query: { sid: item.id }
        })
      }
    }
  }
</script>
