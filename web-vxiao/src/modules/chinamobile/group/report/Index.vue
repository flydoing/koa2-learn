<template>
  <div>
    <div class="reportWrapper">
      <div class="common">
        <div @click="go('manager')">
          <i class="ico ico-guanliyuan"></i>
          <p>管理员</p>
        </div>
        <div @click="go('appSet')">
          <i class="ico ico-yingyongshezhi"></i>
          <p>应用设置</p>
        </div>
        <div @click="go('reportSet')">
          <i class="ico ico-baobiaoshezhi"></i>
          <p>报表设置</p>
        </div>
      </div>

      <div>
        <div v-for="(item,index) in reportList"
             :key="index"
             class="reportList">
          <div class="title">
            <span class="titleIcon"
                  :style="{'background':item.color}"></span> {{item.title}}
          </div>
          <div class="subItem">
            <div class="listItem"
                 v-for="(subItem,subIndex) in item.data "
                 :key="subIndex"
                 :style="{'background':`url(${item.bg})`}"
                 @click="handleReport(subItem)">
              <p class="fullName"
                 v-if="item.title === '日报表'">{{subItem.fullName}}</p>
              <p class="fullName"
                 v-else-if="item.title === '月报表'">{{`${subItem.name}`}}</p>
              <p class="fullName"
                 v-else-if="item.title === '年报表'">{{subItem.name}}</p>
              <p class="year">{{`${new Date().getFullYear()} 年`}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import reportApi from '@/views/group/report/api.js'
  import { mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        reportList: []
      }
    },
    created() {
      const appType = this.currentApp.type
      const groupId = this.currentGroup.groupId
      this.getReportList(groupId, appType)
    },
    methods: {
      getReportList(groupId, appType) {
        reportApi.loadReportList(groupId, appType).then(res => {
          if (res && res.table) {
            let obj = { d: [], m: [], y: [] }
            res.table.items.map(item => {
              if (item.summaryAttr === 'preDay' || item.summaryAttr === 'preTwoDay' || item.summaryAttr === 'currentWeek' || item.summaryAttr === 'preWeek') {
                obj.d.push(item)
              } else if (item.summaryAttr === 'currentMonth' || item.summaryAttr === 'preMonth') {
                obj.m.push(item)
              } else if (item.summaryAttr === 'currentTerm' || item.summaryAttr === 'currentYear') {
                obj.y.push(item)
              }
            })
            this.reportList = [
              { title: '日报表', bg: '/static/images/chinaMobile/report-day.png', data: obj.d, color: 'rgba(254,111,137,1)' },
              { title: '月报表', bg: '/static/images/chinaMobile/report-month.png', data: obj.m, color: 'rgba(254,192,57,1)' },
              { title: '年报表', bg: '/static/images/chinaMobile/report-year.png', data: obj.y, color: 'rgba(80,209,152,1)' }
            ]
          }
        })
      },
      go(type) {
        switch (type) {
          case 'manager':
            this.routePush({
              path: '/vx/group/business/app/admin',
              query: {
                appType: this.currentApp.type
              }
            })
            break
          case 'appSet':
            this.routePush({
              path: '/vx/group/business/app/setup',
              query: {
                groupId: this.schoolId,
                appType: this.currentApp.type
              }
            })
            break
          case 'reportSet':
            this.routePush({
              path: '/vx/group/business/report/setup',
              query: {
                groupId: this.currentGroup.groupId,
                appType: this.currentApp.type
              }
            })
            break
        }
      },
      handleReport(item) {
        this.routePush({
          path: `/vx/group/business/report/detail/${this.currentGroup.groupId}`,
          query: {
            appType: this.currentApp.type,
            fromUserId: this.userId,
            appName: this.currentApp.name,
            ...item.params
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        currentApp: 'getCurrentApp'
      })
    },
    watch: {
      currentApp: {
        handler(newVal) {
          if (newVal) {
            const appType = newVal.type
            const groupId = this.currentGroup.groupId
            this.getReportList(groupId, appType)
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .reportWrapper {
    background: #fff;
    padding: rem(15) 0;
    overflow: auto;
    .common {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: rem(20);
      div {
        margin-left: rem(20);
        width: rem(195);
        height: rem(140);
        background: url('/static/images/chinaMobile/report-set.png');
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        i {
          color: #fff;
          font-size: rem(45);
        }
        p {
          margin-top: rem(20);
          font-size: rem(16);
        }
      }
    }
  }
  .reportList {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .title {
      padding: 0 rem(20);
      .titleIcon {
        width: rem(6);
        height: rem(16);
        display: inline-block;
        vertical-align: middle;
      }
    }
    .subItem {
      display: flex;
      flex-direction: row;
      margin: rem(20) 0 rem(20) rem(20);
      .listItem {
        width: rem(195);
        height: rem(140);
        margin-left: rem(20);
        color: #fff;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding-left: rem(30);
        cursor: pointer;
        .fullName {
          font-size: rem(20);
        }
        .year {
          margin-top: rem(4);
        }
      }
      .listItem:first-child {
        margin-left: rem(0);
      }
    }
  }
</style>
