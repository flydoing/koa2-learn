<template>
  <div class="apps">
    <Scroller :height="menuHeight"
              ref="_scroller">
      <ItemDetail :class="{'bg-gray':!appId && !showContacts}"
                  @click="onHomepage">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(currentGroup.logo,'thumb'),error:'/static/bg/bg.png'}"
             alt='LOGO'>
        <span slot="title">{{currentGroup.name}}</span>
      </ItemDetail>
      <ItemDetail :class="{'bg-gray':showContacts}"
                  @click="onMember">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:'/static/images/chinaMobile/members.png',error:Image.ICO_AVATAR}"
             alt='LOGO'>
        <span slot="title">成员</span>
      </ItemDetail>
      <div v-for="(a, i) in searchApps"
           :key="i">
        <div class="appTitle">{{a.name}}</div>
        <template v-if="a.apps.length > 0">
          <div v-for="c in a.apps"
               :ref="'app_'+c.id"
               :key="c.id">
            <ItemDetail @click="handleApp(c)"
                        :class="{'bg-gray':c.id===appId}">
              <img slot="avatar"
                   class="avatar"
                   v-lazy="{src:url(c.cardShowLogo,'thumb'),error:Image.ICO_AVATAR}"
                   alt='LOGO'>
              <span slot="title">{{c.name}}</span>
              <span slot="content"
                    v-html="getContent(c)"></span>
              <span slot="remark">{{getTime(c)}}</span>
            </ItemDetail>
          </div>
        </template>
      </div>
    </Scroller>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import ItemText from '@/components/item/ItemText'
  import R from '@/views/group/mixin'
  import Text from '@/utils/text'
  import MessageApi from '@/api/message'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [R],
    components: { ItemText },
    data() {
      return {
        keyword: '',
        ms: {}
      }
    },
    computed: {
      ...mapGetters({
        imBubble: 'im/getImBubble',
        showContacts: 'showGroupContacts',
        currentGroup: 'getCurrentGroup',
        getCurrentApp: 'getCurrentApp',
        getGroupsApps: 'getGroupsApps',
        getCategoryApps: 'getCategoryApps',
        getMenuType: 'getMenuType'
      }),
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
      },
      categorys() {
        return this.getCategoryApps(this.groupId)
      },
      currentApp() {
        return this.getCurrentApp || {}
      },
      menuType() {
        return this.getMenuType
      },
      appId() {
        return this.currentApp.id
      },
      searchApps() {
        let search = this.keyword.toLowerCase()
        let apps = this.getGroupsApps(this.groupId)
        let arr = this.model ? apps : this.categorys
        arr = arr.map(item => {
          item['isOpen'] = true
          return item
        })
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
        }
        return arr
      }
    },
    methods: {
      ...mapActions(['loadGroupApps', 'setCurrentApp', 'showGroupContacts', 'setMenuType', 'setCreateObject']),
      onHomepage() {
        this.showGroupContacts(false)
        this.setMenuType('1')
        this.setCurrentApp(false)
      },
      onIm() {
        this.routePushModel({
          path: '/vx/im'
        })
      },
      onMember() {
        this.setMenuType('2')
        this.showGroupContacts(true)
        this.setCurrentApp(false)
        // this.routePushModel({
        //   path: '/vx/member'
        // })
      },
      onAddGroup() {
        this.routePushModel({
          path: '/vx/group/add'
        })
      },
      getContent(app) {
        let _m = this.ms[app.type] || {}
        let txt = _m.content || app.info || '无最新消息'
        txt = Text.changeTopic(txt)
        txt = Text.changeAnd(txt)
        return txt
      },
      getTime(app) {
        let _m = this.ms[app.type] || {}
        let time
        if (_m && _m.createTime) {
          time = DateUtils.converFormat(_m.createTime)
          return time
        } else {
          return ''
        }
      },
      loadLastMessage() {
        if (this.groupId) {
          MessageApi.getLatestMessage(this.groupId).then(res => {
            if (Check.isRealArray(res.messages)) {
              res.messages.forEach(m => {
                this.$set(this.ms, m.type, m)
              })
            }
          })
        }
      },
      createApp(currentApp) {
        let app = currentApp
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
      handleApp(app) {
        if (app.type === '10000') {
          // 活跃
          let version = window.dataModule
          if (version.indexOf('chinamobile.html') !== -1) {
            this.setMenuType(app.type)
            this.showGroupContacts(false)
            this.setCurrentApp(app)
          } else {
            this.report()
          }
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
            groupId: this.groupId
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
            // this.routePushModel({
            //   path: `/vx/group/business`,
            //   query: {
            //     appType: app.type,
            //     groupId: this.groupId
            //   }
            // })
            this.setMenuType(app.type)
            this.showGroupContacts(false)
            this.setCurrentApp(app)
          } else {
            this.openBrowser(
              app.reportUrl.splitJoin({
                userId: this.userId,
                groupId: this.groupId
              })
            )
          }
        }
      },
      loadApps() {
        if (Check.isNullArray(this.categorys)) {
          this.loadGroupApps(this.groupId)
        }
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
            groupId: this.groupId
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
          query: { groupId: this.groupId }
        })
      }
    },
    watch: {
      groupId(v) {
        if (v) {
          this.loadApps()
          this.keyword = ''
          this.loadLastMessage()
        }
      },
      currentApp: {
        handler(newVal) {
          if (this.getStorage('_app_toScroll')) {
            this.setMenuType(newVal.type)
            this.showGroupContacts(false)
            this.$refs._scroller.scrollbar.scrollIntoView(this.$refs[`app_${newVal.id}`][0])
            this.removeStorage('_app_toScroll')
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
  .apps {
    .vx-item.bg-gray {
      background: rgba(233, 244, 255, 1) !important;
    }
    .bg-gray {
      background: rgba(233, 244, 255, 1) !important;
    }
    .vx-item::after {
      background: none !important;
    }
    .appTitle {
      padding: rem(8) 0 rem(8) rem(20);
      color: #999999;
    }
  }
</style>
