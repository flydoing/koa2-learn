<template>
  <Page title="新建排考"
        listenBack
        closePrompt
        @back="handleBack">
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>时间安排</span>
        <span class="active"><b>2</b><br>场所安排</span>
        <span><b>3</b><br>监考安排</span>
        <span><b>4</b><br>智能排考</span>
        <i></i>
      </div>
    </div>
    <div class="remark">考位需大于{{studentCount}}个，已选{{seatTotal}}个</div>
    <!-- 场所 -->
    <div v-for="(item, i) in places"
         :key="i">
      <div class="category-title">{{item.name}}</div>
      <item v-for="(place, j) in item.datas"
            :key="j"
            @click="handleSelect(place, i, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':place.selected}"></i>
        </div>
        <div slot="main">{{place.campusName}} {{place.examPlaceName}}</div>
        <div slot="remark"
             @click.stop>
          <el-popover placement="bottom-end"
                      width="400"
                      trigger="click"
                      v-model="place.showSetting">
            <Item :hasClick="false">
              <div slot="main">考位</div>
              <div slot="remark">{{place.seatCount}}</div>
            </Item>
            <el-dropdown class="block-element"
                         trigger="click"
                         @command="changeColumn">
              <div class="el-dropdown-link">
                <item @click="handleSet(place)">
                  <div slot="main">列数</div>
                  <div slot="remark">{{place.column}}</div>
                </item>
              </div>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <el-dropdown-item class="menu-item"
                                  v-for="(count,i) in columns"
                                  :key="i"
                                  :command="count">{{count}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="block-element"
                         trigger="click"
                         @command="changeRow">
              <div class="el-dropdown-link">
                <item @click="handleSet(place)">
                  <div slot="main">行数</div>
                  <div slot="remark">{{place.row}}</div>
                </item>
              </div>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <el-dropdown-item class="menu-item"
                                  v-for="(count,i) in rows"
                                  :key="i"
                                  :command="count">{{count}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div slot="reference">{{place.seatCount}}个考位</div>
          </el-popover>
        </div>
      </item>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleNext">下一步</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        places: [],
        columns: [],
        rows: [],
        curPlace: null,
        studentCount: 0
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      selectedPlaces() {
        let ps = []
        if (Check.isRealArray(this.places)) {
          this.places.map(v => {
            let datas = v.datas.filter(p => {
              return p.selected
            })
            ps.push(...datas)
          })
        }
        return ps
      },
      seatTotal() {
        let count = 0
        this.selectedPlaces.map(v => {
          count += v.seatCount
        })
        return count
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      fetchData() {
        if (this.arrange.placeForm) {
          this.places = JSON.parse(JSON.stringify(this.arrange.placeForm.places))
          this.studentCount = this.arrange.placeForm.studentCount
          this.deleteArrangeExamProp('placeForm')
        } else if (this.arrange.timeForm) {
          let timeForm = this.arrange.timeForm
          for (let p in timeForm.reexamsMap) {
            let datas = timeForm.reexamsMap[p]
            if (Check.isRealArray(datas)) {
              this.places.push({
                name: p,
                datas: datas.map(v => {
                  return {
                    ...v,
                    selected: false,
                    showSetting: false,
                    seatCount: 30,
                    column: 5,
                    row: 6
                  }
                })
              })
            }
          }
          this.studentCount = timeForm.studentCount
        }
        for (let i = 4; i < 8; i++) {
          this.columns.push(i)
        }
        for (let i = 5; i < 9; i++) {
          this.rows.push(i)
        }
      },
      changeColumn(count) {
        let place = this.curPlace
        this.places = this.places.map(v => {
          v.datas = v.datas.map(p => {
            if (place.examPlaceId === p.examPlaceId) {
              return { ...place, column: count, seatCount: count * p.row }
            }
            return p
          })
          return v
        })
      },
      changeRow(count) {
        let place = this.curPlace
        this.places = this.places.map(v => {
          v.datas = v.datas.map(p => {
            if (place.examPlaceId === p.examPlaceId) {
              return { ...place, row: count, seatCount: count * p.column }
            }
            return p
          })
          return v
        })
      },
      handleSet(place) {
        this.curPlace = place
      },
      handleSelect(item, i, j) {
        item.selected = !item.selected
        this.$set(this.places[i].datas, j, item)
      },
      handleNext() {
        let timeForm = this.arrange.timeForm

        if (this.seatTotal < this.studentCount) {
          this.$message({ message: `考场考位数量不足以容纳${this.studentCount}名学生`, type: 'warning' })
          return false
        }
        Api.getInvigilatePlaces({
          groupIds: timeForm.groupIds,
          reexams: this.selectedPlaces.map(v => {
            return {
              campusId: v.campusId,
              examPlaceId: v.examPlaceId,
              campusName: v.campusName,
              floorName: v.floorName,
              placeType: v.placeType,
              examPlaceName: v.examPlaceName,
              seatNum: v.seatCount,
              rowNum: v.row,
              colNum: v.column
            }
          })
        })
          .then(res => {
            this.setArrangeExam({
              placeForm: {
                studentCount: this.studentCount,
                places: this.places,
                data: {
                  campus: {
                    id: timeForm.campus.id,
                    name: timeForm.campus.name
                  },
                  places: this.selectedPlaces
                },
                reexams: res.reexams
              }
            })
            this.routePush({ name: 'invigilateStep1164' })
          })
          .catch(res => {
            this.$message({ message: `已选考场数量不足`, type: 'warning' })
          })
      },
      handleBack() {
        this.deleteArrangeExamProp('placeForm')
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .remark {
    text-align: center;
    padding: 10px 0;
  }
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;
    border-bottom: $border;

    .step-content {
      margin: 0 auto;
      display: inline-block;
      position: relative;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 100%;
        left: 0;
      }

      span {
        display: inline-block;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;

        b {
          font-weight: normal;
          margin-right: rem(5);
          border-radius: rem(18);
          width: rem(18);
          height: rem(18);
          line-height: rem(18);
          text-align: center;
          border: $border2;
          display: inline-block;
          margin-bottom: rem(3);
        }

        &.active {
          @include fc;
        }

        &.active b {
          @include borderColor;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
