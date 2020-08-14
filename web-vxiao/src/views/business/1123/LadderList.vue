<template>
  <page title="分数阶梯设置" hasSubmit>
    <div slot="main">
      <item v-for="(score, s) in totalScoreList" :key="s" @click="handleSelectTotal(score)">
        <div slot="before">
          <i class="ico ico-select" :class="{'active':score.active}" />
        </div>
        <div slot="main">{{score.scoreVlaue}}</div>
        <div slot="remark" class="w100" @click.stop="handleLadderDtail(score)"></div>
      </item>
    </div>
  </page>
</template>
<script>
  export default {
    data() {
      return {
        totalScoreList: [{
            scoreVlaue: 100,
            active: 0
          },
          {
            scoreVlaue: 120,
            active: 0
          },
          {
            scoreVlaue: 150,
            active: 0
          }
        ]
      }
    },
    methods: {
      handleLadderDtail(obj) {
        this.routePush({
          name: 'examinationLadderDetail',
          query: {
            titleText: obj.scoreVlaue
          }
        })
      },
      handleSelectTotal(obj) {
        this.totalScoreList.forEach(s => {
          s.active = 0
        })
        obj.active = 1
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .w100 {
    display: block;
    width: rem(100);
    height: rem(35);
  }

</style>
