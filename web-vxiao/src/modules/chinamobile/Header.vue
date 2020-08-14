<template>
  <div class="vx-header">
    <div class="vx-header-container">
      <el-row type="flex"
              justify="center">
        <el-col class="vx-header-block">
          <el-popover placement="bottom-start"
                      width="336"
                      trigger="click"
                      ref="popover"
                      :arrowOffset="arrowOffset"
                      v-model="showGroups">
            <scroller :height="500">
              <div class="vx-header-search-group">
                <i class="ico ico-search"></i>
                <input class="search-group"
                       v-model="searchGroupText"
                       placeholder="搜索" />
              </div>
              <GroupList @click="handleGroup"
                         :keyword="searchGroupText"
                         v-on:allBubbleCountList="allBubbleCountHeader" />
              <ItemText icon="ico-plus"
                        @click="onAddGroup">
                <span slot="text">添加</span>
              </ItemText>
            </scroller>
            <div class="vx-header-group"
                 slot="reference">
              <div class="navMenuWrapper">
                <span class="menu">
                  <i class="bubble-count"
                     v-if="allBubbleCount > 0">{{allBubbleCount>99?`...`:allBubbleCount}}</i>
                </span>
              </div>
              <span>中移智慧校园</span>
              <i class="ico ico-down"></i>
            </div>
          </el-popover>
        </el-col>
        <el-col class="vx-header-main">
          <el-popover placement="bottom-start"
                      :arrowOffset="arrowOffset"
                      width="550"
                      trigger="manual"
                      v-model="showSearchResult">
            <scroller :height="600">
              <div v-if="searchLoading">搜索加载中...</div>
              <div v-else-if="!searchLoading && searchResult.relations.length === 0 && searchResult.messages.length === 0 && searchApps.length <= 0">暂无内容...</div>
              <div v-else>
                <div v-if="searchApps.length > 0"
                     @click="handleShowSearchResult">
                  <div class="category-title text">应用</div>
                  <div class="app-box">
                    <template>
                      <div class="app-list">
                        <div class="app-block"
                             v-for="(app,j) in searchApps"
                             :key="j"
                             @click="onApp(app)">
                          <img class="avatar"
                               v-lazy="{src:url(app.cardShowLogo),error:Image.ICO_AVATAR}" />
                          <div class="app-name">{{app.name}}</div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-if="searchResult.relations.length > 0">
                  <div class="category-title text">成员</div>
                  <ItemList class="contact-user"
                            v-for="u in searchResult.relations"
                            :key="u.userId"
                            @click="onUser(u)">
                    <img slot="avatar"
                         class="avatar"
                         v-lazy="{src:url(u.avatar),error:Image.ICO_USER}">
                    <span slot="title">{{u.name}}</span>
                    <span slot="main">{{u | filterType}}</span>
                    <span slot="remark"></span>
                    <span slot="describe">{{u.subject}}</span>
                    <template slot="after">&nbsp;</template>
                  </ItemList>
                </div>
                <div v-if="searchResult.messages.length > 0"
                     @click="handleShowSearchResult">
                  <div class="category-title text">消息</div>
                  <!-- <CardList :messages="searchResult.messages"></CardList> -->
                  <ItemList v-for="m in searchResult.messages"
                            :key="m.id"
                            @click="handle(m, 2)">
                    <img slot="avatar"
                         class="avatar"
                         v-lazy="{src:url(m.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
                         alt='LOGO'>
                    <span slot="title"
                          v-html="titleTxt(m)"></span>
                    <span slot="remark">{{m.time}}</span>
                    <span slot="main"
                          v-html="changeAnd(m.content)"></span>
                    <template slot="after">&nbsp;</template>
                  </ItemList>
                  <item v-if="searchResult.messages.length >= 3"
                        @click="handleMoreMessage">
                    <div slot="main">搜索更多消息</div>
                    <div slot="remark"></div>
                  </item>
                </div>

              </div>
            </scroller>
            <div class="vx-header-search"
                 slot="reference"
                 :class="prefixCls">
              <i class="ico ico-search"></i>
              <input class="search"
                     @click="handleClickSearch"
                     v-model="searchText"
                     placeholder="搜索成员、应用、消息" />
              <!-- <input class="search"
                     v-model="searchText"
                     @focus="prefixCls='s active'"
                     @blur="prefixCls='s'" /> -->
            </div>
          </el-popover>
          <!-- <div class="vx-header-search"
               :class="prefixCls">
            <i class="ico ico-search"></i>
            <input class="search"
                   v-model="searchText"
                   @focus="prefixCls='s active'"
                   @blur="prefixCls='s'" />
          </div> -->
        </el-col>
        <el-col class="vx-header-block">
          <div class="vx-header-u">
            <span class="im-item"
                  @click="onIm"><i v-if="imBubble.length>0">{{imBubble.length>99?`...`:imBubble.length}}</i></span>
            <span class="user-item"
                  @click="onSelf">
              <img class="avatar smaller"
                   v-lazy="{src:url(USER.avatar,'thumb'),error:Image.ICO_AVATAR}" />
              <label v-html="USER.name"></label>
              <!-- <i class="ico ico-down"></i> -->
            </span>

            <!-- <span class="quit-label"
                  @click.stop="onQuit">退出</span> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 遮罩层 -->
    <div v-if="showGroups || showSearchResult"
         @click="handleHidePopover"
         class="vx-popover-header"></div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import GroupList from './List'
  import ItemText from '@/components/item/ItemText'
  import Text from '@/utils/text'
  // import * as Storage from '@/utils/storage'
  export default {
    components: {
      GroupList,
      ItemText,
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        arrowOffset: 30,
        searchText: '',
        prefixCls: 's',
        customizationLogin: '',
        showGroups: false,
        showSearchResult: false,
        timer: false,
        currentPage: 1,
        // 搜索
        searchResult: {
          relations: [],
          messages: []
        },
        searchLoading: false,
        model: true,
        searchGroupText: '',
        allBubbleCount: 0
      }
    },
    filters: {
      filterType(u) {
        return u.studentNo || u.mobile || ''
      }
    },
    computed: {
      ...mapGetters({
        currentGroup: 'getCurrentGroup',
        groups: 'getGroupMenus',
        imBubble: 'im/getImBubble',
        hasContacts: 'showGroupContacts',
        globalSearchText: 'globalSearch',
        getGroupsApps: 'getGroupsApps',
        notifyBubble: 'getNotifyBubble'
      }),
      curGroup() {
        let cgp = this.currentGroup
        if (this.groups.length > 0) {
          let gp = this.groups.filter(v => {
            return v.groupId === cgp.groupId
          })[0]
          return { ...cgp, ...(gp || {}) }
        }
        return cgp
      },
      // allBubbleCount() {
      //   return (
      //     this.notifyBubble.filter(m => {
      //       return m.status !== 'd' && m.status !== '4'
      //     }) || []
      //   )
      // },
      searchApps() {
        let search = this.searchText.toLowerCase()
        let apps = this.getGroupsApps(this.curGroup.groupId)
        let arr = this.model ? apps : this.categorys
        if (!arr) {
          return []
        }
        if (search) {
          arr = []
          if (this.model) {
            arr = apps.filter(app => {
              return (
                String(app.name)
                  .toLowerCase()
                  .indexOf(search) > -1 ||
                String(app.type)
                  .toLowerCase()
                  .indexOf(search) > -1
              )
            })
          } else {
            this.categorys.forEach(c => {
              let apps = c.apps.filter(app => {
                return (
                  String(app.name)
                    .toLowerCase()
                    .indexOf(search) > -1 ||
                  String(app.type)
                    .toLowerCase()
                    .indexOf(search) > -1
                )
              })
              if (Check.isRealArray(apps)) {
                arr.push({ ...c, ...{ apps: apps } })
              }
            })
          }
        } else {
          arr = []
        }
        return arr
      }
    },
    mounted() {
      this.customizationLogin = localStorage.getItem('customizationLogin')
    },
    methods: {
      ...mapActions(['globalSearch', 'setCurrentApp']),
      allBubbleCountHeader(data) {
        this.allBubbleCount = data
      },
      handleGroup(g) {
        this.showGroups = false
        this.showSearchResult = false
      },
      handleShowSearchResult() {
        this.showSearchResult = false
      },
      handleClickSearch() {
        if (this.searchResult.relations.length > 0 || this.searchResult.messages.length > 0 || this.searchApps.length > 0) {
          this.showSearchResult = true
          this.searchLoading = false
        }
      },
      handleHidePopover() {
        this.showSearchResult = false
        this.showGroups = false
      },
      onIm() {
        this.showSearchResult = false
        this.routePushModel({
          path: '/vx/im'
        })
      },
      handleMoreMessage() {
        // 跳转到更多
        this.showSearchResult = false
        this.offPage(true)
        this.routePushModel({
          path: '/vx/group/base/search',
          query: { keyword: this.searchText, groupId: this.curGroup.groupId }
        })
      },
      onSelf() {
        this.showSearchResult = false
        this.offPage(true)
        this.routePush({
          path: '/vx/user/self',
          query: { title: '我的信息' }
        })
      },
      onQuit() {
        this.offPage(false)
        this.$http.get('/base/user/logout')
        setTimeout(() => {
          if (window.dataModule.indexOf('tianhe.html') > -1) {
            location.href = '/tianhe.html#/'
          } else if (window.dataModule.indexOf('chinamobile.html') > -1) {
            location.href = '/chinamobile.html#/'
          } else if (this.customizationLogin === 'loginDzbp') {
            localStorage.removeItem('customizationLogin')
            location.href = '/'
          } else {
            location.href = '/'
          }
        })
      },
      complexSearch() {
        // 显示弹窗，内容是否为空
        if (!this.curGroup.groupId) {
          this.$message({ type: 'warning', message: '请先选择群组再搜索' })
        }
        if (!this.searchText) {
          this.searchResult = {
            relations: [],
            messages: []
          }
          return
        }
        if (this.searchApps.length <= 0) {
          this.searchLoading = true
        }
        // this.searchLoading = true
        // 变量
        Api.complexSearch(this.curGroup.groupId, this.searchText).then(res => {
          this.searchResult = {
            relations: [],
            messages: []
          }
          if (res.code === '1') {
            // console.log(this.curGroup.groupId + ':getGroupApps===》')
            this.searchResult = Object.assign(this.searchResult, res)
            // 显示搜索框
            if (this.searchResult.relations.length > 0 || this.searchResult.messages.length > 0 || this.searchApps.length > 0) {
              this.showSearchResult = true
              this.searchLoading = false
            } else {
              this.showSearchResult = false
              this.searchLoading = false
            }
          }
        })
      },
      onUser(user) {
        this.showSearchResult = false
        this.routePush({
          name: 'userDetail',
          params: { userId: user.userId },
          query: {
            title: user.name,
            groupId: user.groupId
          }
        })
      },
      onAddGroup() {
        this.showGroups = false
        this.routePushModel({
          path: '/vx/group/add'
        })
      },
      // 更换消息条
      changeAnd(value) {
        return Text.changeAnd(value)
      },
      titleTxt(ms) {
        // return `${ms.fromUserName || ''}${this.changeAnd(ms.title)}`
        return `${ms.fromUserName || ''} ${this.changeAnd(ms.businessName)}`
      },
      handle(m, isTodo) {
        // // 是否待办isTodo: 1不是，2是
        // if (isTodo === 1) {
        //   this.modifyNotify(m)
        //   this.loadMoreHistoryText = '加载历史已读消息...'
        // }
        if (m.extension === 'report') {
          let q = JSON.parse(m.extensionType)
          this.routePush({
            path: '/vx/group/business/report/message/detail/1',
            query: { ...q, groupId: this.curGroup.groupId, appType: q.type }
          })
        } else if (m.type === '26') {
          this.setStorage('_cache_batch_face', m)
          this.routePush({
            path: '/vx/group/user/batch/face/detail'
          })
        } else if (m.parentId || m.id) {
          this.routePush({
            path: '/vx/group/remind/detail',
            query: {
              id: m.parentId || m.id
            }
          })
        } else {
          this.$message({ type: 'warning', message: '该消息已经被删除' })
        }
      },
      // 点击app
      onApp(app) {
        this.setStorage('_app_toScroll', true)
        this.setCurrentApp(app)
      }
    },
    watch: {
      searchText(val) {
        let that = this
        if (val !== that.globalSearchText) {
          this.searchLoading = true
          if (!that.timer) {
            that.timer = true
            setTimeout(function() {
              that.timer = false
              that.complexSearch()
            }, 400)
          }
        }
      },
      currentGroup(val) {
        this.searchText = ''
        this.searchResult = {
          relations: [],
          messages: []
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-header {
    position: relative;
    line-height: rem(50);
    margin-bottom: rem(25);
    color: #fff;
    z-index: 3;
    background: url('/static/websize/cm/nav.png') no-repeat;
    background-size: 100%;
    &-container {
      margin: 0 auto;
      width: rem(1040);
      &.has-info {
        width: rem(1040-336-20);
        .vx-header-main {
          width: rem(1040-336-336-336);
        }
      }
    }
    &-group {
      cursor: pointer;
      .ico {
        // margin-left: rem(5);
        color: #fff;
        vertical-align: middle;
        &:hover {
          color: #fff;
        }
      }
      span {
        vertical-align: middle;
      }
      .navMenuWrapper {
        margin-right: rem(16);
        display: inline-block;
        .menu {
          display: inline-block;
          width: rem(26);
          height: rem(26);
          background: url('/static/images/chinaMobile/index-logo.png') no-repeat center;
          position: relative;
        }
        .menu:hover {
          color: #ffffff;
        }
        .bubble-count {
          transform: translateY(-50%) translateX(100%);
          position: absolute;
          top: rem(0);
          right: rem(10);
          background: #ff0000;
          font-size: rem(12);
          font-style: normal;
          height: rem(18);
          // min-width: rem(18);
          padding: rem(0) rem(6);
          white-space: nowrap;
          text-align: center;
          line-height: rem(18);
          border-radius: rem(18);
          vertical-align: middle;
          display: inline-block;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        }
      }
    }
    &-u {
      cursor: pointer;
      @include flex;
      @include jc(flex-start);
      @include ai;
      float: right;
      .im-item {
        background: url('/static/images/chinaMobile/index-im.png') no-repeat;
        background-size: 100%;
        width: rem(24);
        height: rem(24);
        position: relative;
        margin-right: rem(25);
        i {
          transform: translateY(-50%) translateX(100%);
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
          position: absolute;
          background: #ff0000;
          font-size: rem(12);
          top: rem(0);
          right: rem(10);
          font-style: normal;
          height: rem(18);
          padding: rem(0) rem(6);
          text-align: center;
          line-height: rem(18);
          border-radius: rem(18);
        }
      }
      .user-item {
        text-align: right;
        img {
          display: inline-block;
          vertical-align: middle;
          margin-right: rem(10);
        }
        label: {
          cursor: pointer;
        }
        .ico {
          margin-left: rem(5);
          color: #fff;
        }
      }
    }
    &-block {
      width: rem(336);
      min-width: rem(336);
      max-width: rem(336);
    }
    &-main {
      padding-left: 10px;
      width: rem(1300-336-336);
    }
    &-search {
      position: relative;
      width: rem(270);
      height: rem(50);
      line-height: rem(50);
      @include flex;
      @include jc(flex-start);
      @include ai;
      .search {
        border: 0;
        width: rem(240);
        height: rem(28);
        line-height: rem(28);
        border-radius: rem(2);
        padding-left: rem(25);
        font-size: rem(12);
        background: rgba(109, 183, 255, 1);
        // border: rem(1) solid #ffffff;
        color: #fff;
        &::placeholder {
          color: #fff;
        }
      }
      .ico {
        color: #fff;
        left: rem(7);
        position: absolute;
      }

      &.active {
        .search {
          background: rgba(255, 255, 255, 1);
          color: #444;
        }

        .ico {
          color: #9f9f9f;
        }
      }
    }
    &-search-group {
      position: relative;
      height: rem(50);
      line-height: rem(50);
      @include flex;
      @include jc(flex-start);
      @include ai;
      .ico {
        color: rgba(108, 117, 125, 1);
        left: rem(24);
        top: rem(19);
        position: absolute;
      }

      &.active {
        .search {
          background: rgba(255, 255, 255, 1);
          color: #444;
        }

        .ico {
          color: #9f9f9f;
        }
      }
      .search-group {
        border: 0;
        width: 100%;
        height: rem(32);
        line-height: rem(20);
        border-radius: rem(2);
        padding-left: rem(30);
        margin: 0 15px;
        font-size: rem(13);
        background: rgba(245, 245, 245, 1);
        // border: rem(1) solid #ffffff;
        &::placeholder {
          color: #6c757d;
        }
      }
    }

    &-tip {
      text-align: right;
    }
    .quit-label {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  body .el-popover {
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.2);
  }
  .app-list {
    background: #ffffff;
  }
  .vx-popover-header {
    position: fixed;
    z-index: 9999;
    top: 50px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
