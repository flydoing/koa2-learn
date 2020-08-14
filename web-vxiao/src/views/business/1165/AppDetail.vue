<template>
  <AppPage :title="app.name"
           @scrollEnd="scrollEnd">
    <template v-if="hasSearch">
      <Item :hasClick="false"
            fullInput
            slot="top"
            class="search">
        <div slot="before">
          <i class="ico ico-search"></i>
        </div>
        <input placeholder="搜索"
               v-model="keyword" />
      </Item>
      <div class="category-title"></div>
    </template>
    <AppCommon :app="curApp" />
    <div class="big-record-list">
      <div class="big-record-chilren"
           v-for="(value, key) in datas"
           :key="key">
        <div class="big-record-chilren-month">{{key | getMonth}}</div>
        <div v-if="value.length>0">
          <CardEntry :message="m"
                     @click="handleClick(m)"
                     class="big-record-chilren-card-enter"
                     v-for="(m, k) in value"
                     :key="k">
            <div slot="logo"
                 v-lazy:background-image="m.medias ? url(m.medias[0].fileId) : '/static/d/1157.png'"
                 :style="imageStyle()"></div>
            <div slot="title">{{m.title}}</div>
          </CardEntry>
        </div>
      </div>
    </div>
  </AppPage>
</template>
<script>
  import Api from '@/api/message'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    props: { app: Object, hasSearch: { type: Boolean, default: true } },
    mixins: [CardMixin],
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        datas: {},
        hasNextPage: 0,
        currentPage: 1,
        keyword: '',
        messages: []
      }
    },
    created() {
      this.loadListData()
    },
    methods: {
      handleClick(m) {
        this.routePush({
          name: 'detail1157',
          params: { msgId: m.id },
          query: { type: m.type }
        })
      },
      loadListData(queryType, $load) {
        let that = this
        Api.getMessages({
          groupId: that.groupId,
          currentPage: that.currentPage,
          type: '1157',
          keyword: that.keyword,
          queryType: that.keyword !== '' ? 'keyword' : 'type'
        })
          .then(res => {
            if (res.hasNextPage) {
              this.hasNextPage = res.hasNextPage
              this.currentPage = res.currentPage
            } else {
              this.hasNextPage = 0
            }
            queryType === 'more' ? (that.messages = [...that.messages, ...res.messages]) : (that.messages = res.messages || [])
            that.datas = {}
            that.messages &&
              that.messages.forEach(d => {
                const date = `${new Date(d.extensionType).getFullYear()}-${new Date(d.extensionType).getMonth() + 1}`
                if (!that.datas.hasOwnProperty(date)) {
                  if (d.extensionType) {
                    that.datas[date] = [d]
                  }
                } else {
                  d.extensionType && that.datas[date].push(d)
                }
                that.datas = Object.assign({}, this.datas)
              })
            $load && $load.close()
          })
          .catch(res => {
            $load && $load.close()
          })
      },
      scrollEnd(status, $load) {
        this.hasNextPage > 0 && this.loadListData('more', $load)
      }
    },
    filters: {
      getMonth(value) {
        let currentYear = new Date().getFullYear()
        return currentYear === new Date(value).getFullYear() ? `${value.split('-')[1]}月` : value
      }
    },
    watch: {
      keyword() {
        this.currentPage = 1
        this.loadListData()
      },
      currentApp(v) {
        this.loadListData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .big-record-list {
    background-color: #ededed;
    .big-record-chilren {
      &-month {
        position: relative;
        height: rem(50);
        line-height: rem(60);
        padding-left: rem(50);
        &::after {
          position: absolute;
          content: '';
          width: rem(5);
          height: rem(60);
          left: rem(30);
          background-color: #dfdfdf;
          top: rem(0);
        }
        &::before {
          position: absolute;
          content: '';
          width: rem(20);
          height: rem(20);
          border-radius: 100%;
          @include bc;
          left: rem(22);
          top: rem(20);
          z-index: 10;
        }
      }
      &-card-enter {
        margin-top: rem(10);
        padding: rem(10) 0;
      }
    }
  }
</style>
