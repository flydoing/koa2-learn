<template>
  <div class="room-step">
    <template v-for="(tbl, i) in tables">
      <div v-if="tbl.lines"
           :key="i">
        <div class="category-title text"
             v-html="tbl.campus.name"></div>
        <vx-table :data="tbl.lines"
                  stripe
                  border
                  @row-click="onRowClick">
          <template v-if="tbl.headers">
            <vx-table-column v-for="(item, j) in tbl.headers"
                             :key="j"
                             :label="item">
              <template slot-scope="scope">
                <template v-if="scope.row.type === 'add' && j === 0">
                  <div @click="handleAdd(tbl.campus)">
                    <i class="el-icon-plus plus-icon"></i>
                    <span>新增</span>
                  </div>
                </template>
                <template v-else-if="scope.row.type !== 'add'">
                  <div v-html="colTxt(scope.row, j, scope.$index)"
                       class="ellipsis"></div>
                </template>
              </template>
            </vx-table-column>
          </template>
        </vx-table>
      </div>
    </template>
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
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        tables: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      let form = this.obj.form || {}
      let data = form.roomTable || {}
      if (data.tables) {
        this.table = JSON.parse(JSON.stringify(data.tables))
      } else {
        this.loadRoomData()
      }
      if (this.obj.campus) {
        this.modifyCreateObjectField('campus')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadRoomData() {
        let form = this.obj.form || {}
        let data = form.roomData || {}
        Api.getRoomInfo(this.currentGroup.parentId).then(res => {
          if (Check.isRealArray(res.tables)) {
            this.tables = res.tables.map(v => {
              v.headers = ['序号', '楼宇', '场所名称', '常驻班级', '容纳班数', '科目限定']
              if (v.lines) {
                v.lines.push({ type: 'add' })
              } else {
                v.lines = [{ type: 'add' }]
              }
              v.campus = v.properties.campus
              return v
            })
            this.setCreateObject({
              form: {
                ...form,
                roomData: {
                  ...data,
                  tables: this.tables
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
          return row.floorName || ''
        } else if (index === 2) {
          return row.name || ''
        } else if (index === 3) {
          return row.groupName || '（无）公共场所'
        } else if (index === 4) {
          return row.maxClass || ''
        } else {
          if (row.courses) {
            let cs = row.courses.map(v => {
              return v.name
            })
            return cs.join('<br>')
          }
          return '不限'
        }
      },
      handleAdd(campus) {
        this.setCreateObject({ campus: campus })
        this.routePush({ path: '/vx/group/business/1147/roomStep/edit' })
      },
      onRowClick(row, index) {
        this.setCreateObject({ roomCache: row })
        this.routePush({ path: '/vx/group/business/1147/roomStep/edit' })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadRoomData()
      }
    }
  }
</script>
<style lang="scss">
  .room-step {
    .category-title {
      text-align: center;
    }
  }
</style>
