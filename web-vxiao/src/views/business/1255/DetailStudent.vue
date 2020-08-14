<template>
  <Page title="详情"
        @scrollEnd="scrollEnd">
    <div>
      <Card v-if="message"
            :message="message">
        <template slot="toolbar"></template>
        <template slot="down"></template>
      </Card>
    </div>
    <div class="category-title"></div>
    <div class="date-list">
      <div v-for="(item, i) in list"
           :key="i"
           class="dl-item"
           :class="{'disabled': item.isShow === '0', 'await': item.isShow === '2', 'selected': item.selected}"
           @click="handleItem(item)">
        <div v-html="item.sdate"></div>
        <template v-if="item.havePunch === '1'">
          <div><i class="ico-check"></i></div>
        </template>
        <template v-else-if="item.isShow !== '0'">
          <div v-html="remarkTxt(item.isShow, item.havePunch)"></div>
        </template>
      </div>
    </div>
    <div class="chart_item">
      <template v-if="date">
        <PieChart :date.sync="date"
                  :msgId="msgId"></PieChart>
      </template>
    </div>
    <div class="category-title"></div>
    <CardList v-if="childMessages.length>0"
              :messages="childMessages"></CardList>
    <div slot="bottom"
         class="btm-operate"
         v-if="punchClock.readed === 0">
      <div class="button button-common"
           @click="handlePunchClock">立即打卡</div>
    </div>
  </Page>
</template>
<script>
  import Mixin from './mixin'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [Mixin],
    components: {
      PieChart: resolve => require(['./Chart'], resolve),
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        list: [],
        msgId: this.routeQuery('msgId')
      }
    },
    computed: {
      ...mapGetters({
        punchClock: 'getPunchClock'
      })
    },
    methods: {
      remarkTxt(isShow, havePunch) {
        if (isShow === '2' && havePunch === '0') {
          return '待打卡'
        }
        return '未打卡'
      },
      handlePunchClock() {
        let item = this.list.filter(v => {
          return v.havePunch === '0' && v.isShow === '2'
        })[0]
        this.routePush({
          name: 'addContent1255',
          query: {
            msgId: this.message.id,
            date: item.sdate
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-list {
    overflow: hidden;
    padding-bottom: rem(8);

    .dl-item {
      float: left;
      width: rem(70);
      height: rem(50);
      border-radius: rem(5);
      background: #efefef;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      border: #ededed solid rem(1);
      text-align: center;
      margin-left: rem(7.9);
      margin-top: rem(8);

      &.disabled {
        color: #ccc;
      }

      &.await {
        background: #f2f2f2;

        &:hover {
          background: #f2f2f2;
        }
      }

      &.selected {
        @include borderColor;
      }

      .ico-check {
        display: inline-block;
        width: rem(15);
        height: rem(15);
        background: url('/static/ico/ico_check.png') no-repeat;
        background-size: 100% 100%;
        margin-top: rem(-2);
        vertical-align: middle;
      }
    }
  }

  .btm-operate {
    padding: rem(5) 0;
    border-top: $border;
  }
</style>
