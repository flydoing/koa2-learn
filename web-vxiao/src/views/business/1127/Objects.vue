<template>
  <page title="评价对象">
    <div class="student-list">
      <item v-for="(item,i) in objects"
            :key="i"
            :item="item"
            @click="handleObject(item)">
        <div slot="before">
          <img class="avatar"
               v-lazy="{src:url(item.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        objects: [],
        metaData: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCourseEvaluate'
      })
    },
    methods: {
      ...mapActions(['setCourseEvaluate']),
      fetchData() {
        const that = this
        let uId = that.userId || that.routeQuery('uId')
        let evId = that.routeQuery('evId')
        Api.getStudents(uId, evId).then(res => {
          that.metaData = res.metaData
          that.objects = res.students
        })
      },
      handleObject(item) {
        this.setCourseEvaluate({ metaData: this.metaData, user: item })
        this.routePush({ name: 'evaluateDetail1127' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .student-list {
    img {
      margin: rem(5) 0;
    }
  }
</style>
