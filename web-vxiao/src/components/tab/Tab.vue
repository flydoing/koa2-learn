<template>
  <div class="vx-tabs"
       :class="theme"
       ref="box">
    <template v-if="showBtns">
      <div v-if="theme === '' || !hasScroller"
           class="vx-tab-btns">
        <div class="left">
          <div v-for="(tab,i) in navList"
               :key="i"
               :class="tabCls(tab)"
               @click="tabClick(tab,i)">
            <slot name="tabLable"
                  :tmp="tab">
              <!-- <template v-if="tab.badge">
                <span class="has-bubble"
                      v-html="tab.badge"></span>
              </template> -->
              <span>{{tab.label}}</span>
            </slot>
          </div>
        </div>
        <div class="right"
             v-if="$slots['custom-right-btn']">
          <slot name="custom-right-btn"></slot>
        </div>
      </div>
      <Scroller :width="sh"
                class="vx-tab-scroll"
                ref="_scroll_"
                v-else>
        <div class="vx-tab-btns">
          <div v-for="(tab,i) in navList"
               @click="tabClick(tab,i,$event)"
               :key="i"
               :ref="`ref_${tab.name}`"
               :class="tabCls(tab)">
            <template>{{tab.label}}</template>
          </div>
        </div>
      </Scroller>
    </template>
    <div class="vx-tab-contents"
         :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Tabs',
    props: {
      value: { type: [String, Number] },
      theme: { type: [String], default: '' },
      showBtns: { type: Boolean, default: true },
      hasScroller: { type: Boolean, default: true }
    },
    data() {
      return {
        prefixCls: '',
        navList: [],
        activeKey: this.value
      }
    },
    computed: {
      contentStyle() {
        const x = this.navList.findIndex(nav => nav.name === this.activeKey)
        const p = x === 0 ? '0%' : `-${x}00%`
        return {
          transform: `translate3d(${p}, 0px, 0px)`
        }
      },
      sh() {
        let w = 500
        if (!this.innerWidth) {
          w = window.innerWidth - 40
        } else if (this.innerWidth < w) {
          w = this.innerWidth - 40
        }
        return `${w}px`
      }
    },
    methods: {
      getTabs() {
        return this.$children.filter(item => item.$options.name === 'TabPane')
      },
      updateNav() {
        this.navList = []
        this.getTabs().forEach((pane, index) => {
          this.navList.push({
            badge: pane.badge || false,
            label: pane.label,
            name: pane.currentName || index,
            sourceData: pane.bindData || void 0
          })
          // 初始化
          if (!pane.currentName) {
            pane.currentName = index
          }
          if (index === 0) {
            if (!this.activeKey) {
              this.activeKey = pane.currentName || index
            }
          }
        })
        this.updateBar()
      },
      updateBar() {
        this.$nextTick(() => {})
      },
      tabCls(item) {
        return [
          `vx-tab-btn`,
          {
            [`vx-tab-active`]: item.name === this.activeKey
          }
        ]
      },
      tabClick(tab, i, e) {
        const nav = this.navList[i]
        if (nav.disabled) return
        this.activeKey = nav.name
        this.$emit('click', nav, nav.sourceData)
        // if (this.$refs._scroll_) {
        //   this.$nextTick(() => {
        //     this.$refs._scroll_.scrollbar.scrollIntoView(this.$refs[`ref_${this.activeKey}`][0], {
        //       offsetLeft: 200
        //     })
        //   })
        // }
      }
    },
    watch: {
      value(v) {
        this.activeKey = v
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-tabs {
    overflow: hidden;
    background: nth($background, 6);
    position: relative;
    .vx-tab {
      &-contents {
        transition-duration: 0.5s;
        @include prefixer(box-sizing, content-box);
        @include prefixer(transition-property, transform);
        @include prefixer(transform, translate3d(0, 0, 0));
        @include flex;
        display: -moz-box;
        display: -ms-flexbox;
        width: 100%;
        .vx-tab-content {
          -webkit-flex-shrink: 0;
          -ms-flex-shrink: 0 0 auto;
          flex-shrink: 0;
          width: 100%;
          position: relative;
          @include backgroudGrey;
        }
      }
      &-btns {
        @include flex;
        @include jc(space-between);
        .left {
          width: 100%;
          display: table;
          line-height: rem(40);
          table-layout: fixed;
        }
        .right {
          @include flex;
          @include jc(center);
          @include ai(center);
          min-width: rem(30);
        }
      }
      &-btn {
        display: table-cell;
        text-align: center;
        padding: rem(0) rem(10);
        background: nth($background, 2);
        cursor: pointer;
        position: relative;

        &.vx-tab-active {
          background: nth($background, 6);
          @include fc;
          &:after {
            content: ' ';
            height: rem(2);
            position: absolute;
            // bottom: rem(0);
            // width: 100%;
            left: 0;
            bottom: 5px;
            width: calc(100% - 30px);
            left: 50%;
            margin-left: calc(-50% + 15px);
            @include bc;
          }
        }
        &:last-child.vx-tab-active:after {
          width: calc(100% - 14px);
          margin-left: calc(-50% + 7px);
        }
        .has-bubble {
          @include prefixer(animation-timing-function, ease-in-out);
          @include prefixer(animation-name, breathe);
          @include prefixer(animation-duration, 0.5s);
          @include prefixer(animation-iteration-count, infinite);
          @include prefixer(animation-direction, alternate);
        }
      }
      &-scroll {
        margin: 0 auto;
      }
    }
    // tab按钮居中，
    &.theme-1 {
      .vx-tabs-labels {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
      }
      .vx-tab {
        &-btns {
          width: auto;
          display: table;
          table-layout: auto;
          margin: rem(10) auto;
          white-space: nowrap;
        }
        &-btn {
          flex-shrink: 0;
          @include borderColor;
          line-height: rem(30);
          min-width: rem(80);
          background: nth($background, 6);
          &:not(:last-child) {
            border-right: 0;
          }
          &.vx-tab-active {
            @include bc;
            color: nth($font-color, 4);
            border: 0;
          }
        }
        &-content {
          padding: 0 !important;
        }
        &-scroll {
          margin: 0 auto !important;
        }
      }
    }
    &.theme-2 {
      width: 100%;
      .vx-tab {
        &-contents {
          transition-duration: 0s;
        }
        &-btns {
          .left {
            width: auto;
            table-layout: auto;
            white-space: nowrap;
            padding: 0 rem(10);
          }
        }
        &-btn {
          background: nth($background, 6);
          width: rem(60) !important;
        }
        &-content {
          padding: rem(10) 0 0;
          background: #ededed;
        }
        &-scroll {
          margin: 0;
        }
      }
    }
  }
</style>
