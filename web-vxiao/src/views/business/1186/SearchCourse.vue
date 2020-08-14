<template>
  <page title="课程搜索">
    <div class="search-bar search">
      <input type="text"
             placeholder="关键字/课程名"
             v-model="modelText">
      <div @click="searchHandle"><i class="ico ico-search" /></div>
    </div>
    <div class="grade-list"
         v-if="gradeList.length>0">
      <div class="search-title">年级</div>
      <div class="list">
        <div class="item"
             :class="{'cur': grade.cur}"
             v-for="(grade, g) in gradeList"
             :key="g"
             @click="gardeHandle(grade)">{{grade.name}}</div>
      </div>
    </div>
    <div class="subject-list"
         v-if="subjectList.length>0">
      <div class="search-title">科目</div>
      <div class="list">
        <div class="item"
             :class="{'cur': subject.cur}"
             v-for="(subject, s) in subjectList"
             :key="s"
             @click="subjectHandle(subject)">{{subject.name}}</div>
      </div>
    </div>
    <div class="publisher-list"
         v-if="publisherList.length>0">
      <div class="search-title">出版社</div>
      <div class="list">
        <div class="item"
             :class="{'cur': publisher.cur}"
             v-for="(publisher, p) in publisherList"
             :key="p"
             @click="publisherHandle(publisher)">{{publisher.name}}</div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        modelText: '',
        gradeList: [],
        gradeId: null,
        subjectList: [],
        subjectId: null,
        publisherList: [],
        publisherId: null
      }
    },
    created() {
      Api.getDefaultSearchKey().then(res => {
        if (res && res.code === '1') {
          this.gradeList = res.categorys
        }
      })
    },
    methods: {
      gardeHandle(g) {
        this.gradeList.forEach(_g => {
          this.$set(_g, 'cur', 0)
        })
        this.$set(g, 'cur', 1)
        this.gradeId = g.id
        Api.getDefaultSearchKey(g.id).then(res => {
          if (res && res.code === '1') {
            this.subjectList = res.categorys
          }
        })
        this.publisherList = []
      },
      subjectHandle(s) {
        this.subjectList.forEach(_s => {
          this.$set(_s, 'cur', 0)
        })
        this.$set(s, 'cur', 1)
        this.subjectId = s.id
        Api.getDefaultSearchKey(s.id).then(res => {
          if (res && res.code === '1') {
            this.publisherList = res.categorys
          }
        })
      },
      publisherHandle(p) {
        this.publisherList.forEach(_p => {
          this.$set(_p, 'cur', 0)
        })
        this.$set(p, 'cur', 1)
        this.publisherId = p.id
      },
      searchHandle() {
        let that = this
        let reqParam = {
          groupId: that.routeQuery('groupId'),
          appType: that.routeQuery('appType'),
          keyword: that.modelText,
          gradeId: that.gradeId,
          subjectId: that.subjectId,
          versionId: that.publisherId
        }
        this.routePush({
          name: 'chantSearchResultList',
          query: {
            groupId: that.routeQuery('groupId'),
            appType: that.routeQuery('appType'),
            isSchool: this.routeQuery('isSchool'),
            reqParam: reqParam
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .search-bar {
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

  .search-title {
    padding: rem(10) 0 rem(10) rem(21);
    font-size: rem(14);
    font-weight: 700;
  }

  .list {
    @include flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item {
      padding: rem(5) rem(10);
      line-height: rem(25);
      text-align: center;
      border: rem(1) solid #f9f9f9;
      float: left;
      margin: 0 rem(10) 0;
      border-radius: rem(5);
      cursor: pointer;
      &:hover {
        @include bc;
        color: #fff;
      }
      &.cur {
        @include bc;
        color: #fff;
      }
    }
  }
</style>
