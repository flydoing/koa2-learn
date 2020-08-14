<template>
  <Overlay :show.sync="visible"
           :width="mapWidth"
           :height="mapHeight"
           @close="handle">
    <div :style="mapStyle">
      <baidu-map class="preview-map"
                 :center="address.point"
                 ak="ZReCCOsO5Q6IEZL3MyfdzP8o"
                 :zoom="16">
        <bm-marker :position="address.point"
                   :dragging="true"
                   animation="BMAP_ANIMATION_BOUNCE"
                   :icon="{url: '//m.vxiao.cn/images/ico_locate2.png', size: {width: 42, height: 58}}">
          <bm-label :content="address.text"
                    :labelStyle="{borderColor: 'rgba(0,0,0,0.5)', color: '#fff', background: 'rgba(0,0,0,0.5)', fontSize : '24px'}"
                    :offset="{width: -100, height: 60}" />
        </bm-marker>
      </baidu-map>
    </div>
  </Overlay>
</template>
<script>
  import { BaiduMap, BmMarker, BmLabel } from 'vue-baidu-map'
  export default {
    props: {
      show: { type: Boolean, default: false },
      address: { type: [Object, Boolean] }
    },
    components: { BaiduMap, BmMarker, BmLabel },
    data() {
      return {
        visible: this.show
      }
    },
    computed: {
      mapWidth() {
        return this.innerWidth - 100
      },
      mapHeight() {
        return this.innerHeight - 100
      },
      mapStyle() {
        return { width: `${this.mapWidth}px`, height: `${this.mapHeight}px` }
      }
    },
    methods: {
      handle() {
        this.$emit('update:show', false)
      }
    },
    watch: {
      show(val) {
        this.visible = val
      }
    }
  }
</script>
<style lang="scss">
  .preview-map {
    width: 100%;
    height: 100%;
  }
</style>
