<!-- 科目信息 -->
<template>
  <Page :loading="loading"
        title="科目信息"
        ref="_page">
    <div class="subject-table">
      <vx-table :data="tableData.datas"
                :height="maxHeight"
                stripe
                border>
        <vx-table-column v-for="(item, i) in tableData.columns"
                         :key="i"
                         :fixed="i===0"
                         :label="item"
                         :width="colWidth(i)">
          <template slot-scope="scope">
            <div v-html="colTxt(scope.row, i)"
                 class="ellipsis"
                 @click="handleColumn(scope.row, i)"></div>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import Cammand from '@/constant/cammand'
  export default {
    data() {
      return {
        loading: true,
        maxHeight: 100,
        tableData: {
          columns: [],
          datas: []
        }
      }
    },
    activated() {
      const that = this
      that.loading = true
      let schoolId = that.routeQuery('schoolId') || that.routeQuery('extension')
      Api.loadSubjectInfo(schoolId).then(res => {
        if (!Check.isNullObject(res.commonTable)) {
          that.tableData.columns = res.commonTable.headers
          that.tableData.datas = res.commonTable.lines
        }
        that.loading = false
      })
      // 禁用iOS滚动条
      this.$web.postJsAction({
        type: Cammand.ACTION_SCROLL_ENABLE,
        content: 0
      })
    },
    methods: {
      propTxt(value) {
        let txt = ''
        switch (value) {
          case '1':
            txt = '必修'
            break
          case '2':
            txt = '选修'
            break
          case '3':
            txt = '文科必修'
            break
          case '4':
            txt = '理科必修'
            break
        }
        return txt
      },
      colTxt(row, index) {
        if (row.courseId === 0) {
          return index === 0 ? row.courseName : ''
        }

        const txt = '<span class="placeholder">设置</span>'
        if (index === 0) {
          return row.courseName
        } else if (index === 2) {
          return this.propTxt(row.datas[1]) || txt
        } else if (index === 4 || index === 5) {
          let subjects = row.datas[index - 1]
          if (Check.isRealArray(subjects)) {
            return subjects
              .map(v => {
                return v.name
              })
              .join('、')
          } else {
            return txt
          }
        } else if (index > 5) {
          let d = row.datas[index - 1]
          return d.hasOwnProperty('weekNum') ? `每周${d.weekNum}节` : txt
        } else {
          return row.datas[index - 1] || txt
        }
      },
      colWidth(index) {
        if (index === 2 || index === 3) {
          return 50
        } else if (index === 4 || index === 5) {
          return 150
        } else {
          return 100
        }
      },
      handleColumn(row, index) {
        this.setStorage('_cache_subject', row)
        let title = ''
        if (index === 0 || row.courseId === 0) {
          title = row.courseId !== 0 ? '编辑科目' : '新增科目'
          this.setStorage('_cache_subject_column', 'name')
        } else if (index === 1) {
          title = '排课优先级'
          this.setStorage('_cache_subject_column', 'level')
        } else if (index === 2) {
          title = '属性'
          this.setStorage('_cache_subject_column', 'property')
        } else if (index === 3) {
          title = '学分'
          this.setStorage('_cache_subject_score', row.datas[2])
          this.setStorage('_cache_subject_column', 'score')
        } else if (index === 4) {
          title = '互斥科目'
          this.setStorage('_cache_subject_column', 'mutex')
          this.setStorage('_cache_subject_subjects', row.datas[3])
        } else if (index === 5) {
          title = '互补科目'
          this.setStorage('_cache_subject_column', 'complementation')
        } else {
          this.setStorage('_cache_subject_node', row.datas[index - 1])
          title = `${this.tableData.columns[index]} ${row.courseName}`
          this.setStorage('_cache_subject_column', 'node')
        }
        this.routePush({
          path: '/vx/group/business/basice/subject/edit',
          query: { title: title }
        })
      }
    }
  }
</script>
<style lang="scss">
  .subject-table {
    .el-table th > .cell,
    .el-table .cell {
      text-align: center;
    }

    .el-table .cell > div {
      @include fh;
      cursor: pointer;
    }
  }
</style>
