<template>
  <page title="报名"
        :hasClose="false"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label @click="exportHande">导出</label>
    </div>
    <div class="check-style">
      <Item :hasClick="false"
            fullInput
            class="search">
        <div slot="before">
          <i class="ico ico-search"
             @click="handleSearch"></i>
        </div>
        <input placeholder="搜索"
               v-model="modelText"
               @keyup="inputHandle" />
      </Item>
      <div class="check-style-search-list"
           v-if="applycants.length>0">
        <item v-for="(applycant, a) in applycants"
              :key="a"
              @click="applyDetailHandle(applycant)">
          <div slot="main">{{applycant.name}}</div>
        </item>
      </div>
      <div class="check-style-list"
           v-else>
        <item v-for="(data, d) in datas"
              :key="d"
              @click="applycantsListHandle(data)">
          <div slot="main">{{data.key}}</div>
          <div slot="remark">{{data.count}}</div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        datas: [],
        modelText: '',
        applycants: [],
        hasNextPage: 0,
        currentPage: 1
      }
    },
    created() {
      this.checkStyleList()
    },
    methods: {
      exportHande() {
        this.openBrowser(`/business/activity/participant/export?msgId=${this.routeQuery('msgId')}`)
      },
      handleSearch() {
        this.modelText ? this.searchApplycant() : this.checkStyleList()
      },
      inputHandle(e) {
        this.modelText ? this.searchApplycant() : this.checkStyleList()
      },
      checkStyleList() {
        Api.getCheckStyleList(this.routeQuery('msgId')).then(res => {
          if (res && res.code === '1') {
            this.datas = []
            this.applycants = []
            this.datas = res.datas
          }
        })
      },
      searchApplycant() {
        Api.getApplycantList(this.routeQuery('msgId'), this.modelText, 1).then(res => {
          if (res && res.code === '1') {
            if (res.hasNextPage > 0) {
              this.hasNextPage = res.hasNextPage
              this.currentPage = res.currentPage
            } else {
              this.hasNextPage = 0
            }
            this.datas = []
            this.applycants = []
            this.applycants = res.datas
          }
        })
      },
      scrollEnd(status) {
        this.hasNextPage > 0 && this.searchApplycant('', this.currentPage)
      },
      applycantsListHandle(data) {
        this.routePush({
          name: 'applycantsList1055App',
          query: {
            msgId: this.routeQuery('msgId'),
            titleText: data.key,
            type: data.type
          }
        })
      },
      applyDetailHandle(data) {
        this.routePush({
          name: 'applyAppDetail',
          query: {
            name: data.name,
            serialNumber: data.value,
            clientId: this.$store.state.CLIENTID,
            refId: new Date().getTime(),
            token: this.$store.state.TOKENID,
            msgId: this.routeQuery('msgId')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .check-style {
    &-search-bar {
      @include flex;
      @include ai;
      border: #ededed solid rem(1);
      .search-btn {
        flex: 2;
        width: rem(34);
        height: rem(45);
        cursor: pointer;
        border-left: rem(1) solid #ededed;
      }
      input {
        flex: 8;
        text-align: left;
        padding-left: rem(8);
        border: none;
        height: rem(45);
        line-height: rem(45);
      }
    }
  }
</style>
