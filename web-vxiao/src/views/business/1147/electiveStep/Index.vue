<template>
  <div class="elective-step"
       v-if="table">
    <div class="category-title txt">根据选课人数及走班课时，共需开{{table.datas.length}}个选修班级</div>
    <vx-table :data="table.datas"
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
      refresh: { type: [Boolean] },
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
      this.loadElectiveData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadElectiveData() {
        let form = this.obj.form || {}
        let data = form.electiveData || {}
        let scheduleId = form.schedule.id
        if (this.refresh) {
          Api.getElectiveInfo(scheduleId).then(res => {
            if (Check.isRealArray(res.subjects)) {
              this.table = {
                columns: ['选修班级', '任课老师'],
                datas: res.subjects
              }
              this.setCreateObject({
                form: {
                  ...form,
                  electiveData: {
                    ...data,
                    table: this.table
                  }
                }
              })
            }
          })
          this.$emit('update:refresh', false)
        } else if (data.table) {
          let table = JSON.parse(JSON.stringify(data.table))
          if (this.obj.electiveCache) {
            let cache = this.obj.electiveCache
            table.datas = table.datas.map(v => {
              if (v.subjectId === cache.subjectId) {
                return cache
              }
              return v
            })
            this.setCreateObject({
              form: {
                ...form,
                electiveData: {
                  ...data,
                  table: table
                }
              }
            })
            this.modifyCreateObjectField('electiveCache')
          }
          this.table = table
        }
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return row.subjectName
        }
        if (row.teachers) {
          let teachers = row.teachers.map(v => {
            return v.userName
          })
          return teachers.join('、')
        }
        return ''
      },
      handleColumn(row, i, rowIndex) {
        if (i === 0) {
          return false
        }
        this.setCreateObject({ electiveCache: row })
        this.routePush({
          path: '/vx/group/business/1147/electiveStep/selectMember'
        })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadElectiveData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .elective-step {
    .each-column {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
