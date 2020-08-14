<template>
  <Tabs ref="_tab"
        theme="theme-2"
        :hasScroller="false"
        @click="onTabClick">
    <TabPane v-for="(tab,i) in entrances"
             :label="tab.label"
             :name="tab.name"
             :key="i"
             :badge="tab.bubbleCount">
      <Cards v-if="tab.name==='_card'" />
      <Columns v-if="tab.name==='_column'" />
      <Catalogs v-else-if="tab.name==='_catalog'" />
      <Remind v-else-if="tab.name==='_remind'"
              ref="_remind" />
      <Create v-else-if="tab.name==='_create'" />
      <About v-else-if="tab.name==='_about'" />
      <Apps v-else-if="tab.name==='_app'"
            :model="appModel" />
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
    <div v-if="!hasContacts"
         slot="custom-right-btn"
         class="ico-d-right-cont">
      <span class="ico-d-right-text"
            @click="showGroupContacts(true)">成员</span>
      <i v-if="!hasContacts"
         class="ico ico-d-right"
         @click="showGroupContacts(true)"></i>
    </div>
    <!-- <i v-if="!hasContacts"
       slot="custom-right-btn"
       class="ico ico-d-right"
       @click="showGroupContacts(true)"></i> -->
  </Tabs>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import { mapGetters, mapActions } from 'vuex'
  import R from './mixin'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      Cards: resolve => require(['./Cards'], resolve),
      Apps: resolve => require(['./app/Apps'], resolve),
      Create: resolve => require(['./create/Index'], resolve),
      About: resolve => require(['./about/Index'], resolve),
      Remind: resolve => require(['./message/Remind'], resolve),
      Columns: resolve => require(['./message/Column'], resolve),
      Catalogs: resolve => require(['@/views/business/catalog/Index'], resolve)
    },
    data() {
      return {
        appModel: false,
        tabName: ''
      }
    },
    computed: {
      ...mapGetters({
        hasContacts: 'showGroupContacts',
        notifyBubble: 'getNotifyBubble'
      }),
      showCatelog() {
        let viewType = this.currentGroup.viewType
        return viewType === '3' || viewType === '4'
      },
      entrances() {
        let group = this.currentGroup
        let tabs = [{ name: '_card', label: '最新' }]
        if (this.currentGroup.isShowApp === 0 || this.isAdmin) {
          tabs.push({
            name: '_app',
            label: '应用'
          })
        }
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
          tabs.push({ name: '_create', label: '新建' })
        }
        tabs.push({ name: '_remind', label: '提示', bubbleCount: this.bubbles.length > 0 ? `${this.bubbles.length}条新消息` : false })
        return tabs
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
      ...mapActions(['showGroupContacts', 'modifyNotify']),
      onTabClick(tab) {
        this.tabName = tab.name
        tab.name === '_app' ? (this.appModel = !this.appModel) : (this.appModel = false)
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
        this.$refs._tab.tabClick({}, 0)
      }
    }
  }
</script>
<style lang="scss" scoped>
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
