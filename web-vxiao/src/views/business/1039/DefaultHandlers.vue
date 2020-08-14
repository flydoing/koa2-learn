<template>
  <page title="默认处理人">
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.name"
          :remark="remarkTxt(item)"
          @click="handleItem(item)">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        getSchool: 'getSchoolBySchoolId',
        order: 'getOrder'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setOrder']),
      remarkTxt(item) {
        if (Check.isRealArray(item.toUsers)) {
          let users = item.toUsers.map(v => {
            return v.name
          })
          return users.join('、')
        }
        return ''
      },
      fetchData() {
        let school = this.getSchool(this.currentGroup.parentId)
        Api.getDefaultHandlers(school.groupId).then(res => {
          this.list = res.treatDefaults || []
        })
      },
      handleItem(item) {
        this.setOrder({ item: item })
        this.routePush({ name: 'addMember1039', query: { title: item.name } })
      }
    }
  }
</script>
