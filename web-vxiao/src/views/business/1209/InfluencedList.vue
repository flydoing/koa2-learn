<template>
  <page title="受影响的自动全景瞬间" @submit="handleSubmit" :hasSubmit="!isRemove">
    <item v-for="(item, i) in list" :key="i" :hasClick="false">
      <div slot="main" v-html="item.title"></div>
      <div slot="remark">{{item.description}}，{{item.startTime}}</div>
    </item>
    <div v-if="isRemove" class="button button-common" @click="handleRemove">确认删除</div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
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
      panomara: 'getPanomara'
    })
  },
  methods: {
    ...mapActions(['setPanomara']),
    fetchData() {
      const that = this
      that.isRemove = that.panomara.isRemove
      that.list = that.panomara.moments
    },
    handleRemove(item) {
      const that = this
      Api.commitEquipment({
        id: that.panomara.equipment.id,
        status: 'd',
        schoolId: that.currentGroup.parentId
      }).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack(-2)
      })
    },
    handleSubmit() {
      const that = this
      Api.commitEquipment(that.panomara.equipment).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack(-2)
      })
    }
  }
}

</script>
