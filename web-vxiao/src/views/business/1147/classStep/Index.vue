<template>
  <div class="class-step">
    <vx-table v-if="table"
              :data="table.datas"
              :height="maxHeight"
              stripe
              border
              @row-click="onRowClick">
      <template v-if="table.columns">
        <vx-table-column v-for="(item, i) in table.columns"
                         :key="i"
                         :fixed="i===0"
                         :label="item">
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'add' && i=== 0">
              <div @click="handleAdd">
                <i class="el-icon-plus plus-icon"></i>
                <span>新增</span>
              </div>
            </template>
            <template v-else-if="scope.row.type !== 'add'">
              <div v-html="colTxt(scope.row, i, scope.$index)"
                   class="ellipsis"></div>
            </template>
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
      let data = form.classTable || {}
      if (data.table) {
        this.table = JSON.parse(JSON.stringify(data.table))
      } else {
        this.loadClassData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadClassData() {
        let form = this.obj.form || {}
        let data = form.classData || {}
        let scheduleId = form.schedule.id
        Api.getClassInfo(scheduleId).then(res => {
          if (Check.isRealArray(res.groups)) {
            this.table = {
              columns: ['序号', '校区', '入学年份', '属性', '班级', '班级昵称', '班主任'],
              datas: [...res.groups, { type: 'add' }]
            }
            this.setCreateObject({
              form: {
                ...form,
                classData: {
                  ...data,
                  classes: res.groups
                }
              }
            })
          }
        })
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return rowIndex + 1
        } else if (index === 1) {
          return row.campus || ''
        } else if (index === 2) {
          return row.extension || ''
        } else if (index === 3) {
          return row.meta ? row.meta.obj : '行政班'
        } else if (index === 4) {
          return row.defaultName || ''
        } else if (index === 5) {
          return row.name || ''
        } else {
          if (row.relations) {
            let rs = row.relations.map(v => {
              return v.name
            })
            return rs.join('<br>')
          }
          return ''
        }
      },
      handleAdd() {
        this.routePush({ path: '/vx/group/business/1147/classStep/edit' })
      },
      onRowClick(row, index) {
        this.setCreateObject({ classCache: row })
        this.routePush({ path: '/vx/group/business/1147/classStep/edit' })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadClassData()
      }
    }
  }
</script>
