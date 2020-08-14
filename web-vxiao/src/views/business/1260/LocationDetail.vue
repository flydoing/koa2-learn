<template>
  <page title="定位详情"
        ref="_page">
    <template v-if="center">
      <baidu-map class="address-map"
                 :style="{'height':mapHeight}"
                 :center="center"
                 ak="ZReCCOsO5Q6IEZL3MyfdzP8o"
                 :zoom="zoom"
                 ref="_baiduMap">
        <bm-marker :position="center"
                   :top="true"
                   :icon="{url: '//m.vxiao.cn/static/ico/icon_school_locate.png', size: {width: 42, height: 58}}">
        </bm-marker>
        <bm-marker v-for="(point, i) in points"
                   :position="point"
                   :key="i"
                   :ref="getPointRef(point)"
                   @mousedown="handleMarker"
                   :icon="{url: '//m.vxiao.cn/static/ico/ico_point_small.png', size: {width: 20, height: 20}}">
          <!-- <bm-label :content="address.text"
                  :labelStyle="{borderColor: 'rgba(0,0,0,0.5)', color: '#fff', background: 'rgba(0,0,0,0.5)', fontSize : '24px'}"
                  :offset="{width: -100, height: 60}" /> -->
        </bm-marker>
        <!-- <bm-point-collection :points="points"
                             shape="BMAP_POINT_SHAPE_CIRCLE"
                             color="red"
                             :size="pointSize"
                             @click="handlePoint"></bm-point-collection> -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      </baidu-map>
    </template>
    <template v-else>
      <CardTips text="暂无内容" />
    </template>
    <div v-if="curPoint"
         class="address-info">
      <item :hasClick="false">
        <div slot="before"><img class="avatar"
               v-lazy="{src:url(curPoint.avatar),error:Image.ICO_USER}"
               alt='头像' /></div>
        <div slot="main">
          <div class="text-color"
               v-html="curPoint.name"></div>
          <div v-html="curPoint.address"></div>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { BaiduMap, BmMarker, BmNavigation } from 'vue-baidu-map'

  export default {
    mixins: [R],
    props: {},
    components: {
      BaiduMap,
      // BmPointCollection,
      BmMarker,
      BmNavigation,
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        center: null,
        points: [],
        pointData: {},
        mapHeight: 'auto',
        curPoint: null,
        zoom: 14,
        pointSize: 'BMAP_POINT_SIZE_NORMAL',
        map: null,
        BMap: null
      }
    },
    computed: {},
    mounted() {
      const that = this
      let msgId = this.routeQuery('msgId')
      let qId = this.routeQuery('qId')
      let userId = this.routeQuery('userId')
      Api.getAddressLocation(msgId, qId, userId).then(res => {
        if (res.extension) {
          let ctr = JSON.parse(res.extension)
          this.$nextTick(() => {
            this.mapHeight = `${this.$refs._page.sh}px`
            setTimeout(() => {
              that.center = { lat: ctr.latitude, lng: ctr.longtitude }
              if (Check.isRealArray(res.participants)) {
                that.points = res.participants.map(v => {
                  let address = JSON.parse(v.content)
                  this.pointData[`${address.point.lat}_${address.point.lng}`] = { ...address, avatar: v.avatar || '', name: v.userName }
                  return address.point
                })
                // that.points = [
                //   { lat: 23.130826, lng: 113.402812 },
                //   { lat: 23.133933, lng: 113.4078 },
                //   { lat: 23.125985, lng: 113.401407 },
                //   { lat: 23.131892, lng: 113.400456 },
                //   { lat: 23.128266, lng: 113.398968 },
                //   { lat: 23.123217, lng: 113.407186 },
                //   { lat: 23.131551, lng: 113.401667 },
                //   { lat: 23.123007, lng: 113.407196 },
                //   { lat: 23.124888, lng: 113.407756 }
                // ]
              }
            }, 500)
          })
        }
      })
    },
    methods: {
      getPointRef(point) {
        return `_point_${point.lat}_${point.lng}`
      },
      initMarker(BMap, map) {
        let arrMap = new Map()
        let arr = map.getOverlays()
        arr.map(v => {
          if (v.point) {
            arrMap.set(`${v.point.lat}_${v.point.lng}`, v)
          }
        })

        if (Check.isRealArray(this.points)) {
          this.points.map(v => {
            map.removeOverlay(arrMap.get(`${v.lat}_${v.lng}`))
            let icon = new BMap.Icon('//m.vxiao.cn/static/ico/ico_point_small.png', new BMap.Size(20, 20))
            let marker = new BMap.Marker(v, { icon: icon })
            marker.addEventListener('mousedown', e => {
              this.handleMarker(e)
            })
            map.addOverlay(marker)
          })
        }
      },
      handleMarker(e) {
        this.curPoint = this.pointData[`${e.target.point.lat}_${e.target.point.lng}`]

        let ref = `_point_${e.target.point.lat}_${e.target.point.lng}`
        let BMap = this.$refs[ref][0].BMap
        let map = this.$refs[ref][0].map
        this.initMarker(BMap, map)

        let icon = new BMap.Icon('//m.vxiao.cn/static/ico/ico_point_big.png', new BMap.Size(30, 30))
        let marker = new BMap.Marker(e.target.point, { icon: icon })
        marker.addEventListener('mousedown', e => {
          this.handleMarker(e)
        })
        map.addOverlay(marker)
      }
    }
  }
</script>
<style lang="scss">
  .address-map {
    width: 100%;
  }
  .address-info {
    padding: rem(5) 0;
    width: 100%;
    background: #fff;
    position: absolute;
    bottom: 0;
    z-index: 100;
    left: 0;
    .vx-item {
      &:after {
        height: 0;
      }
    }
  }
</style>
