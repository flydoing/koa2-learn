<template>
  <page title="诵读推送">
    <div class="banner-img">
      <img v-lazy="{src:url(routeQuery('logo')),error:Image.IMG_COURSE_LOGO}"
           alt='群封面'>
    </div>
    <item v-for="(category, c) in categoryDatas"
          :key="c">
      <div slot="main">{{category.name}}</div>
      <div slot="remark">{{category.count}}</div>
    </item>
    <div class="list-button">
      <div class="button"
           @click="selectCourseHandle">选择课程</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        categoryDatas: []
      }
    },
    created() {
      if (this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('token')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      Api.getCetagory(this.routeQuery('courseGroupId'), 1, 1, 1).then(res => {
        if (res && res.code === '1') {
          this.categoryDatas = res.categorys
        }
      })
    },
    methods: {
      selectCourseHandle() {
        this.routePush({
          name: 'chantSelectedCourseResult',
          query: {
            courseId: this.routeQuery('courseId'),
            // courseGroupId: this.routeQuery('courseGroupId'),
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType'),
            isSchool: this.routeQuery('isSchool')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .banner-img {
    padding: rem(10) 0;
    img {
      display: block;
      width: 80%;
      margin: 0 auto;
    }
  }
</style>
