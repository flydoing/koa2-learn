<template>
  <page title="栏目设置" @add="handleAdd" :hasAdd="true">
    <item v-for="(item, i) in list" :key="i" :item="item" @click="handleItem(item)" v-if="item.name">
      <div slot="main" v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import CategoryApi from '@/api/category'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {},
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
      security: 'getSecurity'
    })
  },
  methods: {
    ...mapActions(['setSecurity']),
    fetchData() {
      const that = this
      CategoryApi.getCategorys({
        type: '116',
        groupId: that.currentGroup.groupId
      }).then(res => {
        that.list = res.categorys || []
      })
    },
    handleAdd() {
      this.setSecurity({ column: null })
      this.routePush({ name: 'columnEdit1149' })
    },
    handleItem(item) {
      this.setSecurity({ column: item })
      this.routePush({ name: 'columnEdit1149' })
    }
  }
}

</script>
