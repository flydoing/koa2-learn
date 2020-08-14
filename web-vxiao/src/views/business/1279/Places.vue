<template>
  <Page title="选择场所">
    <div v-for="(v,k) in categorys"
         :key="k">
      <div class="category-title">{{k}}</div>
      <Item v-for="c in v"
            :label="c.name"
            :key="c.id"
            @click="onClick(c)" />
    </div>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  export default {
    data() {
      return { categorys: {} }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        Api.getPlacesBySchooId({ schoolId: this.routeQuery('schoolId') }).then(res => {
          res.places.forEach(p => {
            if (!this.categorys[p.cname]) {
              this.$set(this.categorys, p.cname, [])
            }
            this.categorys[p.cname].push(p)
          })
        })
      },
      onClick(place) {
        this.setStorage('_cache_place', place)
        this.routeBack()
      }
    }
  }
</script>
