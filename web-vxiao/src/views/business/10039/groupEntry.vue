<template>
  <page :title="title">
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
                           :fixed="i===0 && columns.length>5">
            <template slot-scope="scope">
              <!-- <span class="text" v-
                    v-html="scope.row.columns[i]"></span> -->
              <span class="text"
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
  import Cammand from '@/constant/cammand.js'
  export default {
    mixins: [R],
    data() {
      return {
        status: false,
        successStatus: false,
        tableData: null,
        title: '',
        maxHeight: 0
      }
    },
    created() {
      this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
      this.title = this.$route.query.name ? this.$route.query.name : ''
      this.getTableData()
      this.$web.postJsAction({
        type: Cammand.ACTION_TITLE,
        content: this.title
      })
    },
    computed: {
      // tableData() {
      //   return this.tab.table || {}
      // },
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
        const schoolId = this.routeQuery('schoolId') ? this.routeQuery('schoolId') : this.schoolId
        Api.getEducationReport(schoolId, this.templateId).then(res => {
          this.tableData = res.table
        })
      },
      importFile() {
        let url
        if (this.templateId === 1) {
          url = '/static/templates/finance-template-1.xls'
        } else if (this.templateId === 2) {
          url = '/static/templates/finance-template-2.xls'
        } else if (this.templateId === 5) {
          url = '/static/templates/finance-template-plan.xls'
        }
        this.$import({
          title: '导入报表',
          uploadURI: this.uploadURL,
          templateUrl: url,
          callback: (res, file) => {
            this.status = true

            Api.importData({
              schoolId: this.schoolId,
              fileId: res.file.id,
              templateId: this.templateId
            })
              .then(res => {
                if (res.code === '1') {
                  this.successStatus = true
                  this.getTableData()
                }
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
          name: 'table10039',
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
