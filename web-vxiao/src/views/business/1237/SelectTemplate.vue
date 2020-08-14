<template>
  <page title="选择模板">
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
import Check from '@/utils/check'
import R from '@/views/group/mixin'
import Api from './api'
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
      attendance: 'getAttendance',
      metaDatas: 'getMetaDatas'
    }),
    tempMeta() {
      let that = this
      let type = 'm_attendance_disease_model'
      const metas = that.metaDatas.filter(m => {
        return m.metaType === type && m.extension === that.currentGroup.groupId
      })
      return Check.isArray(metas) ? metas[0] : false
    }
  },
  methods: {
    ...mapActions(['modifyMetaData', 'setAttendance']),
    fetchData() {
      const that = this

      let temp = that.attendance.template
      Api.getTemplates(this.currentGroup.groupId).then(res => {
        that.list = res.categorys.map(c => {
          if (temp.id === c.id) {
            c.active = true
          } else {
            c.active = false
          }
          return c
        })
      })
    },
    handleSelect(item, index) {
      let meta = this.tempMeta
      if (meta) {
        meta.userId = item.id
      } else {
        meta = {
          metaType: 'm_attendance_disease_model',
          extension: this.currentGroup.groupId,
          userId: item.id
        }
      }
      this.modifyMetaData(meta).then(res => {
        this.setAttendance({ removeList: [] })
        this.$message({ message: '操作成功', type: 'success' })
        this.routeBack()
      })
    }
  }
}

</script>
