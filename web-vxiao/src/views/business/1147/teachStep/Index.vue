<template>
  <div class="teach-step">
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
            <div v-html="colTxt(scope.row, i, scope.$index)"></div>
            <div class="each-column"
                 @click="handleColumn(scope.row, i, scope.$index)">
            </div>
          </template>
        </vx-table-column>
      </template>
    </vx-table>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {
      maxHeight: { type: [String, Number] },
      timeStamp: { type: [String, Number] }
    },
    components: {},
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
      let data = form.teachData || {}
      if (data.table) {
        this.table = JSON.parse(JSON.stringify(data.table))
      } else {
        this.loadTeachData()
      }
      if (this.obj.teachCache) {
        this.modifyCreateObjectField('teachCache')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadTeachData() {
        let form = this.obj.form || {}
        let data = form.teachData || {}
        let scheduleId = form.schedule.id
        Api.getTeachInfo(scheduleId).then(res => {
          if (Check.isRealArray(res.tables)) {
            let tbl = res.tables[0]
            let headers = tbl.headers.map(v => {
              return v.name
            })
            this.table = {
              columns: ['校区', '班级', ...headers],
              datas: tbl.lines
            }
            this.setCreateObject({
              form: {
                ...form,
                teachData: {
                  ...data,
                  table: this.table
                }
              }
            })
          }
        })
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return row.campus
        } else if (index === 1) {
          return row.groupName || ''
        } else {
          let cell = row.cells[index - 2]
          if (Check.isRealArray(cell.relations)) {
            let users = cell.relations.map(v => {
              return v.name
            })
            return users.join('、')
          }
          return ''
        }
      },
      handleColumn(row, i, rowIndex) {
        if (i < 2) {
          return false
        }
        let cell = row.cells[i - 2]
        this.setCreateObject({ teachCache: { ...cell, campusId: row.campusId } })
        this.routePush({
          path: '/vx/group/business/1147/teachStep/addMember',
          query: {
            title: `${row.groupName} - ${this.table.columns[i - 2]}`
          }
        })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadTeachData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .teach-step {
    .each-column {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
