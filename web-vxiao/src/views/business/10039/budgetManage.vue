<template>
  <page title="预算管理">
    <label slot="btn"
           @click="importFile">导入</label>
    <div class="category-title"
         v-show="status">{{uploadStatus}}</div>
    <div class="tableWrapper">
      <vx-table v-if="tableData"
                :data="datas"
                :height="maxHeight"
                border
                @row-click="rowClick">
        <template v-if="tableData.columns">
          <vx-table-column width="120"
                           v-for="(item,i) in columns"
                           :key="i"
                           :label="item"
                           :fixed="i===0">
            <template slot-scope="scope">
              <span class="text"
                    v-if="i===0 || i ===1"
                    v-html="scope.row.columns[i]"></span>
              <span class="text"
                    v-else
                    v-html="formatNum(scope.row.columns[i])"></span>
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
        maxHeight: 0
      }
    },
    created() {
      // this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
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
      getTableData() {
        const schoolId = this.schoolId
        const templateId = '5'
        Api.getEducationReport(schoolId, templateId).then(res => {
          this.tableData = res.table
        })
      },
      importFile() {
        this.$import({
          title: '导入报表',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/finance-template-plan.xls',
          callback: (res, file) => {
            this.status = true

            Api.importData({
              schoolId: this.schoolId,
              fileId: res.file.id,
              templateId: '5'
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
      rowClick(item, index) {
        if (!item.clickAble) return
        this.routePush({
          name: 'budgetDetail10039',
          query: { templateId: item.params.extension, schoolId: item.params.parentId, name: item.columns[1] }
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
  .text {
    height: 50px;
    line-height: 50px;
  }
</style>
