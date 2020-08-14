<template>
  <page :title="title"
        :showTips="catalogues.length===0">
    <div slot="btn">
      <label @click="changeCourse"
             v-if="isClass || isSchool">换课程</label>
    </div>
    <item v-if="catalogues.length>0"
          v-for="(item, i) in catalogues"
          :key="i"
          @click="itemClick(item)">
      <div>{{item.name}}</div>
      <div slot="remark">{{item.count > 0 ? item.count : ''}}</div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        catalogues: [],
        title: ''
      }
    },
    created() {
      let reqBody = {
        groupId: this.routeQuery('groupId'),
        range: this.routeQuery('range'),
        isCount: 1,
        isGlobal: 1,
        isSerial: 1
      }
      if (this.routeQuery('type') === '1047') {
        reqBody.queryType = '1269'
      } else {
        reqBody.extension = '1269'
      }
      Api.getResourceCatalogues(reqBody).then(res => {
        this.catalogues = res.categorys || []
      })
      this.title = this.routeQuery('groupName') || '目录'
    },
    methods: {
      changeCourse() {
        this.routeReplace({
          name: 'classRoomCourseList1269',
          query: {
            range: this.routeQuery('range'),
            appName: this.routeQuery('appName'),
            type: this.routeQuery('type'),
            msgType: this.routeQuery('msgType')
          }
        })
      },
      itemClick(item) {
        // if (item.count === 0) {
        //   this.$message({
        //     type: 'warning',
        //     message: '该目录下没有资源，请选择其他目录'
        //   })
        //   return false
        // }
        this.routePush({
          name: 'classRoomDetailList1269',
          query: {
            range: this.routeQuery('range'),
            appName: this.routeQuery('appName'),
            categoryName: item.name,
            categoryId: item.id,
            groupId: item.groupId,
            type: this.routeQuery('type'),
            msgType: this.routeQuery('msgType')
          }
        })
      }
    }
  }
</script>
