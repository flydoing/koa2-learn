<!-- 科目信息 -->
<template>
  <div class="subject-step">
    <vx-table v-if="table"
              :data="table.datas"
              :height="maxHeight"
              stripe
              border>
      <template v-if="table.columns">
        <vx-table-column v-for="(item, i) in table.columns"
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
      </template>

    </vx-table>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    props: {
      maxHeight: { type: [String, Number] },
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        table: null
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      let form = this.obj.form || {}
      let data = form.subjectData || {}
      if (data.table) {
        this.table = JSON.parse(JSON.stringify(data.table))
      } else {
        this.loadSubjectData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadSubjectData() {
        let form = this.obj.form || {}
        let data = form.subjectData || {}
        let scheduleId = form.schedule.id
        Api.getSubjectInfo(scheduleId).then(res => {
          if (!Check.isNullObject(res.commonTable)) {
            this.table = {
              columns: res.commonTable.headers,
              datas: res.commonTable.lines
            }
            this.setCreateObject({
              form: {
                ...form,
                subjectData: {
                  ...data,
                  table: this.table
                }
              }
            })
          }
        })
      },
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
        } else if (index === 5 || index === 6) {
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
        } else if (index > 6) {
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
          title = '开课人数上限'
          this.setStorage('_cache_subject_limit', row.datas[3])
          this.setStorage('_cache_subject_column', 'limit')
        } else if (index === 5) {
          title = '互斥科目'
          this.setStorage('_cache_subject_column', 'mutex')
          this.setStorage('_cache_subject_subjects', row.datas[4])
        } else if (index === 6) {
          title = '互补科目'
          this.setStorage('_cache_subject_column', 'complementation')
        } else {
          this.setStorage('_cache_subject_node', row.datas[index - 1])
          title = `${this.table.columns[index]} ${row.courseName}`
          this.setStorage('_cache_subject_column', 'node')
        }
        this.routePush({
          path: '/vx/group/business/basice/subject/edit',
          query: { title: title }
        })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadSubjectData()
      }
    }
  }
</script>
<style lang="scss">
  .subject-step {
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
