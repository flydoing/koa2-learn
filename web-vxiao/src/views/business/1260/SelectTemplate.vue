<template>
  <Page title="选择模板">
    <div class="template-list">
      <item v-for="(item, i) in list" :key="i" @click="handleItem(item)">
        <div slot="main" v-html="item.title"></div>
      </item>
    </div>
  </Page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        visit: 'getHomeVisit'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setHomeVisit']),
      fetchData() {
        const that = this
        Api.getTemplates(that.currentGroup.parentId).then(res => {
          that.list = res.templets || []
        })
      },
      handleItem(item) {
        this.setHomeVisit({ template: item })
        this.routeBack()
      }
    }
  }

</script>
