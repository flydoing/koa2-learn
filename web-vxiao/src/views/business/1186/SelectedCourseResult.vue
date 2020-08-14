<template>
  <page title="诵读推送">
    <item>
      <div slot="main">自动推送</div>
      <div slot="remark">
        <i-switch :value.sync="autoPushBol"
                  @click="pushButtonHandle"></i-switch>
      </div>
      <span slot="after"></span>
    </item>
    <item v-if="isSchool"
          @click="showGradeModal">
      <div slot="main">推送年级</div>
      <div slot="remark">{{defaultSettings.gradeNames}}</div>
    </item>
    <item @click="showWeekModal">
      <div slot="main">推送周期</div>
      <div slot="remark">{{defaultSettings.weekNames}}</div>
    </item>
    <item>
      <div slot="main">推送时间</div>
      <div slot="remark">{{defaultSettings.time}}</div>
      <span slot="after"></span>
    </item>
    <PushedList :datas="datas"></PushedList>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      PushedList: resolve => require(['./PushedList'], resolve)
    },
    data() {
      return {
        autoPushBol: false,
        defaultSettings: {},
        datas: [],
        isSchool: this.routeQuery('isSchool')
      }
    },
    created() {
      let that = this
      if (that.routeQuery('token')) {
        that.$http.defaults.headers.common['tokenId'] = that.routeQuery('token')
      }
      if (that.routeQuery('clientId')) {
        that.$http.defaults.headers.common['ClientId'] = that.routeQuery('clientId')
      }
      Api.getPushSettings(that.routeQuery('courseId'), that.routeQuery('groupId'), that.routeQuery('appType')).then(res => {
        if (res && res.code === '1') {
          that.defaultSettings = res.coursePush
          if (res.coursePush.ispush === 1) {
            that.autoPushBol = true
          }
          that.saveChantPush({
            pushCycle: that.defaultSettings.weekSettings,
            cacheGrade: that.defaultSettings.gradeNames ? that.defaultSettings.gradeNames.split('、') : []
          })
          that.datas = res.datas
        }
      })
    },
    methods: {
      ...mapActions(['saveChantPush']),
      pushButtonHandle() {
        Api.singleSetPushBtn({
          appType: this.routeQuery('appType'),
          coursePush: {
            courseId: this.routeQuery('courseId'),
            groupId: this.routeQuery('groupId'),
            id: this.defaultSettings.id,
            ispush: this.autoPushBol ? 1 : 0
          }
        }).then(res => {
          if (res && res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功！'
            })
          }
        })
      },
      showGradeModal() {
        this.routePush({
          name: 'chantPushGrade1186',
          query: {
            appType: this.routeQuery('appType'),
            courseId: this.routeQuery('courseId'),
            groupId: this.routeQuery('groupId'),
            id: this.defaultSettings.id
          }
        })
      },
      showWeekModal() {
        this.routePush({
          name: 'chantPushCycle1186',
          query: {
            appType: this.routeQuery('appType'),
            courseId: this.routeQuery('courseId'),
            groupId: this.routeQuery('groupId'),
            id: this.defaultSettings.id
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        chantPush: 'getChantPush'
      })
    }
  }
</script>
