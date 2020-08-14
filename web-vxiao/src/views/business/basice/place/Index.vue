<template>
  <Page title="场所管理">
    <label slot="btn"
           @click="importInfo">导入场所信息</label>
    <Item v-for="c in categories"
          :key="c.id"
          @click="handle(c)">
      <div>{{c.name}}</div>
      <div slot="remark">{{c.count}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        categories: [],
        sId: '' // schoolId
      }
    },
    activated() {
      this.sId = this.routeQuery('schoolId') || this.routeQuery('extension')
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    methods: {
      fetchData() {
        Api.loadPlaceCategorys(this.sId).then(res => {
          this.categories = res.categories
        })
      },
      importInfo() {
        this.$import({
          title: '导入场所信息',
          uploadURI: this.uploadURL,
          templateUrl: `/static/templates/basice_place.xlsx`,
          callback: (res, file) => {
            let fileId = res.file.id
            Api.importPlaceData(this.currentGroup.parentId, fileId).then(res => {
              if (res.commonTables) {
                this.setStorage('place_import_data', res.commonTables)
                this.routePush({ name: 'basiceImportPlace', query: { fileId: fileId } })
              } else {
                this.fetchData()
                this.$message({ message: '操作成功', type: 'success' })
              }
            })
          }
        })
      },
      handle(c) {
        this.routePush({
          name: 'basicePlaceList',
          query: {
            schoolId: this.sId,
            groupId: this.routeQuery('groupId'),
            title: c.name,
            id: c.id,
            type: c.value
          }
        })
      }
    }
  }
</script>
