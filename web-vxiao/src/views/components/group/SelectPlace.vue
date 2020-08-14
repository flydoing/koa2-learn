<template>
  <Page title="场所选择"
        :loading="loading">
    <SelectGroup @change="selectPlace"
                 :groups="places"
                 :cache="cachePlace" />
  </Page>
</template>
<script>
  import Api from '@/api/group'
  export default {
    components: {
      SelectGroup: resolve => require(['./SelectGroup'], resolve)
    },
    data() {
      return {
        places: [],
        cachePlace: [],
        loading: true
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    created() {
      let params = {
        schoolId: this.routeQuery('schoolId')
      }
      let type = this.routeQuery('type')
      if (type) {
        params.type = type
      }
      Api.getPlacesBySchooId(params)
        .then(res => {
          this.places = res.places
          this.loading = false
        })
        .catch(res => (this.loading = false))
      // 获取缓存
      this.cachePlace = this.getStorage('_cache_place') || {}
    },
    methods: {
      selectPlace(place) {
        this.setStorage('_cache_place', place)
        if (this.routeQuery('depth')) {
          this.routeBack(-2)
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
