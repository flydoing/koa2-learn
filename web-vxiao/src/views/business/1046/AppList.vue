<template>
  <AppPage title="CRM">
    <div v-for="(item,i) in apps"
         :key="i"
         :item="item">
      <div class="category-title"
           v-if="i!=0"></div>
      <item v-for="(app,j) in item.datas"
            :key="j"
            :app="app"
            @click="handleApp(app)">
        <div slot="main"
             v-html="app.name"></div>
      </item>
    </div>
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: { app: Object },
    components: {},
    data() {
      return {
        apps: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCrm']),
      fetchData() {
        const that = this
        Api.loadCrmAppList(that.groupId).then(res => {
          that.apps = res.appSummarys
        })
      },
      handleApp(app) {
        this.routePush({
          name: 'appDetail1046',
          query: {
            appType: app.type,
            groupId: this.groupId
          }
        })
      }
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      }
    }
  }
</script>
