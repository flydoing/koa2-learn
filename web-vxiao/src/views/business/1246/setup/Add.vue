<template>
  <Page title="新增">
    <label slot="btn"
           @click="batch">批量新增</label>
    <Item @click="place">
      <div>场所名称</div>
      <div slot="remark">{{placeName}}</div>
    </Item>
    <Item :hasClick="false">
      <div>屏幕序列号</div>
      <input slot="remark"
             placeholder="输入屏幕序列号"
             v-model="vscreen.serialNumber" />
    </Item>
    <Item @click="category">
      <div>屏幕类型</div>
      <div slot="remark">{{categoryName}}</div>
    </Item>
    <div class="list-button">
      <el-button type="primary"
                 icon="el-icon-upload"
                 size="medium"
                 @click="submit">提交</el-button>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  export default {
    mixins: [R],
    data() {
      return {
        vscreen: {
          schoolId: '',
          serialNumber: '',
          placeId: '',
          categoryId: ''
        },
        placeName: '',
        categoryName: '请选择班牌类型',
        schoolId: ''
      }
    },
    methods: {
      submit() {
        if (Check.isNullString(this.vscreen.serialNumber)) {
          this.$message({ type: 'warning', message: '序列号不能为空' })
          return
        }
        if (Check.isNullString(this.vscreen.placeId)) {
          this.$message({ type: 'warning', message: '场所不能为空' })
          return
        }
        if (Check.isNullString(this.vscreen.categoryId)) {
          this.$message({ type: 'warning', message: '分类不能为空' })
          return
        }
        Api.addScreen({ screens: [this.vscreen] })
          .then(res => {
            this.$message({ type: 'success', message: '添加成功' })
            this.routeBack()
          })
          .catch(res => {})
      },
      place() {
        this.routePush({
          path: '/vx/group/place/select',
          query: {
            schoolId: this.schoolId
          }
        })
      },
      category() {
        this.routePush({
          path: '/vx/group/business/1246/setup/select/category',
          query: {
            schoolId: this.schoolId
          }
        })
      },
      batch() {
        this.$import({
          title: '批量导入',
          uploadURI: this.uploadURL,
          templateUrl: `/static/templates/vscreen.xls`,
          callback: (res, file) => {
            let fileId = res.file.id
            Api.importVscreens(this.schoolId, this.USER.id, fileId)
              .then(result => {
                this.$message({ type: 'success', message: '操作成功' })
              })
              .catch(result => {
                if (result.commonTable) {
                  let tbl = result.commonTable
                  this.setStorage('_import_receipt', { lines: tbl.lines, headers: tbl.headers })
                  this.routePush({
                    path: '/vx/group/import/receipt',
                    query: {
                      uri: `/terminal/vscreen/importScreenByFileId/${this.schoolId}/${this.USER.id}`,
                      fileId: fileId
                    }
                  })
                }
              })
          }
        })
      }
    },
    activated() {
      this.schoolId = this.routeQuery('schoolId')
      this.$set(this.vscreen, 'schoolId', this.schoolId)
      let cachePlace = this.getStorage('_cache_place')
      if (cachePlace) {
        this.placeName = cachePlace.name
        this.$set(this.vscreen, 'placeId', cachePlace.id)
      }
      let cacheCategory = this.getStorage('_cache_category')
      if (cacheCategory) {
        this.categoryName = cacheCategory.name
        this.$set(this.vscreen, 'categoryId', cacheCategory.id)
      }
    }
  }
</script>
