<template>
  <div class='vx-index'
       v-loading.fullscreen.lock="loading">
    <THeader />
    <div class="vx-bannar"
         :style="t"
         v-lazy:background-image="bannarUrl">
      <div v-lazy:background-image="bannarUrl"></div>
    </div>
    <div class="vx-container"
         :class="[{'has-contacts':!hasContacts}]">
      <div class="vx-menu">
        <Scroller :height="menuHeight">
          <ItemText icon="ico-im"
                    @click="onIm">
            <span slot="text">消息</span>
            <div slot="after"
                 :class="prefixImBubble">{{imBubble.length}}</div>
          </ItemText>
          <GroupList />
          <ItemText icon="ico-plus"
                    @click="onAddGroup">
            <span slot="text">添加</span>
          </ItemText>
        </Scroller>
      </div>
      <router-view name="space"></router-view>
    </div>
  </div>
</template>
<script>
  import VXSocket from '@/channel'
  import GroupList from '@/views/group/List'
  import ItemText from '@/components/item/ItemText'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      GroupList,
      ItemText,
      THeader: resolve => require(['./Header'], resolve)
    },
    data: function() {
      return {
        channel: null,
        loading: true,
        showToken: true // 避免tokenId失效，并发请求多次校验，弹窗控制
      }
    },
    computed: {
      ...mapGetters({
        online: 'getDownLine',
        hasContacts: 'showGroupContacts',
        imBubble: 'im/getImBubble',
        currentGroup: 'getCurrentGroup'
      }),
      bannarUrl() {
        // return '/static/bg/bg.png'
        return this.currentGroup && this.currentGroup.logo ? this.url(this.currentGroup.logo) : '/static/bg/bg.png'
      },
      t() {
        let _h = this.innerHeight * (1 - 0.618) + 50 // 黄金比例
        return {
          height: `${_h}px`
        }
      },
      prefixImBubble() {
        return [
          `bubble`,
          {
            'has-bubble': this.imBubble.length > 0
          }
        ]
      },
      menuHeight() {
        return this.innerHeight - 75
        // - 35
      }
    },
    beforeCreate() {
      const that = this
      this.$store.dispatch('initLocatStorage').then(
        () => {
          // 数据初始化
          that.getUserTypes()
          that.getUserBase().then(() => {
            that.loading = false
            // 初始化未读消息
            that.loadStorageMesasges()
            that.initGroupCache(this.USER.id)
          })
          that.$router.push({
            path: '/vx/'
          })
        },
        () => {
          that.$router.push({
            path: '/'
          })
        }
      )
    },
    methods: {
      ...mapActions(['resize', 'getUserTypes', 'initGroupCache', 'getUserBase', 'socketAction', 'loadStorageMesasges', 'showGroupContacts']),
      onIm() {
        this.routePushModel({
          path: '/vx/im'
        })
      },
      onAddGroup() {
        this.routePushModel({
          path: '/vx/group/add'
        })
      }
    },
    mounted() {
      const that = this
      this.channel = new VXSocket(this.baseInfo.WS_URL, this.baseInfo.ACCOUNT, this.baseInfo.TOKENID, this.baseInfo.CLIENTID, message => {
        that.socketAction(message)
      })
      this.channel.connect()
      this.resize()
      window.onresize = () => {
        return (() => {
          that.resize()
        })()
      }
    },
    destroyed() {
      this.channel.close()
    },
    watch: {
      online(v) {
        if (this.showToken) {
          this.showToken = false
          // 踢下线通知
          this.$alert(v.content, '提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              this.showToken = true
              if (v.type === '6') {
                this.offPage(false)
                setTimeout(() => {
                  this.routeReplace({ path: '/login' })
                })
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-index {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #ededed;
    .vx-bannar {
      top: 0;
      width: 100%;
      overflow: hidden;
      position: absolute;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center;
      background-size: cover;
      @include bc;

      div {
        top: 0;
        width: 120%;
        height: 120%;
        position: absolute;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
        -webkit-filter: blur(10px);
        -moz-filter: blur(10px);
        -ms-filter: blur(10px);
        filter: blur(10px);
      }
    }
  }
  .vx-container {
    width: rem(1300);
    height: 100%;
    margin: 0 auto;
    position: relative;
    @include flex;
    @include ai(center);
    @include jc(flex-start);
    @include after() {
      height: 100%;
      width: 100%;
      background: nth($background, 1);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 0;
    }
    & > div {
      position: relative;
      z-index: 1;
    }
    &.has-contacts {
      width: rem(1300-280-10);
    }
  }
  .vx-menu {
    width: rem(280);
    min-width: rem(280);
    max-width: rem(280);
    height: 100%;
    overflow: hidden;
    position: relative;
    background: nth($background, 6);
  }
  .vx-space {
    @include flex;
    @include ai(center);
    @include jc(flex-start);
    margin-left: rem(10);
  }
  .vx-main {
    width: rem(1300-280-280-20);
    &-header {
      width: 100%;
      position: relative;
      line-height: rem(40);
      padding: 0 rem(10);
      overflow: hidden;
      margin-bottom: rem(10);
      background: nth($background, 6);
      z-index: 10;
      .ico {
        float: right;
        cursor: pointer;
        line-height: rem(40);
      }
    }
  }
  .vx-contacts {
    width: rem(280);
    min-width: rem(280);
    position: relative;
    margin-left: rem(10);
    &:after {
      content: '';
      top: 0;
      left: rem(-10);
      width: rem(10);
      height: rem(40);
      position: absolute;
      background: nth($background, 6);
    }
  }
  .vx-quit {
    // cursor: pointer;
    // line-height: rem(35);
    // height: rem(35);
    // text-align: center;
    color: nth($font-color, 5);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    .ico {
      font-size: rem(16);
      color: nth($font-color, 5);
    }
  }
  .point,
  .bubble {
    top: rem(1);
    right: rem(2);
    height: rem(18);
    line-height: rem(18);
    width: rem(20);
    border-radius: rem(18);
    text-align: center;
    font-size: rem(10);
    background: nth($background, 10);
    color: nth($background, 6);
    transform: scale(0.3, 0.3);
    -webkit-transform: scale(0.3, 0.3);
    transition: all cubic-bezier(0.29, 0.59, 0.43, 1.49) 0.5s;
    -webkit-transition: all cubic-bezier(0.29, 0.59, 0.43, 1.49) 0.5s;
  }

  .bubble {
    font-size: rem(12);
    float: right;
    opacity: 0;
    filter: alpha(opacity=0);
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    transition: all ease-out 0.5s;
    position: relative;
  }

  .redot-bubble {
    height: rem(6);
    width: rem(6);
    border-radius: rem(6);
    background: nth($background, 10);
  }

  .has-point.point,
  .has-bubble.bubble,
  .redot-bubble.bubble {
    opacity: 1;
    filter: alpha(opacity=100);
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
</style>
