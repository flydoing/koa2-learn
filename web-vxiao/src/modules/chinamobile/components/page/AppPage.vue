<template>
  <div class="app-page">
    <Tabs ref="_tab"
          theme="theme-2"
          :hasScroller="false"
          :value.sync="currentApp.id"
          class="tabWrapper">
      <TabPane :label="currentApp.name"
               :name="currentApp.id">
        <div id="_app_content">
          <scroller :height="scrollerHeight"
                    @scrollEnd="scrollEnd">
            <slot></slot>
          </scroller>
        </div>
      </TabPane>
      <div slot="custom-right-btn">
        <slot name="btn">
          <div v-if="hasAdd || (isShowCreate  && ((!showContacts && hasCreate)))"
               class="button btn-publish"
               @click="handlePublish">
            <i class="ico ico-plus"></i>{{hasAdd ? '新增' : '  发布'}}</div>
        </slot>
      </div>
    </Tabs>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: {
      hasAdd: { type: Boolean, default: false },
      scrollTrigger: { type: Boolean, default: false },
      showTips: { type: Boolean, default: false },
      loading: { type: Boolean, default: false }
    },
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        appModel: false
      }
    },
    computed: {
      ...mapGetters({
        menuType: 'getMenuType',
        currentApp: 'getCurrentApp',
        showContacts: 'showGroupContacts',
        getCreateApps: 'getCreateApps'
      }),
      isShowCreate() {
        return this.currentGroup.isNew === 1 || this.isAdmin
      },
      createApps() {
        return this.getCreateApps(this.groupId)
      },
      scrollerHeight() {
        return this.innerHeight - 125
      },
      hasCreate() {
        const that = this
        let app = {}
        this.createApps.forEach(v => {
          if (v.apps && Check.isNullObject(app)) {
            let a = v.apps.filter(v => {
              return v.id === that.currentApp.id
            })[0]
            app = a || {}
          }
        })
        return !Check.isNullObject(app)
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      handlePublish() {
        if (this.hasAdd) {
          this.$emit('add')
          return false
        }
        let app = this.currentApp
        if (app === null) {
          this.routePushModel({ path: '/vx/group/business/app/create' })
        } else {
          // 导播台特殊入口
          if (app.type === '1280') {
            this.routePushModel({
              path: '/vx/group/business/1280/recording',
              query: {
                appType: app.type,
                groupId: this.groupId
              }
            })
            return
          }
          this.setCreateObject({})
          this.routePushModel({
            path: '/vx/group/business/create/default',
            query: {
              appType: app.type,
              groupId: this.groupId
            }
          })
        }
      },
      scrollEnd(status) {
        if (this.scrollTrigger) {
          const $load = this.$loading({ target: '#_app_content' })
          this.$emit('scrollEnd', status, $load)
        }
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .btn-publish {
    height: rem(26);
    line-height: rem(26);
    min-width: rem(70);
    border-radius: 2px;
    .ico {
      color: #fff;
    }
  }
</style>
<style lang="scss">
  .tabWrapper {
    .vx-tab-btns {
      .left {
        line-height: rem(50) !important;
      }
      .right {
        padding-right: rem(20);
        label {
          @include fc;
          display: inline-block;
          margin-left: rem(10);
          cursor: pointer;
        }
      }
    }
  }
  .app-page {
    .model-box {
      padding: rem(0) rem(20);
      @include flex;
      @include wrap;
      background: #fff;

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
        & > div {
          display: block;
          width: 100%;
          height: 100%;
          // background: rgba(237, 246, 232, 1);
          @include appCommonBc;
          border-radius: rem(5);
          &:after {
            display: inline-block;
            content: ' ';
            height: 100%;
            vertical-align: middle;
          }
        }

        label {
          display: inline-block;
          width: 100%;
          cursor: pointer;
          padding: 0 rem(3);
          vertical-align: middle;
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
