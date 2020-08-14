<template>
  <page :title="title" @submit="handleSubmit" hasSubmit>
    <div class="equipment-edit">
      <item @click="handlePlace">
        <div slot="main">场所</div>
        <div slot="remark" class="ellipsis" v-html="placeTxt"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">设备序列号</div>
        <input slot="remark" placeholder="必填" v-model="equipment.serialNumber" />
      </item>
      <div v-if="equipment.id" class="button button-common" @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      equipment: {
        serialNumber: '',
        place: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      panomara: 'getPanomara'
    }),
    title() {
      return this.equipment.id ? `编辑全景设备 ` : '新建全景设备'
    },
    placeTxt() {
      return this.equipment.place ? this.equipment.place.name : ''
    }
  },
  methods: {
    ...mapActions(['setPanomara']),
    fetchData() {
      const that = this
      let cache = that.panomara.cache
      if (that.panomara.equipment) {
        that.equipment = JSON.parse(JSON.stringify(that.panomara.equipment))
      } else if (cache) {
        that.equipment = { ...cache, place: { id: cache.placeId, name: cache.name } }
      }
    },
    handlePlace() {
      this.setPanomara({ equipment: this.equipment })
      this.routePush({ name: 'selectPlace1209' })
    },
    handleRemove() {
      const that = this
      let equipment = that.equipment
      Api.loadInfluencedList(equipment.place.id).then(res => {
        if (Check.isRealArray(res.autoVRs)) {
          this.setPanomara({ equipment: equipment, moments: res.autoVRs, isRemove: true })
          this.routePush({ name: 'influencedList1209' })
        } else {
          that.$confirm('确定删除该设备？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Api.commitEquipment({
              id: equipment.id,
              status: 'd',
              schoolId: that.currentGroup.parentId
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
        }
      })
    },
    handleSubmit() {
      const that = this
      let equipment = that.equipment
      if (Check.isNullString(equipment.serialNumber)) {
        that.$message({ message: '标题不能为空', type: 'warning' })
        return false
      }
      if (!equipment.place) {
        that.$message({ message: '请选择场所', type: 'warning' })
        return false
      }

      let postData = {
        placeId: equipment.place.id,
        name: equipment.place.name,
        serialNumber: equipment.serialNumber,
        schoolId: that.currentGroup.parentId
      }
      equipment.id && (postData.id = equipment.id)

      if (equipment.id) {
        Api.loadInfluencedList(equipment.placeId).then(res => {
          if (Check.isRealArray(res.autoVRs)) {
            this.setPanomara({ equipment: postData, moments: res.autoVRs, isRemove: false })
            this.routePush({ name: 'influencedList1209' })
          } else {
            Api.commitEquipment(postData).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          }
        })
      } else {
        Api.commitEquipment(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
}

</script>
