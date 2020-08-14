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
           :class="{'active': item.havePunch === '1', 'disabled': item.isShow === '0', 'await': item.isShow === '2', selected: item.selected}"
           @click="handleItem(item)">
        <div v-html="item.sdate"></div>
        <div v-if="item.isShow !== '0'">{{item.count}}/{{item.total}}</div>
      </div>
    </div>
    <div class="chart_item">
      <a class="text-color"
         @click="handleDetail">查看详情</a>
      <template v-if="date">
        <PieChart :date.sync="date"
                  :msgId="msgId"></PieChart>
      </template>
    </div>
    <div class="category-title"></div>
    <template v-if="cms.length>0">
      <div class="card-list">
        <template v-for="(m, i) in cms">
          <card125501 v-if="m.status !== '2'"
                      :message="m"
                      :key="m.id"
                      @shield="handleShield(m, i)" />
        </template>
      </div>
    </template>
    <template v-else>
      <CardTips text="暂无内容" />
    </template>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Mixin from './mixin'
  export default {
    mixins: [Mixin],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve),
      Card125501: resolve => require(['@/views/business/125501/Card'], resolve),
      PieChart: resolve => require(['./Chart'], resolve),
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        msgId: this.routeQuery('msgId')
      }
    },
    computed: {
      cms() {
        if (Check.isRealArray(this.childMessages)) {
          return this.childMessages.filter(v => {
            return v.status !== '2'
          })
        }
        return []
      }
    },
    methods: {
      handleShield(message, index) {
        const that = this
        let m = { ...message, status: '2' }
        that.modifyMessage(m).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.$set(this.childMessages, index, m)
        })
      },
      handleDetail() {
        let curDate = this.list.filter(v => {
          return v.selected
        })[0]
        this.routePush({
          name: 'users1255',
          query: {
            sdate: curDate.sdate,
            stime: curDate.stime,
            msgId: this.routeQuery('msgId')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-list {
    overflow: hidden;

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
      margin-left: rem(9);
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

      &.active {
        @include bc;
        color: #fff;

        &:hover {
          @include bc;
        }
      }

      &.selected {
        @include borderColor;
      }
    }
  }
  .chart_item {
    position: relative;
    a {
      position: absolute;
      cursor: pointer;
      z-index: 1;
      right: 28%;
      bottom: 33%;
    }
  }

  .btm-operate {
    padding: rem(5) 0;
    border-top: $border;
  }
</style>
