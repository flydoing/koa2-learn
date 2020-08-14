<template>
  <page :title="title">
    <div class="tableWrapper">
      <vx-table v-if="tableData"
                :data="datas"
                :height="maxHeight"
                border>
        <template v-if="tableData.columns">
          <vx-table-column width="120"
                           v-for="(item,i) in columns"
                           :key="i"
                           :label="item"
                           :fixed="i===0">
            <template slot-scope="scope">
              <span class="text"
                    v-if="i===0"
                    v-html="scope.row.coumns[i].name"></span>
              <span class="text"
                    v-else
                    v-html="formatNum(scope.row.coumns[i].name)"></span>
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
        templateId: '',
        title: '',
        status: true,
        tableData: null,
        school_Id: '',
        maxHeight: 0
      }
    },
    created() {
      this.editStatus = this.$route.query.status ? this.$route.query.status : ''
      this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
      this.school_Id = this.$route.query.schoolId ? this.$route.query.schoolId : ''
      this.title = this.$route.query.name ? this.$route.query.name : ''
      this.getReportDetail()
    },
    computed: {
      datas() {
        return this.tableData.datas || []
      },
      columns() {
        return this.tableData.columns || []
      }
    },
    methods: {
      formatNum(num) {
        if (num) {
          var reg = num.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
          return num.replace(reg, '$1,')
        }
      },
      getReportDetail() {
        let schoolId
        if (this.isEducation) {
          schoolId = this.school_Id
        } else {
          schoolId = this.schoolId
        }
        Api.getTemplateDetail(schoolId, this.templateId).then(res => {
          this.tableData = res.tableData
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .category-title {
    text-align: center;
  }
  .text {
    height: 50px;
    line-height: 50px;
  }
</style>
