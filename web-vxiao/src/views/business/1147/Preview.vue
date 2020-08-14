<template>
  <Page title="预排课表"
        closePrompt
        :loading="loading">
    <label slot="btn"
           @click="handlePublish">发布</label>
    <!-- <div slot="top">
      <div class="category-title text">点击选择课程后，可与橙色标记的课程对调。</div>
    </div> -->
    <div class="preview-course-tbl">
      <vx-table v-if="table"
                :data="table.datas"
                :height="maxHeight"
                stripe
                border>
        <template v-if="table.columns">
          <vx-table-column v-for="(item, i) in table.columns"
                           :key="i"
                           :fixed="i===0"
                           :label="item">
            <template slot-scope="scope">
              <div class="column-content"
                   v-html="colTxt(scope.row, i, scope.$index)"></div>
              <div class="column-item"
                   @click="handleColumn(scope.row, i, scope.$index)">
                <span v-html="colTxt(scope.row, i, scope.$index)"></span>
              </div>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        table: null,
        maxHeight: 0,
        weekNames: {
          1: '星期日',
          2: '星期一',
          3: '星期二',
          4: '星期三',
          5: '星期四',
          6: '星期五',
          7: '星期六'
        },
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      compare(property) {
        return function(a, b) {
          let value1 = a[property]
          let value2 = b[property]
          return value1 - value2
        }
      },

      fetchData() {
        let form = this.obj.form || {}
        let scheduleId = form.schedule.id
        this.loading = true
        Api.getCourseTable(this.currentGroup.parentId, scheduleId)
          .then(res => {
            if (res.schedule) {
              let gMap = new Map()
              let columns = ['班级']
              res.schedule.tables.forEach(v => {
                for (let i = 1; i <= v.properties.maxJie; i++) {
                  columns.push(`${this.weekNames[v.properties.week]}<br>第${i}节`)
                }
                v.lines.forEach(j => {
                  let data = gMap.get(j.group.groupId)
                  if (data) {
                    data.cells.push(...j.datas)
                    gMap.set(j.group.groupId, data)
                  } else {
                    gMap.set(j.group.groupId, {
                      group: j.group,
                      cells: j.datas
                    })
                  }
                })
              })

              let datas = []
              gMap.forEach((v, k, i) => {
                datas.push(v)
              })

              this.table = {
                columns: columns,
                datas: datas
              }
              this.loading = false
            }
          })
          .catch(res => {
            this.loading = false
          })
        if (this.obj.course) {
          this.modifyCreateObjectField('course')
        }
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return `${row.group.name}<br>${row.group.campus}`
        } else {
          let cell = row.cells[index - 1]
          if (cell) {
            return cell.course ? [cell.course, cell.userName, cell.place].join('<br>') : ''
          }
          return ''
        }
      },
      handleColumn(row, i, rowIndex) {
        return false
        // let cell = row.cells[i - 1]
        // if (i === 0 && !cell) {
        //   return false
        // }
        // this.setCreateObject({
        //   course: cell
        // })
        // this.routePush({ path: '/vx/group/business/1147/exchange' })
      },
      handlePublish() {
        let form = this.obj.form
        Api.publishCourseTable(form.schedule.id).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .preview-course-tbl {
    .column-content {
      visibility: hidden;
    }
    .column-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;

      span {
        display: inline-block;
        vertical-align: middle;
        padding: 0 rem(10);
      }

      &:after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }
    }
  }
</style>
