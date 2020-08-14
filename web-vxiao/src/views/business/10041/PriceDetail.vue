<template>
  <Page title="价格">
    <item label="有效区域"
          :hasClick="false"
          :remark="form.areaName"></item>
    <item label="有效园所"
          :hasClick="false"
          :remark="form.schoolName"></item>
    <div v-for="(item, i) in form.mallGoodsPrices"
         :key="i">
      <div class="category-title text">价格{{i + 1}}</div>
      <item label="规格"
            :hasClick="false"
            :remark="item.sizeTypeName"></item>
      <item label="价格"
            :hasClick="false"
            :remark="item.salePrice">
        <div slot="after">元</div>
      </item>
      <item label="成本价"
            :hasClick="false"
            :remark="item.purchasePrice">
        <div slot="after">元</div>
      </item>
      <item label="开始时间"
            :hasClick="false"
            :remark="startDate(item)"></item>
      <item label="结束时间"
            :hasClick="false"
            :remark="endDate(item)"></item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [R],
    data() {
      return {
        form: {
          mallGoodsPrices: []
        }
      }
    },
    computed: {},
    created() {
      Api.getPriceDetail(this.routeQuery('schoolId')).then(res => {
        if (res.mallGoodsSchoolRelation) {
          this.form = res.mallGoodsSchoolRelation
        }
      })
    },
    methods: {
      startDate(item) {
        let date = item.startDate
        return date ? DateUtils.format(date, 'yyyy-MM-dd') : ''
      },
      endDate(item) {
        let date = item.endDate
        return date ? DateUtils.format(date, 'yyyy-MM-dd') : ''
      }
    }
  }
</script>
