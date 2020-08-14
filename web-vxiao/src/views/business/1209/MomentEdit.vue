<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="moment-edit">
      <item :hasClick="false">
        <input placeholder="标题"
               v-model="moment.title" />
      </item>
      <item @click="handlePlace">
        <div slot="main">场所</div>
        <div slot="remark"
             class="ellipsis"
             v-html="placeTxt"></div>
      </item>
      <item class="me-time"
            :hasClick="false">
        <div slot="main">时间</div>
        <div slot="after">
          <el-time-picker v-model="time"
                          prefix-icon="x"
                          :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                          @change="handleTime">
          </el-time-picker>
        </div>
      </item>
      <item @click="handleWeekday">
        <div slot="main">周期</div>
        <div slot="remark"
             class="ellipsis"
             v-html="weekdayTxt"></div>
      </item>
      <div class="category-title text">可见权限</div>
      <item v-for="(item,i) in auths"
            :key="i"
            :item="item"
            :hasArrow="false"
            @click="handleAuth(item, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}" />
        </div>
        <div slot="main">{{item.name}}</div>
      </item>
      <div v-if="moment.id"
           class="button button-common"
           @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        moment: {
          title: '',
          places: [],
          startTime: '',
          weekdays: [],
          visibleRange: '1'
        },
        auths: [
          {
            name: '仅管理员或老师可见',
            selected: false,
            value: '1'
          },
          {
            name: '所有成员可见',
            selected: false,
            value: '2'
          }
        ],
        time: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        panomara: 'getPanomara'
      }),
      title() {
        return this.moment.id ? `编辑自动全景瞬间 ` : '新建自动全景瞬间'
      },
      placeTxt() {
        let places = this.moment.places
        return places && places.length > 0 ? `${places.length}个` : ''
      },
      weekdayTxt() {
        let txt = this.moment.description || ''
        let weekdays = this.moment.weekdays
        if (Check.isRealArray(weekdays)) {
          if (weekdays.length > 1) {
            let flag = true
            let wDays = weekdays.sort(this.compareData('sort'))
            // 判断是否连续周期（如：周一至周五）
            wDays.forEach((v, i) => {
              if (wDays[i + 1] && wDays[i].sort + 1 !== wDays[i + 1].sort) {
                flag = false
              }
            })
            if (flag) {
              txt = `${wDays[0].name}至${wDays[wDays.length - 1].name}`
            } else {
              txt = wDays
                .map(v => {
                  return v.name
                })
                .join('、')
            }
          } else {
            txt = weekdays[0].name
          }
        }
        return txt
      }
    },
    methods: {
      ...mapActions(['setPanomara']),
      fetchData() {
        const that = this
        let cache = that.panomara.cache
        if (that.panomara.moment) {
          that.moment = JSON.parse(JSON.stringify(that.panomara.moment))
        } else if (cache) {
          that.moment = { ...cache, weekdays: [], auth: null }
        }

        let date = DateUtils.format(new Date(), DateUtils.YMD)
        that.time = new Date(DateUtils.format(`${date} ${that.moment.startTime}`, DateUtils.YMD_HM))
        that.auths = that.auths.map(v => {
          that.moment.visibleRange === v.value && (v.selected = true)
          return v
        })
      },
      // 比较数据大小
      compareData(property) {
        return (a, b) => {
          var v1 = a[property]
          var v2 = b[property]
          return v1 - v2
        }
      },
      handlePlace() {
        this.setPanomara({ moment: this.moment })
        this.routePush({ name: 'selectMomentPlace1209' })
      },
      handleWeekday() {
        this.setPanomara({ moment: this.moment })
        this.routePush({ name: 'selectWeekday1209' })
      },
      handleTime(time) {
        this.moment.startTime = time
      },
      handleAuth(item) {
        this.auths = this.auths.map(v => {
          v.selected = v.value === item.value
          return v
        })
        this.moment.visibleRange = item.value
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该自动全景瞬间？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitAutoMoment({
              id: that.moment.id,
              status: 'd',
              schoolId: that.currentGroup.parentId
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this
        let moment = that.moment
        if (Check.isNullString(moment.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(moment.places)) {
          that.$message({ message: '请选择场所', type: 'warning' })
          return false
        }
        if (Check.isNullString(moment.startTime)) {
          that.$message({ message: '时间不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(moment.periods) && !Check.isRealArray(moment.weekdays)) {
          that.$message({ message: '请选择周期', type: 'warning' })
          return false
        }

        let wDays = []
        if (Check.isRealArray(moment.weekdays)) {
          wDays = moment.weekdays.map(v => {
            return { timeValue: v.value }
          })
        } else {
          wDays = moment.periods
        }

        let postData = {
          title: moment.title,
          startTime: moment.startTime,
          visibleRange: moment.visibleRange,
          places: moment.places.map(v => {
            return { placeId: v.placeId }
          }),
          periods: wDays,
          description: that.weekdayTxt,
          schoolId: that.currentGroup.parentId
        }
        moment.id && (postData.id = moment.id)

        Api.commitAutoMoment(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .moment-edit {
    .me-time input {
      min-width: initial !important;
    }
  }
</style>
