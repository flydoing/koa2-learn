<template>
  <div>
    <div class="rank">
      <item :hasClick="false"
            v-for="(item,index) in rankData.avgs"
            :key="index">
        <div slot="before">
          <div v-if="item.rank">{{item.rank}}<span class="iconWrapper"><i class="ico ico-triangle-top"></i><i class="count">{{item.upRank}}</i></span></div>
          <div v-else
               class="noIconWrapper">
            <span class="line"></span>
          </div>
        </div>
        <div slot="main"
             style="flex:1">{{item.name}}</div>
        <div slot="remark">{{item.rate}}</div>
      </item>
      <div class="category-title"
           v-show="splitLineShow && rankData.ranks"></div>
      <item :hasClick="false"
            v-for="(item,index) in rankData.ranks"
            :key="index">
        <div slot="before">{{item.rank}}<span class="iconWrapper"
                v-if="item.upRank"><i class="ico ico-triangle-top"></i><i class="count">{{item.upRank}}</i></span></div>
        <div slot="main"
             style="flex:1">{{item.name}}</div>
        <div slot="remark">{{item.rate}}</div>
      </item>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        rankData: {},
        splitLineShow: false
      }
    },
    props: {
      params: { type: Object, default: () => {} },
      tabData: { type: Object }
    },
    deactivated() {
      this.rankData = {}
      this.splitLineShow = false
    },
    created() {
      this.getRankData()
    },
    methods: {
      getRankData() {
        const appType = this.routeQuery('appType') ? this.routeQuery('appType') : this.params.appType
        const groupId = this.routeQuery('groupId') ? this.routeQuery('groupId') : this.params.groupId
        this.$http
          .get(`/report/business/${appType}/${groupId}`, {
            params: {
              startDate: this.routeQuery('startDate') ? this.routeQuery('startDate') : this.params.startDate,
              endDate: this.routeQuery('endDate') ? this.routeQuery('endDate') : this.params.endDate,
              noTempletReport: '1',
              templetType: this.routeQuery('templetType') ? this.routeQuery('templetType') : this.tabData.templetType,
              groupId: groupId,
              timeType: this.routeQuery('timeType') ? this.routeQuery('timeType') : this.params.timeType
            }
          })
          .then(res => {
            if (res && res.table) {
              this.splitLineShow = true
              this.rankData = res.table.pTable
            } else {
              this.splitLineShow = false
              this.rankData = {}
            }
          })
      }
    },
    watch: {
      tabData: {
        handler(newVal, old) {
          this.getRankData()
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .iconWrapper {
    text-align: center;
    display: inline-block;
    width: 55px;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
    border-radius: 10px;
    background: #00cc33;
    margin-left: 5px;
    i {
      color: #fff;
      font-size: 12px;
    }
    .count {
      font-size: 12px;
    }
  }
  .noIconWrapper {
    width: 38px;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
    background: #cccccc;
    border-radius: 10px;
    position: relative;
    .line {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #fff;
    }
  }
</style>
