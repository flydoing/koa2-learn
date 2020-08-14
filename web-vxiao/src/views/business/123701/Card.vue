<template>
  <Card :message="message"
        :parentType="1237">
    <template slot="contents">
      <baidu-map v-if="signs[0]"
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
    <CardHref v-if="!signs"
              content="查看详情"
              @click="handleDetail" />
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
      PreviewMap: resolve => require(['../1033/PreviewMap'], resolve)
    },
    data() {
      return {
        showMapPreview: false
      }
    },
    computed: {
      signs() {
        let m = this.message
        let signs = []
        if (Check.isRealArray(m.positions)) {
          m.positions.forEach((s, i) => {
            if (s.longitude && s.latitude) {
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
            }
          })
          return signs
        }
        return false
      }
    },
    methods: {
      handleDetail() {
        let m = this.message
        this.routePushModel({
          path: `/vx/group/business/report/message/detail/1`,
          query: {
            appType: '1237',
            appName: m.businessName,
            fromUserId: this.userId,
            msgId: m.id,
            groupId: m.groupId,
            noTempletReport: 1
          }
        })
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
