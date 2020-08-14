<template>
  <page title="选择表彰类型">
    <item v-for="(item,i) in list" :key="i" @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':item.active}"></i>
      </div>
      <div slot="main">{{item.name}}</div>
      <div slot="after"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'
import CategoryApi from '@/api/category'

export default {
  mixins: [R],
  data() {
    return {
      list: []
    }
  },
  components: {},
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      commend: 'getCommend'
    })
  },
  methods: {
    ...mapActions(['setCommend']),
    fetchData() {
      const that = this
      let type = this.commend.cmdn.type
      CategoryApi.getCategorysByType('108').then(res => {
        that.list = res.categorys.map(t => {
          if (type && type.id === t.id) {
            t.active = true
          } else {
            t.active = false
          }
          return t
        })
      })
    },
    handleSelect(item, index) {
      this.setCommend({ cmdn: { ...this.commend.cmdn, type: item } })
      this.routeBack()
    }
  }
}

</script>
