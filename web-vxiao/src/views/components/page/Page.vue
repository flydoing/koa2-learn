<template>
  <div class="vx-model-page"
       ref="_page">
    <div class="vx-model-header"
         v-if="hasHeader">
      <div class="title">
        <i class="el-icon-loading"
           v-if="loading"
           style="margin-right: 5px;"></i>
        <span>{{title}}</span>
      </div>
      <i class="ico ico-left"
         v-if="hasBack"
         style="float:left;"
         @click="handleBack"></i>
      <i class="ico ico-remove"
         v-if="hasClose"
         @click="handleClose"></i>
      <i class="ico ico-submit"
         v-if="hasSubmit"
         @click="handleSubmit"></i>
      <i class="ico ico-add"
         v-if="hasAdd"
         @click="handleAdd"></i>
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
                @scrollStart="scrollStart"
                @scrolling="scrolling"
                ref="_scroll">
        <slot></slot>
        <slot name="main"></slot>
        <div class="vx-model-tips"
             v-if="showTips">
          <slot name="tips">
            <img src="/static/ico/icon_commoneuse.png" />
            <span v-html="tipText"></span>
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
  import Cammand from '@/constant/cammand'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    props: {
      title: { type: String, default: '' },
      hasBack: { type: Boolean, default: true },
      hasSubmit: { type: Boolean, default: false },
      hasClose: { type: Boolean, default: false },
      hasAdd: { type: Boolean, default: false },
      cardPage: { type: Boolean, default: false },
      listenBack: { type: Boolean, default: false },
      showTips: { type: Boolean, default: false },
      tipText: { type: String, default: '暂无内容' },
      loading: { type: Boolean, default: false },
      closePrompt: { type: Boolean, default: false },
      promptCallBack: { type: Function, default: () => {} }
    },
    data() {
      return {
        sh: '',
        hasHeader: false
      }
    },
    computed: {
      ...mapGetters(['closingPrompt'])
    },
    created() {
      this.$web.postJsAction({
        type: Cammand.ACTION_TITLE,
        content: this.title
      })
      if (this.closePrompt !== this.closingPrompt) {
        this.modifyClosingPrompt(this.closePrompt)
      }
    },
    methods: {
      ...mapActions(['modifyClosingPrompt']),
      handleBack() {
        if (!this.listenBack) {
          this.routeBack()
        }
        this.$emit('back')
      },
      handleClose() {
        this.offPage(false)
        this.$emit('close')
      },
      handleAdd() {
        this.$emit('add')
      },
      handleSubmit() {
        this.$emit('submit')
      },
      scrollEnd(status) {
        this.$emit('scrollEnd', status)
      },
      scrollStart(status) {
        this.$emit('scrollStart', status)
      },
      scrolling(status) {
        this.$emit('scrolling', status)
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
        let dom = document.querySelector('.vx-model')
        let $refs = that.$refs
        let t = $refs._top_ref ? $refs._top_ref.offsetHeight : 0
        let b = $refs._btm_ref ? $refs._btm_ref.offsetHeight : 0
        let h = this.innerHeight - t - b

        if (dom) {
          this.hasHeader = true
          h = dom.getBoundingClientRect().height - t - b - 40
        }
        that.sh = h
        // 给父级页面返回当前页面的可是区域的高度
        this.$parent.maxHeight = h
        this.$emit('height', h)
      })
    }
  }
</script>
