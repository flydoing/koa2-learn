<template>
  <page title="物联网"
        @back="handleBack"
        listenBack>
    <div class="haders"
         v-for="(site,s) in siteData"
         :key="s">
      <div class="category-title">{{site.name}}</div>
      <div v-for="(sitePlace,index) in site.placeList"
           :key="index"
           @click="siteDetails($event,sitePlace)">
        <item>
          <div slot="main">{{sitePlace.name}}</div>
          <div slot="remark"><span v-if="sitePlace.isHaveOpen === '0' ? false : true"
                  class="enable"></span></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import CardMixin from '@/views/components/card/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage, CardMixin],
    data() {
      return {
        siteData: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        // 如果是在班级或群组内新建，就直接跳过，否则拿到绑定了设备的场所
        if (this.isClass || this.isOrdinary === true) {
          // 是在班级或群组新建
          this.routePush({ name: 'controlDetails1207' })
        } else {
          // 拿到学校id
          Api.getSite(this.currentGroup.parentId).then(res => {
            this.siteData = res.vIotPlaces
          })
        }
      },
      siteDetails(e, sitePlace) {
        this.setStorage('_sitePlaceId', sitePlace.id)
        this.routePush({ name: 'controlDetails1207' })
      },
      handleBack() {
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .enable {
    width: 10px;
    height: 10px;
    margin-top: 2px;
    background: #00cc33;
    border-radius: 50%;
    display: inline-block;
  }
  .vx-item-right div {
    line-height: 19px;
  }
</style>
