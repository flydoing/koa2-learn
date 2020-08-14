<template>
  <Tabs v-if="isHomePage || showContacts"
        ref="_tab"
        theme="theme-2"
        :hasScroller="false"
        :value.sync="curEntrance.name"
        :showBtns="entrances.length > 0"
        @click="onTabClick"
        class="tabWrapper">
    <TabPane v-for="(tab,i) in entrances"
             :label="tab.label"
             :name="tab.name"
             :key="i"
             :badge="tab.bubbleCount">
      <GroupContacts v-if="tab.name==='_member'" />
      <Cards v-else-if="tab.name==='_card'" />
      <!-- <AppCard v-else-if="tab.name==='_app_card'" /> -->
      <Columns v-else-if="tab.name==='_column'" />
      <Catalogs v-else-if="tab.name==='_catalog'" />
      <Reports v-else-if="tab.name==='_app_report'" />
      <Remind v-else-if="tab.name==='_remind'"
              ref="_remind" />
      <!-- <Create v-else-if="tab.name==='_create'" /> -->
      <About v-else-if="tab.name==='_about'" />
      <!-- <Apps v-else-if="tab.name==='_app'"
      :model="appModel" /> -->
    </TabPane>
    <template slot="tabLable"
              slot-scope="{tmp}">
      <template v-if="tmp.badge">
        <span class="has-bubble"
              v-html="tmp.badge"></span>
        <span v-if="tabName === tmp.name"
              style="color:#444;"
              @click.stop="onClear">&nbsp;&nbsp;清空</span>
      </template>
      <span v-else>{{tmp.label}}</span>
    </template>
    <!-- <div v-if="!hasContacts"
         slot="custom-right-btn"
         class="ico-d-right-cont">
      <span class="ico-d-right-text"
            @click="showGroupContacts(true)">成员</span>
      <i v-if="!hasContacts"
         class="ico ico-d-right"
         @click="showGroupContacts(true)"></i>
    </div> -->
    <!-- <i v-if="!hasContacts"
       slot="custom-right-btn"
       class="ico ico-d-right"
       @click="showGroupContacts(true)"></i> -->
    <div v-if="isShowCreate  && (isHomePage || (!showContacts && hasCreate))"
         class="button btn-publish"
         slot="custom-right-btn"
         @click="handlePublish">
      <i class="ico ico-plus"></i>发布</div>
  </Tabs>
  <AppsDetail v-else />
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      // Cards: resolve => require(['@/views/group/Cards'], resolve),
      Cards: resolve => require(['./Cards'], resolve), // 中移动版本去掉搜索框
      AppCard: resolve => require(['@/modules/chinamobile/group/AppCard'], resolve),
      // Apps: resolve => require(['@/views/group/app/Apps'], resolve),
      // Create: resolve => require(['@/views/group/create/Index'], resolve),
      About: resolve => require(['@/views/group/about/Index'], resolve),
      Remind: resolve => require(['@/views/group/message/Remind'], resolve),
      Columns: resolve => require(['@/views/group/message/Column'], resolve),
      Catalogs: resolve => require(['@/views/business/catalog/Index'], resolve),
      Reports: resolve => require(['./report/Index'], resolve),
      GroupContacts: resolve => require(['@/views/group/Contacts'], resolve),
      AppsDetail: resolve => require(['@/views/group/app/AppsDetail'], resolve)
    },
    data() {
      return {
        appModel: false,
        tabName: '',
        isShowCreate: false
      }
    },
    computed: {
      ...mapGetters({
        menuType: 'getMenuType',
        showContacts: 'showGroupContacts',
        currentApp: 'getCurrentApp',
        notifyBubble: 'getNotifyBubble',
        getCreateApps: 'getCreateApps'
      }),
      createApps() {
        return this.getCreateApps(this.groupId)
      },
      isHomePage() {
        return this.menuType === '1'
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
      },
      showCatelog() {
        let viewType = this.currentGroup.viewType
        return viewType === '3' || viewType === '4'
      },
      entrances() {
        if (this.showContacts) {
          return [{ name: '_member', label: '成员' }]
        }

        const that = this
        let tabs = []
        let group = this.currentGroup

        tabs.push({ name: '_card', label: '最新' })
        // if (this.currentGroup.isShowApp === 0 || this.isAdmin) {
        //   tabs.push({
        //     name: '_app',
        //     label: '应用'
        //   })
        // }
        // 学校类型的群组，添加栏目
        this.isOrg &&
          tabs.push({
            name: '_column',
            label: '栏目'
          })
        // 课程类型的群组，添加目录
        if ((this.isCourse || this.isClass || this.isOrdinary) && this.showCatelog) {
          tabs.push({
            name: '_catalog',
            label: '目录'
          })
        }
        tabs.push({ name: '_about', label: '关于' })
        if (group.isNew === 1 || this.isAdmin) {
          // tabs.push({ name: '_create', label: '新建' })
          // tabs.push({ name: '_create', label: '新建' })
          that.isShowCreate = true
        }
        tabs.push({ name: '_remind', label: '提示', bubbleCount: this.bubbles.length > 0 ? `${this.bubbles.length}条新消息` : false })
        return tabs
      },
      curEntrance() {
        return this.entrances[0] || {}
      },
      isCreate() {
        if (this.isAdmin) {
          return true
        }
        // 如果是学生，则成员新建和学生新建都得打开
        if (this.userRelation.userType === '4') {
          return this.currentGroup.isNew === 1 && this.currentGroup.isStudentNew === 1
        }
        return this.currentGroup.isNew === 1
      },
      bubbles() {
        return (
          this.notifyBubble.filter(m => {
            return m.groupId === this.currentGroup.groupId && m.status !== 'd' && m.status !== '4'
          }) || []
        )
      }
    },
    methods: {
      ...mapActions(['setMenuType', 'modifyNotify', 'setCreateObject', 'showGroupContacts']),
      handlePublish() {
        this.routePushModel({ path: '/vx/group/business/app/create' })
      },
      onTabClick(tab) {
        this.tabName = tab.name
        if (tab.name === '_remind') {
          this.$refs._remind[0].initHistory()
        }
        if (tab.name === '_remind' && this.bubbles.length === 1) {
          let type = this.bubbles[0].msgType === '27' ? 2 : 1
          // handle(m, isTodo) // 是否待办isTodo: 1不是，2是
          this.$refs._remind[0].handle(this.bubbles[0], type)
        }
      },
      onClear() {
        this.bubbles.some(m => {
          // 只清空消息，待办的不清空
          if (m.msgType === '27') {
            // 待办的不清空
          } else {
            this.modifyNotify(m)
          }
        })
        // this.bubbles.some(m => {
        //   this.modifyNotify(m)
        // })
      }
    },
    watch: {
      currentGroup() {
        if (this.showContacts || this.isHomePage) {
          this.$nextTick(() => {
            this.$refs._tab.tabClick({}, 0)
          })
        }
      },
      menuType() {
        if (this.showContacts || this.isHomePage) {
          this.$nextTick(() => {
            this.$refs._tab.tabClick({}, 0)
          })
        }
      }
    }
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
      margin-right: rem(5);
    }
  }
  .ico-d-right-cont {
    width: 50px;
  }
  .ico-d-right-text {
    color: #9f9f9f;
    cursor: pointer;
  }
  .ico-d-right-text:hover {
    color: #00c162;
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
      }
    }
  }
</style>
