<template>
  <page title="新增产品"
        hasSubmit
        @submit="handleSubmit"
        :showTips="softwares.length === 0 && hardwares.length === 0">
    <template v-if="hardwares.length > 0">
      <div class="category-title text">硬件</div>
      <item v-for="(item,i) in hardwares"
            :key="i"
            @click="handleSelect(item, i)"
            :label="item.name">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
      </item>
    </template>
    <template v-if="softwares.length > 0">
      <div class="category-title text">软件</div>
      <item v-for="(item,i) in softwares"
            :key="i"
            @click="handleSelect(item, i)"
            :label="item.name">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api1046 from '@/views/business/1046/api'

  export default {
    mixins: [R],
    data() {
      return {
        softwares: [],
        hardwares: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm',
        getSchool: 'getSchoolBySchoolId'
      })
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        let pMap = new Map()
        if (Check.isRealArray(this.crm.products)) {
          this.crm.products.map(v => {
            pMap.set(v.productId, v)
          })
        }
        let school = this.getSchool(this.schoolId)
        Api1046.getProducts(school.groupId).then(res => {
          if (res.productManages) {
            let softwares = []
            let hardwares = []
            this.list = res.productManages.forEach(v => {
              if (!pMap.get(v.id)) {
                v.num = ''
                v.amount = ''
                v.selected = false
                v.type !== '1' ? hardwares.push(v) : softwares.push(v)
              }
            })
            this.softwares = softwares
            this.hardwares = hardwares
          }
        })
      },
      handleSelect(item, index) {
        this.$set(item, 'selected', !item.selected)
      },
      handleSubmit() {
        let products = []
        this.softwares.forEach(v => {
          if (v.selected) {
            products.push({
              productId: v.id,
              productName: v.name,
              type: v.type,
              unit: v.unit,
              amount: v.amount,
              num: v.num,
              price: v.price,
              serial: Math.random(1, 999)
            })
          }
        })
        this.hardwares.forEach(v => {
          if (v.selected) {
            products.push({
              productId: v.id,
              productName: v.name,
              type: v.type,
              unit: v.unit,
              amount: v.amount,
              num: v.num,
              price: v.price
            })
          }
        })
        this.setCrm({ products: products })
        this.routeBack()
      }
    }
  }
</script>
