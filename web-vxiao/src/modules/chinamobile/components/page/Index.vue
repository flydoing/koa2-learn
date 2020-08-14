<template>
  <Overlay @close="handleClose"
           ref="_model_page"
           :show="visible"
           :top="top"
           :width="wth">
    <div class="vx-model"
         v-drag="{targetClass:'title'}"
         :style="prefixStyle">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </Overlay>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Drag from '@/directives/drag'
  export default {
    directives: { Drag },
    props: {
      showKey: { type: [String, Number] },
      height: { type: Number }
    },
    data() {
      return {
        top: 125,
        dragClass: '',
        visible: this.show,
        wth: 500
      }
    },
    computed: {
      ...mapGetters({ show: 'showPage' }),
      ...mapGetters(['closingPrompt']),
      prefixStyle() {
        let _h = this.innerHeight - 125 - 52
        return {
          height: `${_h}px`
        }
      }
    },
    methods: {
      handleClose() {
        if (this.closingPrompt) {
          this.$confirm('是否关闭当前页？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.onCloseEvent()
          })
        } else {
          this.onCloseEvent()
        }
      },
      onCloseEvent() {
        let i = 0
        this.$route.matched.some(match => {
          if (
            match.path !== '/vx' &&
            match.path !== '/vx/' &&
            match.path !== '/vx/im' &&
            match.path !== '/vx/user' &&
            match.path !== '/vx/group' &&
            match.path !== '/vx/group/user' &&
            match.path !== '/vx/group/business'
          ) {
            i--
          }
        })
        this.routeBack(i)
        this.visible = false
      }
    },
    mounted() {
      this.wth = 720
    },
    watch: {
      show(v) {
        this.visible = v
      },
      visible(v) {
        this.offPage(v)
      },
      '$route.path'(v) {
        if (v.indexOf('/vx/im') >= 0 || v.indexOf('/vx/user') >= 0) {
          this.top = 25
        } else {
          this.top = 125
        }
      },
      '$route.meta.span'(v) {
        if (v) {
          this.wth = 1050
        } else {
          this.wth = 720
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-model {
    position: relative;
    padding-top: rem(40);
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);

    &-menu {
      @include flex;
      @include jc;
      @include ai(flex-start);
    }

    &-menu,
    &-page {
      margin: 0 auto;
      .vx-model-page {
        box-shadow: none !important;
      }
    }
    &-page {
      border-bottom-left-radius: rem(5);
      border-bottom-right-radius: rem(5);
      overflow: hidden;
    }
    &-radius {
      border-bottom-left-radius: rem(0);
    }

    &-page {
      background: #fff;
    }

    &-left {
      width: rem(280);
      background: #fff;
      border-right: rem(1) solid #eee;
      border-bottom-left-radius: rem(5);
      overflow: hidden;
    }

    &-center {
      width: rem(1040-280);
      .vx-model-page {
        width: 100% !important;
        box-shadow: none !important;
      }
    }

    &-header {
      border-top-left-radius: rem(5);
      border-top-right-radius: rem(5);
      @include bc;
      color: #fff;
      line-height: rem(40);
      height: rem(40);
      font-size: rem(14);
      position: absolute;
      width: 100%;
      top: rem(0);
      left: 0;
      right: 0;
      z-index: 99;

      & > div {
        display: inline-block;
      }

      .title {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        z-index: 0;
      }

      &-middle {
        width: 100%;
      }

      &-bottom {
        width: 100%;
      }

      .btn {
        position: relative;
        padding: rem(0) rem(10);
        float: right;
        // height: 100%;
        @include ct;
        label {
          margin-left: rem(10);
          cursor: pointer;
        }
        & > div {
          @include flex;
          height: rem(40);
          overflow: hidden;
        }
      }

      .ico {
        float: right;
        color: #fff;
        margin: 0 rem(8);
        font-size: rem(18);
        line-height: rem(40);
        position: relative;
        &:hover {
          color: #fff;
        }
      }
    }

    .model-box {
      padding: rem(0) rem(20);
      @include flex;
      @include wrap;

      &-block {
        @include ct;
        @include fd;
        cursor: pointer;
        height: rem(50);
        margin: rem(10) 0;
        border-radius: rem(5);
        text-align: center;
        position: relative;
        @include fh(100);
        @include after {
          left: rem(5);
          right: rem(5);
          height: 100%;
          z-index: -1;
          border-radius: rem(5);
          background: rgba(254, 245, 231, 1);
        }

        label {
          display: block;
          cursor: pointer;
          padding: 0 rem(3);
          line-height: rem(18) !important;
          @include fh;
        }

        .remark {
          font-size: rem(12);
          line-height: rem(12);
          color: nth($font-color, 7);
        }

        &.def {
          &:after {
            background: rgba(237, 246, 232, 1);
          }
        }
      }
    }
  }
</style>
