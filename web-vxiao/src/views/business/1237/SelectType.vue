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
      attendance: 'getAttendance'
    })
  },
  methods: {
    ...mapActions(['setAttendance']),
    fetchData() {
      CategoryApi.getCategorysByType('150').then(res => {
        this.list = res.categorys
      })
    },
    handleItem(item, index) {
      let user = this.attendance.user
      let state = {
        userId: user.userId,
        type: item.value,
        name: user.name,
        data: item.name
      }
      this.setAttendance({ state: state })
      if (item.value !== '2' && item.value !== '7') {
        this.routeBack()
      } else {
        this.routePush({ name: 'illCondition1237' })
      }
    }
  }
}
</script>
