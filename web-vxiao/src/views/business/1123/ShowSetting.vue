<template>
  <Page title="公开展示"
        hasSubmit
        @submit="settingCommit">
    <div slot="main"
         class="show-setting-box">
      <item @click="rankBarHandle">
        <div slot="main">排名</div>
        <div slot="remark">
          <i-switch :value.sync="rankBol"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="averageBarHandle">
        <div slot="main">平均分</div>
        <div slot="remark">
          <i-switch :value.sync="averageBol"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="scoreBarHandle">
        <div slot="main">分数</div>
        <div slot="remark">
          <i-switch :value.sync="scoreBol"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item className="v-item-show"
            v-if="!scoreBol"
            @click="setTotalScore">
        <div slot="main">分数阶梯设置</div>
        <div slot="remark">{{ladderText}}</div>
      </item>
      <item @click="standardScoreBarHandle">
        <div slot="main">标准分</div>
        <div slot="remark">
          <i-switch :value.sync="standardScoreBol"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="varianceBarHandle">
        <div slot="main">方差</div>
        <div slot="remark">
          <i-switch :value.sync="varianceBol"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
    </div>
  </Page>
</template>
<script>
  export default {
    data() {
      return {
        rankBol: false,
        averageBol: false,
        scoreBol: false,
        standardScoreBol: false,
        varianceBol: false,
        ladderText: '必填'
      }
    },
    methods: {
      settingCommit() {
        this.routeBack()
      },
      setTotalScore() {
        this.routePush({
          name: 'examinationLadderList'
        })
      },
      rankBarHandle() {
        this.rankBol = !this.rankBol
      },
      averageBarHandle() {
        this.averageBol = !this.averageBol
      },
      scoreBarHandle() {
        this.scoreBol = !this.scoreBol
      },
      standardScoreBarHandle() {
        this.standardScoreBol = !this.standardScoreBol
      },
      varianceBarHandle() {
        this.varianceBol = !this.varianceBol
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .show-setting-box {
    padding: 0 rem(8);
  }
</style>
