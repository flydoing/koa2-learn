<template>
  <page title="答题情况">
    <div v-for="(data, d) in datas" v-if="datas.length>0" :key="d">
      <div class="category-title">{{data.name}}</div>
      <div class="users">
        <div class="user" v-for="(user, u) in data.datas" :key="u">
          <img v-lazy="{src:url(user.avatar),error:Image.ICO_USER}" alt='头像'>
          <p>{{user.name}}</p>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        datas: []
      }
    },
    created() {
      Api.loadAnswerQuestions(this.routeQuery('praxisId'), this.routeQuery('questionId'), this.routeQuery('type')).then(
        res => {
          this.datas = res.datas
        }).catch(res => {})
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .users {
    @include flex;
    flex-wrap: wrap;
    .user {
      margin: rem(10) rem(10);
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

</style>
