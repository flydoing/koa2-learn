<template>
  <AppPage :title="app.name"
           :showTips="places.length === 0"
           :loading="loading"
           hasAdd
           @add="onAdd">
    <AppCommon :app="curApp" />
    <template v-if="places.length > 0">
      <div class="category-title"></div>
      <Item v-for="p in places"
            :key="p.id"
            @click="handle(p)">
        <div>{{p.name}}</div>
      </Item>
    </template>
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        places: [],
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        Api.getVisionPlaces(this.schoolId).then(res => {
          this.loading = false
          this.places = res.visionPlaces || []
        })
      },
      handle(place) {
        this.routePush({
          path: '/vx/group/business/1279/detail',
          query: {
            title: place.name,
            placeId: place.placeId,
            groupId: this.groupId
          }
        })
      },
      onAdd() {
        this.routePush({
          path: '/vx/group/business/1279/add'
        })
      }
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      },
      $route(to, from) {
        if (to.path === '/vx/') {
          this.fetchData()
        }
      }
    }
  }
</script>
