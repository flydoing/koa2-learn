<template>
  <page title="关联群组" @submit="handleSubmit" hasSubmit>
    <item v-for="(item,i) in list" :key="i" @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':item.selected}"></i>
      </div>
      <div slot="main" v-html="item.name"></div>
      <div slot="after"></div>
    </item>
  </page>
</template>
<script>
import Check from '@/utils/check'
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
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
      payroll: 'getPayroll'
    })
  },
  methods: {
    ...mapActions(['setPayroll']),
    fetchData() {
      const that = this

      let caches = that.payroll.groups
      let gMap = new Map()
      if (Check.isRealArray(caches)) {
        caches.map(v => { gMap.set(v.groupId, v) })
      }

      GroupApi.getSchoolGroupsByType(this.currentGroup.parentId, '1').then(res => {
        that.list = res.groups.map(v => {
          v.selected = Check.isObject(gMap.get(v.groupId))
          return v
        })
      })
    },
    handleSubmit() {
      let gs = this.list.filter(v => { return v.selected })
      this.setPayroll({ groups: gs })
      this.routeBack()
    },
    handleSelect(item, index) {
      item.selected = !item.selected
    }
  }
}

</script>
