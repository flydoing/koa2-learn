<template>
  <page title="选择适用范围" @submit="handleSubmit" hasSubmit>
    <item v-for="(range,i) in list" :key="i" @click="handleSelect(range, i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':range.active}"></i>
      </div>
      <div slot="main">{{range.name}}</div>
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
      inspection: 'getInspection'
    })
  },
  methods: {
    ...mapActions(['setInspection']),
    fetchData() {
      const that = this

      let caches = that.inspection.project.ranges
      let rMap = new Map()
      if (Check.isRealArray(caches)) {
        caches.map(v => { rMap.set(v.id, v) })
      }

      GroupApi.getSchoolGroupsByType(that.currentGroup.parentId, '4').then(res => {
        that.list = res.groups.map(v => {
          rMap.get(v.id) ? (v.active = true) : (v.active = false)
          return v
        })
      })
    },
    handleSubmit() {
      let rs = this.list.filter(v => { return v.active })
      if (rs.length < 1) {
        this.$message({ message: '请选择适用范围', type: 'warning' })
        return false
      }
      let txt = (rs.length !== this.list.length ? rs.map(r => { return r.name }).join('、') : '所有校区')
      this.setInspection({ project: { ...this.inspection.project, ranges: rs, rangeTxt: txt } })
      this.routeBack()
    },
    handleSelect(range, index) {
      range.active = !range.active
    }
  }
}

</script>
