<template>
  <Page title="金额预测"
        hasSubmit
        @submit="handleSubmit">
    <div v-for="(item, i) in list"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item label="单价"
            :hasClick="false">
        <input slot="remark"
               placeholder="点击输入"
               v-model="item.price" />
      </item>
      <item label="数量"
            :hasClick="false">
        <input slot="remark"
               placeholder="点击输入"
               v-model="item.count" />
      </item>
      <item label="数量"
            :hasClick="false"
            :remark="amountTxt(item)"></item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm',
        getSchool: 'getSchoolBySchoolId'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCrm']),
      amountTxt(item) {
        if (Check.isNumber(item.price) && Check.isNumber(item.count)) {
          return (parseFloat(item.price) * parseFloat(item.count)).toFixed(2).toString()
        }
        return ''
      },
      fetchData() {
        let cMap = new Map()
        let caches = this.crm.products
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            cMap.set(v.id, v)
          })
        }

        let school = this.getSchool(this.schoolId)
        Api.getProducts(school.groupId).then(res => {
          if (res.productManages) {
            this.list = res.productManages.map(v => {
              let p = cMap.get(v.id) || {}
              return { ...v, price: p.price || '', count: p.count || '' }
            })
          }
        })
      },
      handleSubmit() {
        let products = this.list.filter(v => {
          return Check.isNumber(v.price) && Check.isNumber(v.count)
        })
        this.setCrm({ products: products })
        this.routeBack()
      }
    }
  }
</script>
