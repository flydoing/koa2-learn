<template>
  <page title="全景设备列表">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleEquipment(item)">
      <div slot="main">{{item.name}}&#12288;{{item.serialNumber}}</div>
      <div slot="remark"
           :class="{'text-color error':item.connectStatus==='异常'}"
           v-html="item.connectStatus"></div>
    </item>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main">新增</div>
    </item>
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
        Api.loadEquipments(that.currentGroup.parentId).then(res => {
          that.list = res.caremas || []
        })
      },
      handleEquipment(item) {
        this.setPanomara({ cache: item, equipment: null, equipments: this.list })
        this.routePush({ name: 'equipmentEdit1209' })
      },
      handleAdd() {
        this.setPanomara({ cache: null, equipment: null, equipments: this.list })
        this.routePush({ name: 'equipmentEdit1209' })
      }
    }
  }
</script>
