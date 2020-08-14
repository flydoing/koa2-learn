<template>
  <Card :message="message">
    <span slot="name"
          class="text-color">{{m.name}}</span>
    <template slot="contents">
      <template v-if="signs">
        <div v-for="(sign,i) in signs"
             :sign="sign"
             :key="i"
             v-html="sign.text"></div>
      </template>
      <baidu-map v-if="signs"
                 class="map-view"
                 :center="signs[0].point"
                 ak="ZReCCOsO5Q6IEZL3MyfdzP8o"
                 :zoom="16"
                 @click="showMapPreview = true">
        <bm-marker :position="signs[0].point"
                   :dragging="true"
                   animation="BMAP_ANIMATION_BOUNCE"
                   :icon="{url: '//m.vxiao.cn/images/ico_locate2.png', size: {width: 42, height: 58}}"></bm-marker>
      </baidu-map>
    </template>
    <template slot="counter"
              v-if="signs">
      <i class="ico ico-map" />
      <span v-html="signs[0].name"></span>
    </template>
    <PreviewMap slot="other"
                v-if="signs"
                :show.sync="showMapPreview"
                :address="signs[0]" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import { BaiduMap, BmMarker } from 'vue-baidu-map'
  import Check from '@/utils/check'
  import DateUtills from '@/utils/date'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {
      BaiduMap,
      BmMarker,
      PreviewMap: resolve => require(['./PreviewMap'], resolve)
    },
    data() {
      return {
        showMapPreview: false
      }
    },
    computed: {
      m() {
        let m = this.converMessage(this.message)
        m.name = m.categoryName || m.businessName
        return m
      },
      signs() {
        let m = this.message
        let signs = []
        if (Check.isRealArray(m.positions)) {
          m.positions.forEach((s, i) => {
            if (i === 0) {
              let txt = m.msgType === '1' ? '上班' : '签到'
              signs.push({
                text: `${DateUtills.format(s.createTime, DateUtills.HM)}${txt}：${s.name}`,
                point: { lng: s.longitude, lat: s.latitude },
                name: s.name,
                type: 'in'
              })
            } else {
              let txt = m.msgType === '1' ? '下班' : '签退'
              signs.push({
                text: `${DateUtills.format(s.createTime, DateUtills.HM)}${txt}：${s.name}`,
                point: { lng: s.longitude, lat: s.latitude },
                name: s.name,
                type: 'out'
              })
            }
          })
          return signs
        }
        return false
      }
    },
    methods: {
      checkReaded() {
        if (this.address) {
          return false
        }
        return this.handleReaded
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map-view {
    width: rem(280);
    height: rem(152);
  }

  .map-icon {
    background: url($icon-url) no-repeat rem(-347) rem(-204);
    height: rem(28);
    width: rem(15);
    vertical-align: middle;
    display: inline-block;
  }
</style>
