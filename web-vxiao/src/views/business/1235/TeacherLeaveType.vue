<template>
  <page title="选择类型">
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
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
        leave: 'getLeave',
        getSchool: 'getSchoolBySchoolId'
      })
    },
    methods: {
      ...mapActions(['setLeave']),
      fetchData() {
        const that = this
        let school = this.getSchool(this.schoolId)
        let cache = that.leave.type
        CategoryApi.getCategorys({
          type: '36',
          groupId: school.groupId,
          isDefault: 1
        }).then(res => {
          that.list = res.categorys.map(v => {
            v.selected = cache && cache.id === v.id
            return v
          })
        })
      },
      handleSelect(item, index) {
        this.setLeave({ type: item })
        this.routeBack()
      }
    }
  }
</script>
