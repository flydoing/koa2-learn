<template>
  <Page title="添加空调">
    <div class="category-title">空调</div>
    <item>
      <div slot="main">设备名称</div>
      <input slot="after" v-model="viot.name" placeholder="输入设备名称" />
    </item>
    <item @click="handleBrand">
      <div slot="main">品牌</div>
      <div slot="remark">{{viot.brandName}}</div>
    </item>
    <item @click="handleModel">
      <div slot="main">型号</div>
      <div slot="remark">{{viot.modelName}}</div>
    </item>
    <div class="list-button">
      <div class="button big" @click="handle">提交</div>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        viot: {
          name: '',
          modelId: '',
          modelName: '',
          brandId: '',
          brandName: '',
          schoolId: this.routeQuery('schoolId'),
          placeId: this.routeQuery('placeId'),
          categoryId: this.routeQuery('categoryId'),
          categoryType: this.routeQuery('categoryType')
        }
      }
    },
    methods: {
      handle() {
        const that = this
        const loading = that.$loading({
          lock: true,
          text: '提交中',
          background: 'rgba(0, 0, 0, .3)'
        })
        Api.addViot({ viot: this.viot }).then(res => {
          loading.close()
          that.$router.go(-1)
        }).catch(res => {
          loading.close()
        })
      },
      handleModel() {
        if (this.viot.brandId === '') {
          this.$message({ message: '请优先选择品牌', type: 'warning' })
          return
        }
        this.routePush({
          name: 'modelSelect',
          query: { id: this.viot.brandId }
        })
      },
      handleBrand() {
        this.routePush({
          name: 'brandSelect',
          query: {
            id: this.routeQuery('categoryId')
          }
        })
      },
      callbackState() {
        let brand = this.getStorage('_brand')
        let model = this.getStorage('_model')
        if (brand) {
          this.$set(this.viot, 'brandId', brand.id)
          this.$set(this.viot, 'brandName', brand.name)
        }
        if (model) {
          this.$set(this.viot, 'modelId', model.id)
          this.$set(this.viot, 'modelName', model.name)
        }
      }
    }
  }

</script>
