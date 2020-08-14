<template>
  <page title="编辑座位表"
        @submit="handleSubmit"
        :hasSubmit="true"
        @back="handleBack"
        :listenBack="true">
    <div class="seat-list pd"
         ref="_seat"
         :style="seatStyle.entirety">
      <div class="sl-container"
           :style="seatStyle.container">
        <div class="sl-list"
             :style="seatStyle.list">
          <ul class="sl-drag-list clearfix">
            <li v-for="(item,i) in form.list"
                :key="i"
                :style="seatStyle.seat">
              <div class="seat-item drag-item"
                   draggable="true"
                   @click.stop="handleSeat(item, i)"
                   @dragstart="handleDragStart($event, item)"
                   @dragend="handleDragEnd($event)"
                   @drop="handleDrop($event, item)"
                   @dragover="handleDragOver($event)">
                <span class="name"
                      v-html="item.name"></span>
              </div>
            </li>
          </ul>
        </div>
        <ul class="sl-row-drag">
          <li v-for="(item,i) in rowDrags"
              :key="i"
              :style="seatStyle.row.drag"
              @mousedown="handleMouseDown('row',item.index)"
              @mouseup="handleMouseUp('row',i)"
              draggable="true"
              @dragstart="handleBatchDragStart($event, item, 'rowIndex')"
              @drop="handleBatchDrop($event, item, 'rowIndex')"
              @dragover="handleDragOver($event)">
            <div v-if="item.list.length>0"
                 class='placeholder'
                 :style="seatStyle.col.placeholder">
              <div class='content'
                   :style="seatStyle.col.content">
                <div v-for="(s,i) in item.list"
                     :key="i"
                     :style="seatStyle.seat">
                  <span class="name"
                        v-html="s.name"></span>
                </div>
              </div>
            </div>
            <div class="drag"
                 :style="seatStyle.drag"><i class="ico ico-vs-sort" /></div>
          </li>
        </ul>
        <ul class="sl-column-drag">
          <li v-for="(item,i) in colDrags"
              :key="i"
              :style="seatStyle.col.drag"
              @mousedown="handleMouseDown('col',item.index)"
              @mouseup="handleMouseUp('col',i)"
              draggable="true"
              @dragstart="handleBatchDragStart($event, item, 'colIndex')"
              @drop="handleBatchDrop($event, item, 'colIndex')"
              @dragover="handleDragOver($event)">
            <div v-if="item.list.length>0"
                 class='placeholder'
                 :style="seatStyle.row.placeholder">
              <div class='content'
                   :style="seatStyle.row.content">
                <div v-for="(s,i) in item.list"
                     :key="i"
                     :style="seatStyle.seat">
                  <span class="name"
                        v-html="s.name"></span>
                </div>
              </div>
            </div>
            <div class="drag"><i class="ico ico-vs-sort" /></div>
          </li>
        </ul>
        <div class="sl-add-column"
             @click="handleAddCol">+列</div>
      </div>
      <div class="sl-dustbin"
           :class="{'active':dbActive}"
           @dragenter="handleDustbinDragEnter"
           @dragover="handleDragOver"
           @drop="handleDustbinDrop"><i class="ico ico-dustbin" /></div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          column: 4,
          row: 8,
          curSeat: null,
          dragIndex: 0,
          list: [],
          rowDragItem: null,
          colDragItem: null
        },
        element: null,
        dbActive: false
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        seatTable: 'getSeatTable'
      }),
      seatStyle() {
        let form = this.form
        let s = { col: {}, row: {} }
        if (this.element) {
          let mWidth = this.element.offsetWidth
          let mHeight = this.element.offsetHeight
          let w = mWidth / form.column
          let h = (mHeight - 100) / form.row - 10
          s.entirety = { height: `${mHeight}px` }
          s.seat = { width: `${w - w / 10 - 10}px`, height: `${h}px` }
          s.container = { height: `${mHeight - 45}px` }
          s.list = { width: `${w * form.column - 70}px` }
          s.col = {
            drag: { width: `${w - w / 10 - 10}px` },
            placeholder: { width: `${mWidth - 20}px`, 'right': `${mWidth - 59}px`, bottom: '1px' },
            content: { width: `${(w - w / 10 - 10) * form.column + form.column * 10}px` }
          }
          s.row = {
            drag: { height: `${h}px` },
            placeholder: { height: `${mHeight - 50 - 37}px`, 'bottom': `38px` },
            content: { height: `${h * form.row + form.row * 10}px` }
          }
          s.drag = { height: `${h}px`, 'line-height': `${h}px` }
        }
        return s
      },
      rowDrags() {
        let rs = []
        let item = this.form.rowDragItem
        for (let i = this.form.row; i > 0; i--) {
          if (item && item.index === i) {
            rs.push({ index: i, list: item.seats })
          } else {
            rs.push({ index: i, list: [] })
          }
        }
        return rs
      },
      colDrags() {
        let cs = []
        let item = this.form.colDragItem
        for (var i = 0; i < this.form.column; i++) {
          if (item && item.index === i + 1) {
            cs.push({ index: i + 1, list: item.seats })
          } else {
            cs.push({ index: i + 1, list: [] })
          }
        }
        return cs
      }
    },
    methods: {
      ...mapActions(['setSeatTable']),
      fetchData() {
        if (this.seatTable.form) {
          this.form = JSON.parse(JSON.stringify(this.seatTable.form))
          let seat = this.seatTable.seat
          if (seat && seat.status === 'd') {
            this.form.list = this.form.list.map(v => {
              if (v.data && v.data.userId === seat.data.userId) {
                v = { ...v, name: '', data: null }
              }
              return v
            })
          }

          let user = this.seatTable.user
          if (user) {
            let index = this.seatTable.sIndex
            this.$set(this.form.list, index, { ...this.form.list[index], name: user.name, data: user })
            this.setSeatTable({ user: null })
          }
          setTimeout(() => {
            this.element = this.$el
          }, 100)
        } else {
          Api.getSeats(this.currentGroup.groupId).then(res => {
            let tbl = res.seatTable
            if (Check.isObject(tbl)) {
              this.form.column = tbl.columnIndex
              this.form.list = this.initSeats(tbl.seatings)
            } else {
              this.form.list = this.initSeats()
            }
            this.$nextTick(() => {
              this.element = this.$el
            })
          })
        }
      },
      initSeats(seats) {
        let colIndex = 0
        let rowIndex = this.form.row
        let datas = []
        let sMap = new Map()

        if (Check.isRealArray(seats)) {
          seats.map(v => { sMap.set(`${v.horizontal}_${v.vertical}`, v) })
        }

        for (let i = 0; i < this.form.row * this.form.column; i++) {
          let seat = { name: '' }
          if (i < this.form.column) {
            seat.colIndex = i + 1
            seat.rowIndex = rowIndex

            let val = sMap.get(`${rowIndex}_${i + 1}`)
            if (Check.isObject(val)) {
              seat = { ...seat, name: val.name, data: val }
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
              seat = { ...seat, name: val.name, data: val }
            }
          }
          datas.push(seat)

          if (colIndex === this.form.column) {
            colIndex = 0
          }
        }
        return datas
      },
      handleDragStart(e, item) {
        this.form.curSeat = item
      },
      handleDragEnd(e) {
        return false
      },
      handleDrop(e, item) {
        let from = this.form.curSeat
        let to = item
        this.form.list = this.form.list.map(v => {
          if (v.colIndex === from.colIndex && v.rowIndex === from.rowIndex) {
            v = { ...v, name: to.name, data: to.data }
          } else if (v.colIndex === to.colIndex && v.rowIndex === to.rowIndex) {
            v = { ...v, name: from.name, data: from.data }
          }
          return v
        })
        return false
      },
      handleDragOver(e) {
        e.preventDefault()
        return true
      },
      handleBatchDragStart(e, item, type) {
        this.form.dragIndex = item.index
      },
      handleBatchDrop(e, item, property) {
        // 对立属性
        let opposite = (property === 'rowIndex' ? 'colIndex' : 'rowIndex')
        let fromMap = new Map()
        this.form.list.map(v => {
          if (v[property] === this.form.dragIndex) {
            fromMap.set(v[opposite], v)
          }
        })
        let toMap = new Map()
        this.form.list.map(v => {
          if (v[property] === item.index) {
            toMap.set(v[opposite], v)
          }
        })

        this.form.list = this.form.list.map(v => {
          if (v[property] === this.form.dragIndex) {
            let to = toMap.get(v[opposite])
            v = { ...v, name: to.name, data: to.data }
          } else if (v[property] === item.index) {
            let from = fromMap.get(v[opposite])
            v = { ...v, name: from.name, data: from.data }
          }
          return v
        })

        if (property === 'rowIndex') {
          this.form.rowDragItem = null
        } else {
          this.form.colDragItem = null
        }
      },
      handleMouseDown(type, index) {
        if (type === 'row') {
          let seats = this.form.list.filter(v => {
            return v.rowIndex === index
          })
          this.form.rowDragItem = { index: index, seats: seats }
        } else {
          let seats = this.form.list.filter(v => {
            return v.colIndex === index
          })
          this.form.colDragItem = { index: index, seats: seats }
        }
      },
      handleMouseUp(type, index) {
        if (type === 'row') {
          this.form.rowDragItem = null
        } else {
          this.form.colDragItem = null
        }
      },
      // 比较字段值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      handleAddCol() {
        if (this.form.column < 8) {
          let column = this.form.column + 1
          for (let i = this.form.row; i > 0; i--) {
            this.form.list.forEach((v, k) => {
              if (v.colIndex === column - 1 && v.rowIndex === i) {
                this.form.list.splice(k, 1, v, { name: '', colIndex: column, rowIndex: i })
              }
            })
          }
          this.form.column = column
        } else {
          this.$message({ message: '最多添加八列', type: 'warning' })
        }
      },
      handleDustbinDragEnter() {
        this.dbActive = true
      },
      handleDustbinDrop() {
        let seat = this.form.curSeat
        this.form.list = this.form.list.map(v => {
          if (v.colIndex === seat.colIndex && v.rowIndex === seat.rowIndex) {
            v = { ...v, name: '', data: null }
          }
          return v
        })
        this.dbActive = false
        return false
      },
      handleSeat(item, index) {
        this.setSeatTable({ form: this.form, seat: item, sIndex: index })
        this.routePush({ name: 'seatSelectStudent' })
      },
      handleSubmit() {
        const that = this

        let form = this.form
        let seats = form.list.filter(v => {
          return Check.isObject(v.data)
        })
        let colIndex = seats.sort(that.compare('colIndex')).reverse()[0].colIndex
        let rowIndex = seats.sort(that.compare('rowIndex')).reverse()[0].rowIndex

        seats = seats.map(v => {
          return {
            userId: v.data.userId,
            name: v.data.name,
            sex: v.data.sex,
            horizontal: v.rowIndex,
            vertical: v.colIndex
          }
        })

        Api.saveSeats({
          groupId: that.currentGroup.groupId,
          rowIndex: rowIndex < 5 ? 5 : rowIndex,
          columnIndex: colIndex < 4 ? 4 : colIndex,
          seatings: seats
        }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setSeatTable({ form: null, seat: null })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setSeatTable({ form: null, seat: null })
          this.routeBack()
        })
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .seat-list {
    width: 100%;
    height: 100%;
    position: relative;
    .sl-container {
      position: relative;
    }
    .sl-column-drag {
      position: absolute;
      bottom: rem(3);
      left: 0;
      @extend %clearfix;
      .placeholder {
        position: absolute;
        left: rem(-1);
        .content {
          & > div {
            text-align: center;
            background: #eee;
            margin-top: rem(10);
            border-radius: rem(5);
            width: 100%;
            height: 100%;
            border-radius: rem(5);
            border: rem(1) solid transparent;
            overflow: hidden;
            &:after {
              content: "";
              display: inline-block;
              height: 100%;
              vertical-align: middle;
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
      li {
        float: left;
        width: rem(40);
        height: rem(40);
        list-style: none;
        text-align: center;
        margin-right: rem(10);
        line-height: rem(40);
        border-radius: rem(5);
        border: rem(1) solid #ededed;
        background: #f7f7f7;
        position: relative;
      }
    }
    .sl-row-drag {
      position: absolute;
      top: 0;
      right: 0;
      .placeholder {
        position: relative;
        .content {
          position: absolute;
          left: 0;
          top: 0;
          & > div {
            width: 100%;
            height: 100%;
            background: #eee;
            border-radius: rem(5);
            border: rem(1) solid transparent;
            text-align: center;
            overflow: hidden;
            text-align: center;
            float: left;
            margin-right: rem(10);
            &:after {
              content: "";
              display: inline-block;
              height: 100%;
              vertical-align: middle;
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
      li {
        list-style: none;
        text-align: center;
        margin-top: rem(10);
        width: rem(40);
        height: rem(40);
        border-radius: rem(5);
        border: rem(1) solid #ededed;
        background: #f7f7f7;
      }
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
            content: "";
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
      .drag {
        width: rem(40);
        height: rem(40);
        max-height: rem(40);
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    .sl-add-column {
      width: rem(40);
      height: rem(40);
      position: absolute;
      right: 0;
      bottom: rem(3);
      text-align: center;
      line-height: rem(40);
      font-size: rem(14);
      color: #999;
      border-radius: rem(5);
      border: rem(1) solid #ededed;
      background: #f7f7f7;
      cursor: pointer;
    }
    .sl-dustbin {
      width: rem(300);
      height: rem(35);
      position: absolute;
      left: 50%;
      margin-left: rem(-150);
      border: rem(1) solid #ededed;
      border-top-left-radius: rem(100);
      border-top-right-radius: rem(100);
      bottom: 0;
      box-shadow: 0 0 10px 2px #ededed;
      text-align: center;
      line-height: rem(35);
      &.active {
        box-shadow: 0 0 10px 2px #ffa7a7;
        .ico-dustbin {
          color: #ffa7a7 !important;
        }
      }
      .ico-dustbin {
        &:hover {
          color: #9f9f9f !important;
        }
      }
    }
  }
</style>
