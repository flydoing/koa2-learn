<template>
  <page title="选拔详情">
    <div class="selection-detail">
      <div v-for="(user, i) in detail.datas" :key="i">
        <div class="category-title" v-html="user.title"></div>
        <item v-for="(item, j) in user.datas" :key="j" @click="handleItem(user, item)">
          <div slot="main" v-html="item.description"></div>
          <div slot="remark" v-html="item.result"></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        detail: {}
      }
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      })
    },
    created() {
      let pId = this.routeQuery('pId')
      Api.getSelectionDetail(pId).then(res => {
        this.detail = res.publish
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      handleItem(user, item) {
        this.setSelection({ item: { ...item, ...user }, publish: this.detail })
        if (item.courseId) {
          this.routePush({ name: 'courseInfo1096' })
        } else {
          this.routePush({ name: 'courseList1096' })
        }
      }
    }
  }

</script>
