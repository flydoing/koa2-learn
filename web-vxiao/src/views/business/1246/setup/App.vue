<template>
  <Page :title="title"
        hasSubmit
        @submit="submit">
    <template>
      <Exam v-if="app.appType==='9043'"
            :sets="sets" />
    </template>
    <Item :hasClick="false">
      <div>系统名称</div>
      <div slot="remark">{{app.appName}}</div>
    </Item>
    <Item :hasClick="false">
      <div>自定义名称</div>
      <input slot="remark"
             placeholder="选填"
             v-model="app.nickname" />
    </Item>
    <el-popover v-if="app.appType!=='9043'"
                placement="bottom-end"
                width="432"
                trigger="click"
                v-model="showFrame">
      <SelectFrame @change="handleFrame"></SelectFrame>
      <Item slot="reference">
        <div>帧数</div>
        <div slot="remark">{{app.frame}}帧</div>
      </Item>
    </el-popover>
    <Item :hasClick="false">
      <div>显示大小（仅Metro模版下有效）</div>
      <el-radio-group slot="remark"
                      v-model="app.metroSize">
        <el-radio label="1">小</el-radio>
        <el-radio label="2">中</el-radio>
        <el-radio label="3">大</el-radio>
      </el-radio-group>
    </Item>
    <Item v-if="app.appType=== '9011'"
          @click="onTakePhoto">
      <div>访客抓拍</div>
      <div slot="after">
        <i-switch :value.sync="sets.visitorTakePhoto"
                  :trueValue="1"
                  :falseValue="0"></i-switch>
      </div>
    </Item>
    <div v-for="(item, i) in timesets"
         :key="i">
      <div class="category-title text period">时段{{i+1}}<i class='ico ico-delete right'
           @click="handleRemovePeriod(item, i)"></i></div>
      <el-popover placement="bottom-end"
                  width="432"
                  trigger="click"
                  v-model="item.show">
        <SelectWeekday :item="item"
                       :periods="periods"
                       :index="i"
                       @submit="handleWeekday"></SelectWeekday>
        <item slot="reference">
          <div slot="main">置顶周期</div>
          <div slot="remark"
               v-html="weekdayTxt(item)"></div>
        </item>
      </el-popover>
      <item class="top-time"
            :hasClick="false">
        <div slot="main">置顶开始</div>
        <div slot="after">
          <el-time-picker v-model="item.startTime"
                          prefix-icon="x"
                          :picker-options="{selectableRange: startRange(item)}"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                          :clearable="false"></el-time-picker>
        </div>
      </item>
      <item class="top-time"
            :hasClick="false">
        <div slot="main">置顶结束</div>
        <div slot="after">
          <el-time-picker v-model="item.endTime"
                          prefix-icon="x"
                          :picker-options="{selectableRange: endRange(item)}"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                          :clearable="false"></el-time-picker>
        </div>
      </item>
    </div>
    <div class="category-title"></div>
    <item @click="handleAddPeriod"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增置顶时段</div>
    </item>
    <div v-if="app.appType === '9019'"
         class="button button-common"
         @click="handleRemove">删除</div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    components: {
      SelectFrame: resolve => require(['./SelectFrame'], resolve),
      SelectWeekday: resolve => require(['./SelectWeekday'], resolve),
      Exam: resolve => require(['./service/Exam'], resolve)
    },
    data() {
      return {
        app: {},
        title: '',
        timesets: [],
        sets: {},
        periods: [],
        showFrame: false,
        removePeriods: []
      }
    },
    created() {
      this.title = this.routeQuery('title')
      this.app = this.getStorage('_cache_app') || {}
      this.periods = this.getStorage('_cache_periods')
      this.sets = Check.isObject(this.app.sets) ? this.app.sets : this.app.sets ? JSON.parse(this.app.sets || {}) : {}
      this.timesets = this.app.timesets || []
      if (Check.isRealArray(this.timesets)) {
        this.timesets = this.timesets.map(v => {
          v.show = false
          return v
        })
      }
    },
    methods: {
      weekdayTxt(item) {
        if (!Check.isNullString(item.periods)) {
          let arr = item.periods.split(',')
          return `每周${arr.length}天`
        }
        if (Check.isRealArray(item.days)) {
          return `每周${item.days.length}天`
        }
        return ''
      },
      endRange(item) {
        return item.startTime ? `${item.startTime}:00 - 23:59:59` : '00:00:00 - 23:59:59'
      },
      startRange(item) {
        return item.endTime ? `00:00:00 - ${item.endTime}:59` : '00:00:00 - 23:59:59'
      },
      handleAddPeriod() {
        let period = { periods: '', startTime: '', endTime: '', status: '1', show: false }
        if (this.app.appType === '9019') {
          period.metadataId = this.app.id
        }
        this.timesets.push(period)
      },
      handleRemovePeriod(item, index) {
        if (item.id) {
          delete item.show
          this.removePeriods.push({ ...item, status: 'd' })
        }
        this.timesets.splice(index, 1)
      },
      handleWeekday(item, index) {
        this.$set(this.timesets, index, { ...item, show: false })
      },
      handleRemove() {
        this.$confirm('确认删除自定义DOC?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.addCustom({
            metaData: { id: this.app.id, status: 'd' }
          }).then(res => {
            this.$message({ type: 'warning', message: '删除成功' })
            this.routeBack()
          })
        })
      },
      submit() {
        let ts = []
        this.timesets.forEach((v, i) => {
          let t = { ...v }
          delete v.show
          ts.push(t)
        })
        if (Check.isRealArray(this.removePeriods)) {
          ts.push(...this.removePeriods)
        }
        this.$set(this.app, 'timesets', ts)
        this.$set(this.app, 'sets', JSON.stringify(this.sets))
        Api.modifyScreenApp({
          schoolScreenApps: [this.app]
        })
          .then(res => {
            this.$message({ type: 'success', message: '修改成功' })
            this.routeBack()
          })
          .catch(res => {})
      },
      handleFrame(num) {
        this.$set(this.app, 'frame', num)
        this.showFrame = false
      },
      onTakePhoto() {
        this.$set(this.sets, 'visitorTakePhoto', this.sets.visitorTakePhoto === 0 ? 1 : 0)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .period {
    .ico-delete {
      margin-top: rem(3);
    }
  }

  .el-dropdown {
    display: block;
    width: 100%;
  }

  .vx-item {
    .el-input input {
      padding-right: 0;
    }
  }

  .top-time input {
    min-width: initial !important;
  }
</style>
