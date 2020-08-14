<template>
  <page title="选择地址">
    <template slot="top">
      <Item :hasClick="false"
            fullInput
            slot="top"
            class="search">
        <div slot="before">
          <i class="ico ico-search"></i>
        </div>
        <input placeholder="搜索关键字"
               v-model="keyword" />
      </Item>
    </template>
    <baidu-map class="address-map"
               ref="_map"
               ak="ZReCCOsO5Q6IEZL3MyfdzP8o"
               :center="center"
               @ready="handle">
      <bm-view class="map"></bm-view>
      <bm-local-search :keyword="keyword"
                       :auto-viewport="true"
                       :selectFirstResult="true"
                       @markersset="handleCallback"
                       :panel="false"></bm-local-search>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    </baidu-map>
    <item v-for="(item, i) in addresses"
          :key="i"
          @click="handleAddress(item)">
      <div slot="before"
           class="address-sort">
        <div><i class="ico ico-location"></i><span v-html="addressSort(i)"></span></div>
      </div>
      <div slot="main">
        <div v-html="addressName(item)"
             class="text-color"></div>
        <div v-html="addressTxt(item)"
             class="address-txt ellipsis"></div>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { BaiduMap, BmLocalSearch, BmView, BmNavigation } from 'vue-baidu-map'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: { BaiduMap, BmLocalSearch, BmView, BmNavigation },
    data() {
      return {
        keyword: '',
        center: {},
        addresses: []
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    created() {
      if (this.crm.address) {
        this.keyword = this.crm.address.title
        this.deleteCrmProp('address')
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      handle({ BMap, map }) {
        let geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(data => {
          if (data) {
            let geo = new BMap.Geocoder()
            geo.getLocation(data.point, result => {
              if (result) {
                this.keyword = this.keyword || result.addressComponents.city
              }
            })
          }
        })
      },
      addressSort(index) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWSYZ'.charAt(index)
      },
      addressName(item) {
        if (item.type === 3) {
          return `${item.title}地铁站`
        } else if (item.type === 1) {
          return `${item.title}公交站`
        }
        return item.title
      },
      addressTxt(item) {
        if (item.type === 3 || item.type === 1) {
          return `车次：${item.address}`
        }
        return `地址：${item.address}`
      },
      handleCallback(postions) {
        this.addresses = postions || []
      },
      handleAddress(item) {
        let params = this.crm.params || {}
        if (params.callback) {
          params.callback(item, () => {
            this.routeBack()
          })
        } else {
          this.setCrm({
            address: {
              province: item.province,
              city: item.city,
              address: item.address,
              title: item.title,
              point: item.point
            }
          })
          this.routeBack()
        }
      }
    }
  }
</script>
<style lang="scss">
  .address-map {
    width: 100%;
    .map {
      height: 300px;
    }
  }
  .address-txt {
    color: #999;
    font-size: rem(12);
  }
  .address-sort {
    & > div {
      position: relative;
      .ico-location {
        color: #d81e06;
        font-size: rem(24);
        line-height: rem(24);
        &:hover {
          color: #d81e06;
        }
      }
    }
    span {
      position: absolute;
      color: #fff;
      right: 0;
      top: 0;
      text-align: center;
      width: 100%;
      font-size: rem(12);
    }
  }
</style>
