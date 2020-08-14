<template>
  <Scroller :height="sh"
            style="background:#FFF;">
    <!-- <Item :hasClick="false"
          class="full-input">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索应用"
             v-model="keyword" />
    </Item> -->
    <template v-if="model">
      <ItemDetail v-for="app in searchApps"
                  :key="app.type"
                  @click="onApp(app)"
                  :width="710">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(app.cardShowLogo,'thumb'),error:Image.ICO_AVATAR}"
             alt='LOGO'>
        <span slot="title">{{app.name}}</span>
        <span slot="content"
              v-html="getContent(app)"></span>
      </ItemDetail>
    </template>
    <template v-else>
      <div class="app-box">
        <template v-for="(c,i) in searchApps">
          <div class="app-group"
               :key="i"
               v-if="c.apps.length > 0">
            <div class="app-title">
              <span class="name">{{c.name}}</span>
            </div>
            <div class="app-list">
              <div class="app-block"
                   v-for="(app,j) in c.apps"
                   :key="j"
                   @click="onApp(app)">
                <img class="avatar"
                     v-lazy="{src:url(app.cardShowLogo),error:Image.ICO_AVATAR}" />
                <div class="app-name">{{app.name}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </Scroller>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '@/api/message'
  import Text from '@/utils/text'
  export default {
    mixins: [R],
    props: {
      model: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        keyword: '',
        ms: {}
      }
    },
    computed: {
      ...mapGetters(['getGroupsApps', 'getCategoryApps']),
      categorys() {
        return this.getCategoryApps(this.groupId)
      },
      searchApps() {
        let search = this.keyword.toLowerCase()
        let apps = this.getGroupsApps(this.groupId)
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
        }
        return arr
      },
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    },
    methods: {
      ...mapActions(['loadGroupApps']),
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
            this.routePushModel({
              path: `/vx/group/business`,
              query: {
                appType: app.type,
                groupId: this.groupId
              }
            })
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
      loadLastMessage() {
        if (this.groupId) {
          Api.getLatestMessage(this.groupId).then(res => {
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
          query: { groupId: this.groupId }
        })
      }
    },
    mounted() {
      // this.loadApps()
      // this.loadLastMessage()
    },
    watch: {
      groupId(v) {
        if (v) {
          this.loadApps()
          this.keyword = ''
          this.loadLastMessage()
        }
      }
    }
  }
</script>
