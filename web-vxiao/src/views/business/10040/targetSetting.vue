<template>
  <page title="目标设置"
        hasSubmit
        @submit="targetSubmit">
    <label slot="btn"
           @click="importFile">导入</label>
    <div class="category-title"
         v-show="status">{{uploadStatus}}</div>
    <div class="tableWrapper">
      <vx-table v-if="tableData"
                :data="datas"
                :height="maxHeight"
                border>
        <template v-if="tableData.columns">
          <vx-table-column :width="widthChange(item,i)"
                           v-for="(item,i) in columns"
                           :key="i"
                           :label="item"
                           :fixed="i===0 && columns.length>4">
            <template slot-scope="scope">
              <div v-if="i === 0">{{scope.row.coumns[i].name}}</div>
              <input type="text"
                     v-else
                     v-model.trim="scope.row.coumns[i].name"
                     class="input_from">
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>

  </page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        status: false,
        successStatus: false,
        tableData: null,
        title: '',
        maxHeight: 0,
        test: ''
      }
    },
    created() {
      this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
      this.title = this.$route.query.name ? this.$route.query.name : ''
      this.getTableData()
    },
    computed: {
      datas() {
        return this.tableData.datas || []
      },
      columns() {
        return this.tableData.columns || []
      },
      uploadStatus() {
        if (this.successStatus && this.status) {
          return '导入成功'
        } else if (this.status) {
          return '模板上传成功,正在后台导入'
        } else {
          return '导入成败'
        }
      }
    },
    methods: {
      formatNum(num) {
        if (num) {
          var reg = num.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
          return num.replace(reg, '$1,')
        }
      },
      widthChange(item, i) {
        if (i === 0) {
          return 250
        } else {
          return 140
        }
      },
      forMat(item) {
        if (isNaN(Number(item.name))) {
          this.$message.warning('请输入数字')
          return false
        } else {
          if (Number(item.name) < 0) {
            this.$message.warning('请输入正整数')
            return false
          } else {
            if (item.name && item.name.indexOf('.') !== -1) {
              this.$message.warning('请输入正整数')
              return false
            }
          }
          return true
        }
      },
      getTableData() {
        const schoolId = this.schoolId
        const templateId = '3'
        Api.getTemplateDetail(schoolId, templateId).then(res => {
          this.tableData = res.tableData
          this.tableData.datas.forEach(item => {
            item.coumns.forEach(subItem => {
              if (subItem.code) {
                subItem.name = this.formatNum(subItem.name)
              }
            })
          })
        })
      },
      importFile() {
        this.$import({
          title: '导入报表',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/performance-plan-set.xls',
          callback: (res, file) => {
            this.status = true

            Api.importData({
              schoolId: this.schoolId,
              fileId: res.file.id,
              templateId: '3'
            })
              .then(res => {
                this.successStatus = true
                this.getTableData()
              })
              .catch(() => {
                this.status = false
                this.successStatus = false
                console.log('失败')
              })
          }
        })
      },
      targetSubmit() {
        const templateId = '3'
        let obj = {}
        let status = true
        this.tableData.datas.some(item => {
          let arr = []
          item.coumns.some(subItem => {
            if (subItem.code) {
              if (subItem.name && subItem.name.indexOf('/') === -1) {
                if (subItem.name.indexOf(',') !== -1) {
                  subItem.name = subItem.name.replace(/,/g, '')
                }
                if (!this.forMat(subItem)) {
                  status = false
                  return true
                }
              }
              obj[subItem.code] = arr
              arr.push(subItem.name)
            }
          })
        })
        if (!status) return
        obj = JSON.stringify(obj)
        let query = {
          schoolId: this.schoolId,
          templateId: templateId,
          data: obj
        }
        Api.saveFormData(query).then(res => {
          if (res.code === '1') {
            this.$message.success('保存成功')
            this.routeBack()
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .category-title {
    text-align: center;
    color: #00c162;
  }
  .input_from {
    border: none;
    outline: none;
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: inherit;
  }
</style>
