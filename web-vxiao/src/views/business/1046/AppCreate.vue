<template>
  <Page title="新建CRM">
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title"
           v-if="i!=0"></div>
      <item v-for="(app,j) in item"
            :key="j"
            @click="handleApp(app)">
        <div slot="main"
             v-html="app.name"></div>
        <div slot="remark"
             v-html="app.info"></div>
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        let apps = []
        let appCrm = this.baseInfo.app.apps['1046']
        for (let v in this.baseInfo.app.apps) {
          let a = this.baseInfo.app.apps[v]
          if (a.parentId === appCrm.id) {
            apps.push(a)
          }
        }
        apps.sort((a, b) => {
          return a.sort - b.sort
        })

        let obj = {}
        apps.map(v => {
          let datas = obj[v.description]
          if (Check.isRealArray(datas)) {
            datas.push(v)
            obj[v.description] = datas
          } else {
            obj[v.description] = [v]
          }
        })

        for (let v in obj) {
          this.list.push(obj[v])
        }
      },
      handleApp(app) {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: app.type,
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
