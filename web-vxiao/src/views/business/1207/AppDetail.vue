<template>
  <AppPage title="物联网">
    <AppCommon :app="curApp" />
    <div v-for="(schoolSite,k) in placeMap"
         :key="k">
      <div class="category-title">{{schoolSite.name}}</div>
      <item v-for="(schooleplace,index) in schoolSite.placeList"
            :key="index"
            @click="handle(schooleplace)">
        <div slot="main">{{schooleplace.name}}</div>
        <div slot="remark">{{schooleplace.count}}</div>
      </item>
    </div>
  </AppPage>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        placeMap: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      fetchData() {
        Api.getSchool(this.currentGroup.parentId).then(res => {
          this.placeMap = res.vIotPlaces || []
        })
      },
      handle(schooleplace) {
        this.setStorage('_deviceInfo', schooleplace)
        this.routePush({ name: 'entranceAdd1207' })
      }
      // handle(place) {
      //   this.routePush({
      //     name: 'viots',
      //     params: { placeId: place.id },
      //     query: { schoolId: this.currentGroup.parentId }
      //   })
      // }
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
