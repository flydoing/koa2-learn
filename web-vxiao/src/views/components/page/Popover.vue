<template>
  <div class="vx-model-page popover">
    <div class="vx-model-header">
      <div class="title">
        <i class="el-icon-loading"
           v-if="loading"></i>{{title}}
      </div>
      <i class="ico ico-left"
         v-if="hasBack"
         style="float:left;"
         @click="handleBack"></i>
      <slot name="ico-btn">
        <label v-if="hasSubmit"><i @click="handleSubmit"
             class="ico ico-submit"></i></label>
      </slot>
      <div class="btn"
           v-if="$slots.btn">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="vx-model-top"
         ref="_top_ref">
      <slot name="top"></slot>
    </div>
    <div class="vx-model-middle"
         ref="_mid_ref">
      <scroller :height="sh"
                @scrollEnd="scrollEnd"
                ref="_scroll">
        <slot></slot>
        <div class="vx-model-tips"
             v-if="showTips">
          <slot name="tips">
            <img src="/static/ico/icon_commoneuse.png" />
            <span>暂无内容</span>
          </slot>
        </div>
      </scroller>
    </div>
    <div class="vx-model-bottom"
         v-if="$slots.bottom"
         ref="_btm_ref">
      <slot name="bottom"></slot>
    </div>
    <slot name="other"></slot>
  </div>
</template>
<script>
  export default {
    props: {
      ht: { type: Number },
      title: { type: String, default: '' },
      showTips: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
      hasSubmit: { type: Boolean, default: true },
      hasBack: { type: Boolean, default: false }
    },
    data() {
      return {
        sh: ''
      }
    },
    computed: {
      scrollHeight() {
        return this.ht || this.innerHeight / 3
      }
    },
    created() {},
    methods: {
      handleSubmit() {
        this.$emit('submit')
      },
      handleBack() {
        this.$emit('back')
      },
      scrollEnd(status) {
        this.$emit('scrollEnd', status)
      },
      getScroll() {
        return this.$refs._scroll.scrollbar
      }, // 获取滚动条
      getScroller() {
        return this.$refs._scroll
      } // 获取滚动条Vue组件对象
    },
    mounted() {
      const that = this
      that.$nextTick(() => {
        let $refs = that.$refs
        let t = $refs._top_ref ? $refs._top_ref.offsetHeight : 0
        let b = $refs._btm_ref ? $refs._btm_ref.offsetHeight : 0
        this.sh = this.scrollHeight - t - b
      })
    }
  }
</script>
<style lang="scss" scoped>
  .vx-model {
    &-page.popover {
      width: 100%;
      position: relative;
    }

    &-middle {
      width: 100%;
    }

    &-bottom {
      width: 100%;
    }

    &-header {
      position: relative;
      height: rem(40);
      line-height: rem(40); // border-bottom: $border;

      .title {
        position: absolute;
        width: 100%;
        height: 100%;
        @include flex;
        @include jc;
      }
    }
  }
</style>
