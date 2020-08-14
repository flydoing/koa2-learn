<template>
  <div class="seat-list"
       ref="_seat">
    <div class="sl-container"
         :style="seatStyle.container">
      <div class="sl-list"
           :style="seatStyle.list">
        <ul class="sl-drag-list clearfix">
          <li v-for="(item,i) in list"
              :key="i"
              :style="seatStyle.seat">
            <div class="seat-item drag-item add"
                 @click="handleSeat(item, i)"
                 :style="seatStyle.item">
              <span class="name"
                    v-html="item.name"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="sl-platform">讲台</div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  // import { mapGetters, mapActions } from 'vuex'
  import GroupApi from '@/api/group'
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        column: 4,
        row: 8,
        curSeat: null,
        list: [],
        element: null
      }
    },
    created() {
      this.fetchData()
    },
    activated() {
      this.fetchData()
    },
    computed: {
      // ...mapGetters({
      //   seat: 'getSeat'
      // }),
      seatStyle() {
        let s = {}
        if (this.element) {
          let mWidth = this.element.offsetWidth
          let mHeight = this.element.offsetHeight
          let w = (mWidth - 100) / this.column
          let h = (mHeight - 50) / this.row
          s.seat = { width: `${w - 11.5}px`, height: `${h - 11.5}px` }
          s.container = { height: `${mHeight - 50}px` }
          s.list = { overflow: 'inherit', width: `${w * this.column - 20}px`, margin: '0 auto' }
          s.item = { border: 0 }
        }
        return s
      }
    },
    methods: {
      // ...mapActions(['setSeat']),
      fetchData() {
        Api.getSeats(this.currentGroup.groupId).then(res => {
          let tbl = res.seatTable
          if (Check.isObject(tbl)) {
            this.row = tbl.rowIndex
            this.column = tbl.columnIndex
            this.list = this.initSeats(tbl.seatings)
          } else {
            this.list = this.initSeats()
          }
          this.$nextTick(() => {
            this.element = this.$refs._seat
          })
        })
      },
      initSeats(seats) {
        let colIndex = 0
        let rowIndex = this.row
        let datas = []
        let sMap = new Map()

        if (Check.isRealArray(seats)) {
          seats.map(v => {
            sMap.set(`${v.horizontal}_${v.vertical}`, v)
          })
        }

        for (let i = 0; i < this.row * this.column; i++) {
          let seat = { name: '' }
          if (i < this.column) {
            seat.colIndex = i + 1
            seat.rowIndex = rowIndex

            let val = sMap.get(`${rowIndex}_${i + 1}`)
            if (Check.isObject(val)) {
              seat = { ...seat, name: val.name, userId: val.userId, data: val }
            }
          } else {
            if (colIndex === 0) {
              rowIndex--
            }
            colIndex++

            seat.colIndex = colIndex
            seat.rowIndex = rowIndex

            let val = sMap.get(`${rowIndex}_${colIndex}`)
            if (Check.isObject(val)) {
              seat = { ...seat, name: val.name, userId: val.userId, data: val }
            }
          }
          datas.push(seat)

          if (colIndex === this.column) {
            colIndex = 0
          }
        }
        return datas
      },
      handleSeat(item, index) {
        const that = this
        if (that.isParent && !item.data) {
          GroupApi.getGroupUserChildren(that.groupId).then(res => {
            let user = res.relations ? res.relations[0] : 0
            let seat = that.list.filter(v => {
              return v.userId === user.userId
            })[0]
            if (!seat) {
              let seats = that.list.filter(v => {
                return Check.isObject(v.data)
              })
              seats = seats.map(v => {
                return {
                  userId: v.data.userId,
                  name: v.data.name,
                  sex: v.data.sex,
                  horizontal: v.rowIndex,
                  vertical: v.colIndex
                }
              })
              let s = {
                userId: user.userId,
                name: user.name,
                sex: '1',
                horizontal: item.rowIndex,
                vertical: item.colIndex
              }
              seats.push(s)
              Api.saveSeats({
                groupId: that.groupId,
                rowIndex: that.row,
                columnIndex: that.column,
                seatings: seats
              }).then(res => {
                that.$set(this.list, index, { ...item, data: s, name: s.name })
                that.$message({ message: '操作成功', type: 'success' })
              })
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .seat-list {
    width: 100%;
    height: 100%;
    position: relative;
    .sl-container {
      position: relative;
    }
    .sl-list {
      overflow: hidden;
      padding-bottom: rem(3);
      .sl-drag-list {
        width: 105%;
        li {
          float: left;
          width: rem(50);
          height: rem(50);
          list-style: none;
          text-align: center;
          margin-top: rem(10);
          margin-right: rem(10);
        }
        .seat-item {
          width: 100%;
          height: 100%;
          background: #eee;
          border-radius: rem(5);
          border: rem(1) solid transparent;
          cursor: pointer;
          text-align: center;
          overflow: hidden;
          &:after {
            content: '';
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }
          &.add {
            border: $border;
          }
          .name {
            vertical-align: middle;
            display: inline-block;
            line-height: normal;
            font-size: rem(14);
          }
        }
      }
    }
    .sl-platform {
      width: rem(300);
      height: rem(40);
      position: absolute;
      left: 50%;
      margin-left: rem(-150);
      background: url(/static/images/img_seat_platform.png) no-repeat center;
      background-size: 100% 100%;
      bottom: rem(8);
      text-align: center;
      line-height: rem(40);
      font-size: rem(14);
      color: nth($font-color, 1);
    }
  }
</style>
