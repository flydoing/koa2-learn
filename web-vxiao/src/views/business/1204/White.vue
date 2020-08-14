<template>
  <Page title="白名单">
    <div class="vx-transfer">
      <el-transfer @change="onChange"
                   v-model="apps"
                   :data="unApps"
                   :titles="['黑名单','白名单']"
                   :props="{key: 'appId',label: 'name'}"></el-transfer>
    </div>
    <!-- <Item v-for="(app,i) in apps"
          :hasClick="false"
          :key="i">
      <div>{{app.name}}</div>
      <div slot="after"
           @click="onDelete(app)">
        <i class="ico ico-delete"></i> </div>
    </Item> -->
  </Page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        apps: [],
        unApps: []
      }
    },
    created() {
      Api.getVpadAppList(this.routeQuery('schoolId')).then(res => {
        this.unApps = res.appRelations
        res.appRelations.forEach((app, i) => {
          app.status === '1' && this.apps.push(i + 1)
        })
      })
    },
    methods: {
      onChange(a, b, c) {
        c.forEach(_index => {
          Api.modifyVpadApp({
            appRelations: [
              {
                ...this.unApps[c - 1],
                schoolId: this.routeQuery('schoolId'),
                status: b === 'left' ? 'd' : '1'
              }
            ]
          }).then(res => {
            this.$message({ type: 'success', message: '修改成功' })
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  .vx-transfer {
    @include ct;
    padding: rem(10);
  }
</style>
