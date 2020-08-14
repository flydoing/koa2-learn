<template>
  <Page title="应用中心">
    <div v-for="(c,k) in categorys"
         :key="k">
      <div class="category-title">{{c.name}}</div>
      <Item v-for="(app,i) in c.apps"
            :key="i"
            @click="handleApp(app)">
        <div>{{app.name}}</div>
        <div slot="after">
          <i-switch :value="app.relation.displayMode | filerStatus"
                    :trueValue="1"
                    :falseValue="2"
                    @click="handleApp(app)" />
        </div>
      </Item>
    </div>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    computed: {
      ...mapGetters(['getGroupsApps']),
      categorys() {
        let c = new Map()
        let apps = this.getGroupsApps(this.groupId, true)
        if (Check.isRealArray(apps)) {
          apps.forEach(app => {
            let r = app.relation
            if (r.status === 'd' || r.hideClient === 'all' || r.hideClient === 'web') {
              return
            }
            let key = app.appCategoryName || '其他'
            c.set(key, [...(c.get(key) || []), ...[app]])
          })
        }
        let categorys = []
        c.forEach((value, key) => {
          categorys.push({
            name: key,
            apps: value
          })
        })
        return categorys
      }
    },
    methods: {
      ...mapActions(['modifyAppRelation']),
      handleApp(app) {
        let r = app.relation
        Api.addAppRelation({
          appRelations: [
            {
              id: r.id,
              groupId: r.groupId,
              displayMode: r.displayMode === 2 ? 1 : 2
            }
          ]
        }).then(res => {
          res.appRelations.forEach(r => {
            this.modifyAppRelation(r)
          })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }
    },
    filters: {
      filerStatus(v) {
        return v === 2 ? 2 : 1
      }
    }
  }
</script>
