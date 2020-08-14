<template>
  <page title="产品"
        hasSubmit
        @submit="handleSubmit"
        :showTips="list.length === 0">
    <item v-for="(item,i) in list"
          :key="i"
          :hasClick="false"
          :label="item.name">
      <input slot="remark"
             placeholder="数量"
             v-model="item.value" />
      <div slot="after"
           v-html="item.unit"></div>
    </item>
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
        list: []
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
            pMap.set(v.id, v)
          })
        }
        let school = this.getSchool(this.schoolId)
        Api1046.getProducts(school.groupId).then(res => {
          if (res.productManages) {
            res.productManages.forEach(v => {
              let product = pMap.get(v.id)
              if (v.type !== '1') {
                this.list.push(product || { ...v, value: '' })
              }
            })
          }
        })
      },
      handleSubmit() {
        let products = this.list.filter(v => {
          return Check.isNumber(v.value)
        })
        this.setCrm({ products: products })
        this.routeBack()
      }
    }
  }
</script>
