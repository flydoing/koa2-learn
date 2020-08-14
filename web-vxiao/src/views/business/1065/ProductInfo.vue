<template>
  <Page :title="title"
        closePrompt
        :hasSubmit="editAble"
        @submit="handleSubmit">
    <item label="金额"
          :hasClick="false"
          :remark="amountTxt">
    </item>
    <div class="category-title"></div>
    <item label="数量"
          :hasClick="false">
      <template v-if="editAble">
        <input slot="remark"
               placeholder="必填"
               v-model="product.num" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="product.num"></div>
      </template>
      <div slot="after"
           v-html="unitTxt"></div>
    </item>
    <item label="单价"
          :hasClick="false">
      <template v-if="editAble">
        <input slot="remark"
               placeholder="必填"
               v-model="product.price" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="product.price"></div>
      </template>
      <div slot="after">元/{{product.unit}}</div>
    </item>
    <div class="button button-common"
         v-if="editAble"
         @click="handleRemove">删除</div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        product: {
          price: '',
          num: '',
          unit: '个'
        }
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      editAble() {
        return this.crm.editAble || false
      },
      amount() {
        let product = this.product
        if (Check.isNumber(product.num) && Check.isNumber(product.price)) {
          return (product.num * product.price).toFixed(2)
        }
        return (0).toFixed(2)
      },
      amountTxt() {
        return `${this.amount}元`
      },
      unitTxt() {
        let product = this.product
        return product.type === '1' ? '个' : product.unit
      }
    },
    created() {
      if (this.crm.product) {
        this.product = JSON.parse(JSON.stringify(this.crm.product))
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      handleSubmit() {
        const that = this
        let product = this.product
        if (Check.isNullString(product.num) || !Check.isNumber(product.num)) {
          that.$message({ message: '请输入产品数量（数值）', type: 'warning' })
          return false
        }
        if (Check.isNullString(product.price) || !Check.isNumber(product.price)) {
          that.$message({ message: '请输入产品单价（数值）', type: 'warning' })
          return false
        }
        this.setCrm({ product: { ...product, amount: this.amount } })
        this.routeBack()
      },
      handleRemove() {
        this.$confirm('确认删除该产品', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setCrm({ product: { ...this.product, status: 'd' } })
          this.routeBack()
        })
      }
    }
  }
</script>
