<template>
  <page :title="titleText" @scrollEnd="scrollEnd">
    <div class="catelog-list">
      <CardList :messages="listDatas" v-if="listDatas.length>0"></CardList>
      <div v-else class="catelog-list-tips">
        <div>
          <img v-lazy="{src:'/static/ico/icon_commoneuse.png'}" alt="" />
          <p>暂无内容</p>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        listDatas: [],
        currentPage: 1,
        hasNextPage: 0,
        titleText: this.routeQuery('title')
      }
    },
    created() {
      this.loadMsgList()
    },
    methods: {
      loadMsgList(currentPage = 1) {
        let that = this
        Api.loadCategoryChildMsg(this.currentGroup.groupId, this.routeQuery('categoryId'), currentPage).then(res => {
          if (res.messages) {
            if (res.hasNextPage > 0) {
              this.hasNextPage = res.hasNextPage
              this.currentPage = res.currentPage
            } else {
              this.hasNextPage = 0
            }
            res.messages.forEach(m => {
              that.listDatas.push(m)
            })
          }
        })
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.loadMsgList(this.currentPage)
        }
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .catelog-list {
    &-tips {
      @include flex;
      @include jc;
      @include ai;
      height: rem(300);
      background-color: #fff;
      div {
        p {
          margin-top: rem(20);
          font-size: rem(16);
          color: #9f9f9f;
        }
      }
    }

  }

</style>
