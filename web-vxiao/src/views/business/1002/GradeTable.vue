<template>
  <div id="grade-table">
    <page title="作业结果">
      <div>
        <!-- <web-page :dataUrl="obj"></web-page> -->
        <div class="grade-table-box">
          <div class="grade-table-title">
            <div>学生姓名</div>
            <div>家长评价</div>
            <div>老师评价</div>
          </div>
          <ul class="grade-table-list">
            <li v-for="(data, index) in datas" :key="index">
              <div>{{data.userName}}</div>
              <div>{{data.parentRating ? data.parentRating : '未评'}}</div>
              <div v-if="data.type !== '2'">{{data.optionName ? data.optionName : (data.score ? data.score : '未评')}}</div>
              <div v-else class="star-box">
                <i class="ico ico-star-press star" v-for="n in 5" :key="n" :class="{'active': n<=Number(data.optionName)}"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </page>
  </div>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  export default {
    mixins: [CardMixin],
    data() {
      return {
        datas: []
      }
    },
    created: function () {
      let that = this
      Api.getGradeTable(this.$route.query.msgId, this.userId).then(res => {
        if (res.code === '1') {
          that.datas = res.dataMap.datas
        }
      })
    },
    computed: {
      obj() {
        return {
          url: this.$route.query.url,
          params: {
            userId: this.userId
          }
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "~scss/_mixin";
  .grade-table-box {
    padding: 0 0 rem(10);
    .grade-table-title {
      @include flex;
      @include jc;
      @include ai;
      height: rem(40);
      border-right: 1px solid #ececec;
      background-color: nth($background, 1);
      div {
        flex: 1;
        font-size: nth($font-size, 3);
        color: nth($font-color, 7);
        text-align: center;
      }
    }
    .grade-table-list {
      border: 1px solid #ececec;
      border-right: none;
      border-bottom: none;
      li {
        @include flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        div {
          flex: 1;
          height: rem(40);
          line-height: rem(40);
          border-right: 1px solid #ececec;
          border-bottom: 1px solid #ececec;
          font-size: rem(14);
          color: #525252;
          text-align: center;
        }
        .star-box {
          @include flex;
          @include jc;
          @include ai;
          .star {
            width: rem(18);
            height: rem(18);
            margin-right: rem(5);
            font-size: rem(18);
            color: #9F9F9F;
            &.active {
              color: #f4ea2a; 
            }
          }
        }
      }
    }

  }

</style>
