<template>
  <page title="新建食谱"
        closePrompt
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <el-dropdown trigger="click"
                 @command="handleDate"
                 style="display: block;">
      <item>
        <div>日期</div>
        <span slot="remark">{{cookCreate.curDate.remark}}</span>
      </item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(date,i) in cookCreate.dates"
                          :key="i"
                          :command="date">{{date.remark}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title text">
      <span class="right href-text"
            @click="importCookBook">
        导入食谱
      </span>
    </div>
    <Tables :tableData="cookCreate.tables"
            v-if="cookCreate.tables.columns.length>1"
            :cellClick="true"
            :multiple="true">
      <template v-for="(row,i) in cookCreate.tables.datas"
                slot="content">
        <tr class="t-row"
            :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
            :key="i">
          <td :style="{color:row.color?row.color:'#333'}"
              v-for="(cell,o) in row.columns"
              @click="cellClick(cell,row,i,o)"
              :key="o"
              class="t-cell">
            <div class="limit-row"
                 v-html="cell"></div>
          </td>
        </tr>
      </template>
    </Tables>
  </page>
</template>
<script>
  import DateUtil from '@/utils/date'
  import MsgApi from '@/api/message'
  import Api from './api'
  import Tables from '@/views/business/1237/Table'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Tables
    },
    data() {
      return {
        cookCreate: {
          dates: [],
          curDate: {},
          tables: {
            columns: ['日期'],
            datas: []
          },
          mealTimes: []
        }
      }
    },
    computed: {
      ...mapGetters({
        cacheCooks: 'getCookCreate'
      })
    },
    activated() {
      if (this.cacheCooks.isEdit) {
        this.cookCreate = {
          ...this.cacheCooks
        }
      } else {
        Api.getMealTime(this.currentGroup.groupId).then(res => {
          this.cookCreate.mealTimes = [...res.mealTimes]
          res.mealTimes.forEach(mealTime => {
            this.cookCreate.tables.columns.push(mealTime.name)
          })
          this.initTables()
        })
        let startDate = DateUtil.plusDate(new Date(), 1)
        let isStartBol = true
        for (let i = 0; i < 6; i++) {
          if (i < 3) {
            this.cookCreate.dates.push(this.getTime(startDate, true))
            startDate = DateUtil.plusDate(startDate, 1)
          } else {
            if (new Date().getDay() === 0) {
              if (isStartBol) {
                startDate = DateUtil.plusDate(new Date(), 1)
                isStartBol = false
              } else {
                startDate = DateUtil.plusDate(new Date(), 7)
              }
            } else {
              startDate = DateUtil.plusDate(new Date(), (i - 3) * 7)
            }
            this.cookCreate.dates.push(this.getTime(startDate))
          }
        }
        this.cookCreate.curDate = this.cookCreate.dates[0]
      }
    },
    methods: {
      ...mapActions(['saveCookCreate', 'clearCookCreate']),
      handleSubmit() {
        let rows = JSON.parse(JSON.stringify(this.cacheCooks.tables.datas))
        let msgJson = []
        rows.forEach(row => {
          delete row.clickAble
          delete row.columns
          row.cellData.forEach(cell => {
            delete cell.canteenInfo
            msgJson.push(cell)
          })
        })
        MsgApi.addMessage({
          groupId: this.currentGroup.groupId,
          msgJson: JSON.stringify(msgJson),
          times: this.cacheCooks.curDate.time,
          title: this.cacheCooks.curDate.remark,
          type: '1058',
          ...this.constructionMessage()
        }).then(res => {
          this.clearCookCreate()
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        })
      },
      importCookBook() {
        this.$import({
          title: '导入食谱',
          uploadURI: this.uploadURL,
          templateUrl: `/business/cookbook/menu/import/template?groupId=${this.currentGroup.groupId}`,
          callback: (res, file) => {
            Api.parseTemplate(this.currentGroup.groupId, res.file.id).then(result => {
              let titleStr = ''
              let starTimeArr = result.table.setTimes[0].setTime.split(' ')[0].split('-')
              let endTimeArr = result.table.setTimes[1].setTime.split(' ')[0].split('-')
              let startStr = starTimeArr[1].concat('-').concat(starTimeArr[2])
              let endStr = endTimeArr[1].concat('-').concat(endTimeArr[2])
              if (startStr === endStr) {
                titleStr = startStr
              } else {
                titleStr = startStr.concat(' 至 ').concat(endStr)
              }
              MsgApi.addMessage({
                groupId: this.currentGroup.groupId,
                msgJson: JSON.stringify(result.table.cookbooks),
                times: result.table.setTimes,
                title: titleStr,
                type: '1058',
                ...this.constructionMessage()
              }).then(res => {
                res.code === '1' && this.clearCookCreate()
                this.$message({
                  type: 'success',
                  message: '成功'
                })
                this.routeBack()
              })
            })
          }
        })
      },
      getTime(timer, isOnce) {
        let bTime = DateUtil.getWeekDate(timer, 'start')
        let eTime = DateUtil.getWeekDate(timer)
        if (isOnce) {
          // 某一天
          return {
            remark: `${DateUtil.format(timer, DateUtil.MD)}`,
            title: `${new Date(timer).getMonth() + 1}.${new Date(bTime).getDate()}`,
            time: [
              {
                setTime: DateUtil.format_0800(timer.toString()),
                type: 'start'
              },
              {
                setTime: DateUtil.format_0800(timer.toString()),
                type: 'end'
              }
            ],
            everyDay: DateUtil.getEveryDay(DateUtil.format(timer, DateUtil.YMD), 1)
          }
        } else {
          // 某一星期
          return {
            remark: `${DateUtil.format(bTime, DateUtil.MD)} 至 ${DateUtil.format(eTime, DateUtil.MD)} `,
            title: `${new Date(bTime).getMonth() + 1}.${new Date(bTime).getDate()}-${new Date(eTime).getMonth() + 1}.${new Date(eTime).getDate()}`,
            time: [
              {
                setTime: DateUtil.format_0800(bTime.toString()),
                type: 'start'
              },
              {
                setTime: DateUtil.format_0800(eTime.toString()),
                type: 'end'
              }
            ],
            everyDay: DateUtil.getEveryDay(DateUtil.format(bTime, DateUtil.YMD), 7)
          }
        }
      },
      handleDate(date) {
        this.cookCreate.curDate = {
          ...date
        }
        this.resetTables()
        this.initTables()
      },
      cellClick(cell, row, rowIndex, colIndex) {
        if (colIndex === 0) {
          return false
        }
        this.saveCookCreate({
          ...this.cookCreate,
          isEdit: true
        })
        this.routePush({
          name: 'addFoods1058',
          query: {
            rIndex: rowIndex,
            cIndex: colIndex
          }
        })
      },
      initTables() {
        const that = this
        that.cookCreate.curDate.everyDay.forEach(day => {
          let row = {}
          row.columns = []
          row.clickAble = false
          row.cellData = []
          row.columns.push(`${DateUtil.day2week(day)}<br>${DateUtil.format(day, DateUtil.MD)}`)
          that.cookCreate.mealTimes.forEach(mealTime => {
            let cell = {}
            cell.weekDate = day
            cell.mealTimeId = mealTime.id
            cell.canteenInfo = []
            cell.type = new Date(day).getDay() > 0 ? new Date(day).getDay() : 7
            cell.foods = []
            row.columns.push('点此添加')
            row.cellData.push(cell)
          })
          that.cookCreate.tables.datas.push(row)
        })
      },
      resetTables() {
        this.cookCreate.tables = {
          ...this.cookCreate.tables,
          datas: []
        }
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearCookCreate()
            this.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .limit-row {
    @include lh(5);
  }
</style>
