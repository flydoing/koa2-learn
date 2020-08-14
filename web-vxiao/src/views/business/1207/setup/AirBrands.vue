<template>
  <Page :loading="loading"
        title="搜索">
    <Item :hasClick="false"
          fullInput
          class="search">
      <div slot="before"> <i class="ico ico-search"></i></div>
      <input placeholder="搜索"
             v-model="search" />
    </Item>
    <Item v-for="(c,i) in searchCategorys"
          @click="handle(c)"
          :key="i">
      <div slot="main">{{c.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        search: '',
        categorys: [],
        loading: true
      }
    },
    computed: {
      searchCategorys() {
        let search = this.search
        let arr = this.categorys
        if (!arr) {
          return []
        }
        if (search) {
          arr = this.categorys.filter(c => {
            return Object.keys(c).some(key => {
              return (
                String(c[key])
                  .toLowerCase()
                  .indexOf(search) > -1
              )
            })
          })
        }
        return arr
      }
    },
    methods: {
      handle(brand) {
        this.setStorage('_brand', brand)
        this.routeBack()
      }
    },
    mounted() {
      const that = this
      Api.getAirCategorys({
        parentId: this.routeQuery('id')
      })
        .then(res => {
          that.categorys = res.categorys
          that.loading = false
        })
        .catch(res => {
          that.loading = false
        })
    }
  }
</script>
