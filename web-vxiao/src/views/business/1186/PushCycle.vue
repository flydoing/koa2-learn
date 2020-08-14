<template>
  <page title="推送周期">
    <item v-for="(week, g) in weeks"
          :key="g"
          @click="weekItemHandle(week)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active': week.isSelect}"></i>
      </div>
      <div slot="main">{{week.name}}</div>
      <span slot="after"></span>
    </item>
    <div class="list-button">
      <div class="button"
           @click="commitWeekHandle"> 确定</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        weeks: []
      }
    },
    created() {
      this.weeks = JSON.parse(JSON.stringify(this.chantPush.pushCycle))
    },
    methods: {
      ...mapActions(['saveChantPush']),
      weekItemHandle(w) {
        w.isSelect ? this.$set(w, 'isSelect', 0) : this.$set(w, 'isSelect', 1)
      },
      commitWeekHandle() {
        let weekValues = []
        this.weeks.forEach(cw => {
          if (cw.isSelect) {
            weekValues.push(cw.id)
          }
        })
        Api.singleSetPushBtn({
          appType: this.routeQuery('appType'),
          coursePush: {
            courseId: this.routeQuery('courseId'),
            groupId: this.routeQuery('groupId'),
            id: this.routeQuery('id'),
            week: weekValues.join(',')
          }
        }).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
            this.$message({
              type: 'success',
              message: '设置成功！'
            })
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
