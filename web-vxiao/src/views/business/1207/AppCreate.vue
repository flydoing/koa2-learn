<template>
  <page title="物联网"
        @back="onBack"
        listenBack>
    <div class="haders"
         v-for="(site,s) in siteData"
         :key="s">
      <div class="category-title">{{site.name}}</div>
      <div v-for="(sitePlace,i) in site.placeList"
           :key="i"
           @click="onSiteDetails(sitePlace)">
        <item>
          <div slot="main">{{sitePlace.name}}</div>
          <div slot="remark">
            <span v-if="sitePlace.isHaveOpen === '0' ? false : true"
                  class="enable"></span>
          </div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
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
          Api.getGroupPlace(this.groupId).then(res => {
            if (!Check.isNullObject(res.place)) {
              this.onSiteDetails(res.place || {})
            } else {
              this.$message({ type: 'warning', message: '当前班群还未绑定场所' })
              this.routeBack()
            }
          })
        } else {
          // 拿到学校id
          Api.getSite(this.currentGroup.parentId).then(res => {
            this.siteData = res.vIotPlaces
          })
        }
      },
      onSiteDetails(sitePlace) {
        this.routePush({
          name: 'controlDetails1207',
          query: {
            title: sitePlace.name,
            placeId: sitePlace.id
          }
        })
      },
      onBack() {
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
