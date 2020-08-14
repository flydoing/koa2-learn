<template>
  <page :title="title">
    <div v-if="routeQuery('questionType') === '12'">
      <!-- 填空题 -->
      <div v-if="datas.length>0" v-for="(data, d) in datas" :key="d">
        <div class="category-title">{{data.name}}</div>
        <item v-if="data.datas.length>0" v-for="(dt, k) in data.datas" :key="k" :hasClick="false">
          <div>{{dt.name}}：{{dt.data}}</div>
        </item>
      </div>
    </div>
    <div class="option-users" v-else>
      <div class="option-users-item" v-if="users.length>0" v-for="(user, u) in users" :key="u">
        <img v-lazy="{src:url(user.avatar),error:Image.ICO_USER}" alt='头像'>
        <p>{{user.name}}</p>
      </div>
    </div>
    <div class="blank-tips" v-if="datas.length===0 && users.length===0">
      <div>
        <img v-lazy="{src:'/static/ico/icon_commoneuse.png'}" alt="" />
        <p>暂无内容</p>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        title: '',
        users: [],
        datas: []
      }
    },
    created() {
      // questionType--> 单选题、多选题不传 、填空题为12、图片排序为13
      // 图片排序 和 文字排序 和 连线题 拉取答题情况的接口与其他题型不同
      if (this.routeQuery('questionType') === '13' || this.routeQuery('questionType') === '17' || this.routeQuery(
          'questionType') === '16') {
        Api.getImgSortCorrectRate(this.routeQuery('questionId'), this.routeQuery('type')).then(res => {
          this.users = res.datas
          this.title = `${this.users.length}人${this.routeQuery('titleText') || '答对'}`
        })
      } else {
        Api.getOptionSelectUsers(this.routeQuery('praxisId'), this.routeQuery('optionId'), this.routeQuery(
          'questionType')).then(res => {
          // 填空题获取需要多带一个参数questionType，返回数据格式也不一样
          if (this.routeQuery('questionType') === '12') {
            this.title = '题目详情'
            this.datas = res.datas || []
          } else {
            this.users = res.users || []
            this.title = res.title
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .option-users {
    @include flex;
    flex-wrap: wrap;
    &-item {
      margin: rem(10) rem(13);
      width: rem(60);
      text-align: center;
      img {
        display: block;
        margin: rem(5) auto;
        width: rem(50);
        height: rem(50);
        border-radius: 100%;
      }
      p {
        font-size: rem(12);
        color: #666;
        text-align: center;
        width: rem(60);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .blank-tips {
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

</style>
