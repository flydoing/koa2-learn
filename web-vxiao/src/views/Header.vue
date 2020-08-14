<template>
  <div class="vx-header">
    <div class="vx-header-container"
         :class="[{'has-info':!hasContacts}]">
      <el-row type="flex"
              justify="center">
        <el-col class="vx-header-block">
          <div class="vx-header-u"
               @click="onSelf">
            <img class="avatar smaller"
                 v-lazy="{src:url(USER.avatar,'thumb'),error:Image.ICO_AVATAR}" />
            <span v-html="USER.name"></span>
            <span class="quit-label"
                  @click.stop="onQuit">退出</span>
          </div>
        </el-col>
        <el-col class="vx-header-main">
          <!-- <div class="vx-header-search"
               :class="prefixCls">
            <i class="ico ico-search"></i>
            <input class="search"
                   v-model="searchText"
                   @focus="prefixCls='s active'"
                   @blur="prefixCls='s'" />
          </div> -->
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
                  <!-- <span class="f12 text-label"
                  @click.stop="handleMoreMessage">更多</span><i class="ico ico-right" /> -->
                </div>

              </div>
            </scroller>
            <!-- <div class="vx-header-search"
                 slot="reference"
                 :class="prefixCls">
              <i class="ico ico-search"></i>
              <input class="search"
                     v-model="searchText"
                     @click="handleClickSearch"
                     @focus="prefixCls='s active'"
                     @blur="prefixCls='s'" /> -->
            <div class="vx-header-search"
                 slot="reference"
                 :class="prefixCls">
              <i class="ico ico-search"></i>
              <input class="search"
                     v-model="searchText"
                     @click="handleClickSearch"
                     placeholder="搜索成员、应用、消息" />
              <!-- <div class="vx-header-search"
                 slot="reference"
                 :class="prefixCls">
              <i class="ico ico-search"></i>
              <input class="search"
                     @click="handleClickSearch"
                     v-model="searchText"
                     placeholder="消息/成员/应用" /> -->
            </div>
          </el-popover>
        </el-col>
        <el-col class="vx-header-block">
          <div class="vx-header-tip">让学校更智慧</div>
        </el-col>
      </el-row>
    </div>
    <!-- 遮罩层 -->
    <div v-if="showSearchResult"
         @click="handleHidePopover"
         class="vx-popover-header"></div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import Api from '@/modules/chinamobile/api'
  import Text from '@/utils/text'
  import { mapGetters, mapActions } from 'vuex'
  // import * as Storage from '@/utils/storage'
  export default {
    data() {
      return {
        searchText: '',
        prefixCls: 's',
        customizationLogin: '',
        // 搜索
        arrowOffset: 30,
        showSearchResult: false,
        timer: false,
        searchResult: {
          relations: [],
          messages: []
        },
        searchLoading: false,
        model: true
      }
    },
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
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
        getGroupsApps: 'getGroupsApps',
        hasContacts: 'showGroupContacts',
        globalSearchText: 'globalSearch'
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
      ...mapActions(['globalSearch']),
      handleHidePopover() {
        this.showSearchResult = false
      },
      handleClickSearch() {
        if (this.searchResult.relations.length > 0 || this.searchResult.messages.length > 0 || this.searchApps.length > 0) {
          this.showSearchResult = true
          this.searchLoading = false
        }
      },
      handleShowSearchResult() {
        this.showSearchResult = false
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
        this.showSearchResult = false
        this.offPage(false)
        this.$http.get('/base/user/logout')
        setTimeout(() => {
          if (window.dataModule.indexOf('tianhe.html') > -1) {
            location.href = '/tianhe.html#/'
          } else if (window.dataModule.indexOf('chinamobile.html') > -1) {
            location.href = '/chinamobile.html#/'
          } else if (window.dataModule.indexOf('chinavxiao.html') > -1) {
            location.href = '/chinavxiao.html#/'
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
        if (app.type === '10000') {
          // 活跃
          this.report()
        } else if (app.type === '10001' || app.type === '10002') {
          this.teacher()
        } else if (app.type === '10003') {
          this.student()
        } else if (app.type === '10004') {
          this.classes()
        } else if (app.type === '10005') {
          this.department()
        } else if (app.type === '10006') {
          this.groups()
        } else if (app.type === '10008') {
          this.addUser()
        } else if (app.type === '10009') {
          this.uncertified()
        } else if (app.type === '10010') {
          // 登陆提醒
          this.$message({
            type: 'warning',
            message: '请用V校app作登陆提醒'
          })
        } else if (app.type === '10011') {
          this.store()
        } else if (app.type === '10013') {
          this.self()
        } else if (app.type === '10014') {
          this.topic()
        } else if (app.type === '10015') {
          this.album()
        } else if (app.type === '10016') {
          this.file()
        } else if (app.type === '10017') {
          this.subject()
        } else if (app.type === '10018') {
          this.place()
        } else if (app.type === '10019') {
          this.teacherTime()
        } else if (app.type === '10020') {
          this.coursetbl()
        } else if (app.type === '10022') {
          this.catalog()
        } else if (app.type === '10021') {
          this.schoools()
        } else if (app.type === '10023') {
          this.courseApply()
        } else if (app.type === '1180') {
          let url = app.url
          url = url.splitJoin({
            userId: this.baseInfo.USERID,
            clientId: this.baseInfo.CLIENTID,
            tokenId: this.baseInfo.TOKENID,
            groupId: this.curGroup.groupId
          })
          if (!this.isEducation) {
            url = `${url}&route=school`
          }
          this.openBrowser(url)
        } else if (app.type === '10030') {
          this.dormitory()
        } else if (app.type === '10036') {
          this.duty()
        } else if (app.type === '10037') {
          this.job()
        } else {
          if (Check.isNullString(app.reportUrl) || (app.type === '1253' && this.isOrg) || (app.type === '1245' && this.isOrg)) {
            this.routePushModel({
              path: `/vx/group/business`,
              query: {
                appType: app.type,
                groupId: this.curGroup.groupId
              }
            })
          } else {
            this.openBrowser(
              app.reportUrl.splitJoin({
                userId: this.userId,
                groupId: this.curGroup.groupId
              })
            )
          }
        }
      },
      loadApps() {
        if (Check.isNullArray(this.categorys)) {
          this.loadGroupApps(this.curGroup.groupId)
        }
      },
      loadLastMessage() {
        if (this.curGroup.groupId) {
          Api.getLatestMessage(this.curGroup.groupId).then(res => {
            if (Check.isRealArray(res.messages)) {
              res.messages.forEach(m => {
                this.$set(this.ms, m.type, m)
              })
            }
          })
        }
      },
      getContent(app) {
        let _m = this.ms[app.type] || {}
        let txt = _m.content || app.info || '无最新消息'
        txt = Text.changeTopic(txt)
        txt = Text.changeAnd(txt)
        return txt
      },
      teacher() {
        this.users('teacher')
      },
      student() {
        this.users('student')
      },
      users(type) {
        if (this.isSchool) {
          this.routePushModel({
            path: `/vx/group/business/basice/${type}`,
            query: {
              schoolId: this.currentGroup.parentId
            }
          })
        } else {
          this.routePushModel({ path: `/vx/group/user/${type}` })
        }
      },
      subject() {
        this.routePushModel({
          path: '/vx/group/business/basice/subject',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      place() {
        this.routePushModel({
          path: '/vx/group/business/basice/place',
          query: {
            schoolId: this.currentGroup.parentId,
            groupId: this.currentGroup.groupId
          }
        })
      },
      dormitory() {
        if (this.isSchool) {
          this.routePushModel({
            path: '/vx/group/business/dormitory/list'
          })
        } else {
          this.routePushModel({
            path: '/vx/group/business/dormitory/classDetail'
          })
        }
      },
      duty() {
        this.routePushModel({
          path: '/vx/group/business/onDuty/list'
        })
      },
      job() {
        this.routePushModel({
          path: '/vx/group/business/job/list'
        })
      },
      teacherTime() {
        this.routePushModel({
          path: '/vx/group/business/basice/time',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      uncertified() {
        this.routePushModel({
          path: '/vx/group/business/basice/uncertified',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      courseApply() {
        this.routePushModel({
          path: '/vx/group/business/basice/course',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      department() {
        this.routePushModel({
          path: '/vx/group/business/basice/department',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      classes() {
        this.routePushModel({
          path: '/vx/group/business/basice/classes',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      groups() {
        this.routePushModel({
          path: '/vx/group/user/team'
        })
      },
      schoools() {
        this.routePushModel({
          path: '/vx/group/business/basice/schools',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      addUser() {
        this.routePushModel({
          path: '/vx/group/user/add'
        })
      },
      catalog() {
        this.routePushModel({
          path: `/vx/group/business/catalog`
        })
      },
      basice() {
        this.routePushModel({
          path: `/vx/group/business/basice`
        })
      },
      album() {
        this.customApp('album')
      },
      file() {
        this.customApp('file')
      },
      topic() {
        this.customApp('topic')
      },
      self() {
        this.customApp('self')
      },
      store() {
        this.customApp('store')
      },
      report() {
        this.customApp('report')
      },
      coursetbl() {
        this.customApp('coursetbl')
      },
      customApp(type) {
        this.routePushModel({
          path: `/vx/group/business/${type}`,
          query: { groupId: this.curGroup.groupId }
        })
      }
    },
    watch: {
      // searchText(val) {
      //   let that = this
      //   if (val !== that.globalSearchText) {
      //     if (!that.timer) {
      //       that.timer = true
      //       setTimeout(function() {
      //         that.timer = false
      //         that.globalSearch(val)
      //       }, 400)
      //     }
      //   }
      // },
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
    @include bc(0.7);
    &-container {
      margin: 0 auto;
      width: rem(1300);
      &.has-info {
        width: rem(1300-280-20);
        .vx-header-main {
          width: rem(1300-280-280-280);
        }
      }
    }
    &-u {
      cursor: pointer;
      @include flex;
      @include jc(flex-start);
      @include ai;
      span {
        margin-left: rem(10);
      }
    }
    &-block {
      width: rem(280);
      min-width: rem(280);
      max-width: rem(280);
    }
    &-main {
      padding-left: 10px;
      width: rem(1300-280-280);
    }
    // &-search {
    //   position: relative;
    //   height: rem(50);
    //   line-height: rem(50);
    //   @include flex;
    //   @include jc(flex-start);
    //   @include ai;
    //   .search {
    //     border: 0;
    //     width: rem(120);
    //     height: rem(25);
    //     line-height: rem(20);
    //     border-radius: rem(15);
    //     padding-left: rem(25);
    //     font-size: rem(13);
    //     background: rgba(255, 255, 255, 0);
    //     border: rem(1) solid #ffffff;
    //     color: #fff;
    //   }
    //   .ico {
    //     color: #fff;
    //     left: rem(7);
    //     position: absolute;
    //   }

    //   &.active {
    //     .search {
    //       background: rgba(255, 255, 255, 1);
    //       color: #444;
    //     }

    //     .ico {
    //       color: #9f9f9f;
    //     }
    //   }
    // }
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
        background: rgba(255, 255, 255, 0);
        background: whitesmoke;
        // border: rem(1) solid #ffffff;
        color: #606266;
        &::placeholder {
          color: #9f9f9f;
        }
      }
      .ico {
        color: #9f9f9f;
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

    &-tip {
      text-align: right;
    }
    .quit-label {
      color: rgba(255, 255, 255, 0.6);
    }
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
