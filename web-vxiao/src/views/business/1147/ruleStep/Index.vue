<template>
  <div class="rule-step">
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
                 :class="{'selected':selectStatus(scope.row, i), 'disabled': disableStatus(scope.row, i)}"
                 @click="handleColumn(scope.row, i, scope.$index)">
              <span v-html="colTxt(scope.row, i, scope.$index)"></span>
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
      }),
      selectedRules() {
        if (this.table) {
          let rules = []
          this.table.datas.map(v => {
            let ds = v.datas.filter(v => {
              return v.selected
            })
            rules.push(...ds)
          })
          return rules
        }
        return []
      }
    },
    created() {
      let form = this.obj.form || {}
      let data = form.ruleData || {}
      if (data.table) {
        this.table = JSON.parse(JSON.stringify(data.table))
      } else {
        this.loadRuleData()
      }
      if (this.obj.ruleCache) {
        this.modifyCreateObjectField('ruleCache')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadRuleData() {
        let form = this.obj.form || {}
        let data = form.ruleData || {}
        let scheduleId = form.schedule.id
        Api.getRuleInfo(scheduleId).then(res => {
          if (Check.isRealArray(res.tables)) {
            let tbl = res.tables[0]
            this.table = {
              columns: tbl.headers,
              datas: tbl.lines
            }
            this.setCreateObject({
              form: {
                ...form,
                ruleData: {
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
          return row.title
        } else {
          let cell = row.datas[index - 1]
          if (Check.isRealArray(cell.datas)) {
            let datas = cell.datas.map(v => {
              return v.extension
            })
            return datas.join('<br>')
          }
          return '预设规则'
        }
      },
      selectStatus(row, i) {
        if (row.datas[i - 1]) {
          let selected = row.datas[i - 1].selected
          return selected !== undefined && selected
        }
        return false
      },
      disableStatus(row, i) {
        if (row.datas[i - 1]) {
          return row.datas[i - 1].isWalk
        }
        return false
      },
      handleColumn(row, i, rowIndex) {
        let cell = row.datas[i - 1]
        if (i === 0 || cell.isWalk) {
          return false
        }
        let form = this.obj.form
        this.$set(cell, 'selected', !cell.selected)
        this.setCreateObject({
          form: {
            ...form,
            ruleData: {
              rules: this.selectedRules,
              table: this.table
            }
          }
        })
      }
    },
    watch: {
      timeStamp(val) {
        let data = this.obj.form.ruleData || {}
        if (!Check.isRealArray(data.rules)) {
          this.loadRuleData()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rule-step {
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

      &.selected {
        background: nth($background, 3);
        color: #fff;
      }
      &.disabled {
        background: #ccc;
        color: #fff;
      }
    }
  }
</style>
