<template>
  <div class="vx-info-container">
    <Item :hasClick="false"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索应用"
             v-model="keyword" />
    </Item>
    <scroller :height="sh">
      <ItemList @click="about"
                style="margin-bottom: 10px;">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(currentGroup.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO'>
        <span slot="title">{{currentGroup.name}}</span>
        <span slot="main">{{currentGroup.groupId}}</span>
        <i slot="remark"
           class="ico ico-qrcode"></i>
      </ItemList>
      <div class="vx-info-block"
           v-for="(category,i) in searchApps"
           :key="i">
        <div class="vx-info-title">
          <i class="ico ico-sg"></i>
          <span>{{category.name}}</span>
        </div>
        <el-row class="vx-info-box">
          <el-col :span="6"
                  class="block"
                  v-for="app in category.apps"
                  :key="app.key"
                  @click.native="clickApp(app)">
            <img v-lazy="{src:app.tlogo?app.tlogo:url(app.logo,'thumb'),error:Image.ICO_AVATAR}" />
            <div>{{app.name}}</div>
          </el-col>
        </el-row>
      </div>
    </scroller>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        keyword: ''
      }
    },
    computed: {
      ...mapGetters({
        categorys: 'getCategoryApps'
      }),
      searchApps() {
        let search = this.keyword.toLowerCase()
        let arr = this.categorys
        if (!arr) {
          return []
        }
        if (search) {
          arr = []
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
        return arr
      },
      sh() {
        return this.innerHeight - 75 - 40 - 10 - 45
      }
    },
    methods: {
      ...mapActions(['loadGroupApps']),
      loadApps() {
        if (Check.isNullArray(this.categorys)) {
          this.loadGroupApps(this.groupId)
        }
      },
      clickApp(app) {
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
        } else if (app.type === '10007') {
          this.im()
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
        } else {
          if (Check.isNullString(app.reportUrl)) {
            this.routePushModel({
              path: `/vx/group/business`,
              query: {
                appType: app.type,
                groupId: this.currentGroup.groupId
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
      about() {
        this.routePushModel({
          path: '/vx/group/about'
        })
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
      im() {
        this.routePushModel({
          path: '/vx/im',
          query: {
            groupId: this.currentGroup.groupId
          }
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
      this.loadApps()
    },
    watch: {
      currentGroup() {
        this.loadApps()
        this.keyword = ''
      }
    }
  }
</script>
<style lang="scss">
  .vx-info {
    &-block {
      margin-bottom: rem(10);
      padding: rem(0) rem(10);
      background: nth($background, 6);
      position: relative;

      &:last-child {
        margin-bottom: rem(0);
      }
    }

    &-title {
      font-size: rem(14);
      line-height: rem(35);

      .ico {
        @include fc;
      }
    }

    .block {
      @include ct;
      @include fd;
      cursor: pointer;
      margin: rem(5) rem(0);

      img {
        width: rem(40);
      }

      div {
        text-align: center;
        line-height: rem(25);
        @include fh;
      }
    }

    &-box {
      width: 100%;
      @include flex;
      @include jc(flex-start);
      @include ai;
      @include wrap;
    }
  }
</style>
