<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <div slot="top"
         class="platform">
      <div>讲台</div>
    </div>
    <div class="seat-list">
      <div class="sl-main">
        <table>
          <tr v-for="(row, i) in seats"
              :key="i">
            <td v-for="(col, j) in row"
                :style="seatStyle"
                :key="j">
              <div :class="{'sl-seat':true, 'active': col.selected}"
                   @click="handleChange(col, i, j)">
                <div class="name"
                     v-html="nameTxt(col)"></div>
                <div class="info"><i>{{col.number}}</i><span v-html="classTxt(col)"></span></div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        seats: [],
        element: null,
        curSeat: null
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      seatStyle() {
        let place = this.arrange.place
        return { width: `${100 / place.colNum}%` }
      }
      // infoStyle() {
      //   if (this.element) {
      //     let place = this.arrange.place
      //     let width = this.element.offsetWidth
      //     let w = (width / place.colNum / width) * 100 > 14 ? 14 : (width / place.colNum / width) * 100
      //     return { 'font-size': `${w}px` }
      //   }
      //   return ''
      // }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      nameTxt(col) {
        return col.data ? col.data.name.substring(0, 4) : ''
      },
      classTxt(col) {
        return col.data ? col.data.groupName.substring(0, 5) : ''
      },
      fetchData() {
        const that = this
        let seats = []
        let place = this.arrange.place

        if (place) {
          let column = place.colNum
          let row = place.rowNum
          for (let j = 0; j < row; j++) {
            let columns = []
            for (let i = column; i > 0; i--) {
              columns.push({ number: i * row - row + (j + 1), selected: false })
            }
            seats.push(columns)
          }

          let sMap = new Map()
          place.students.map(v => {
            sMap.set(v.seatNo, v)
          })

          this.seats = seats.map(v => {
            v = v.map(s => {
              let data = sMap.get(s.number)
              if (data) {
                return { ...s, data: data }
              }
              return s
            })
            return v
          })
        }

        setTimeout(() => {
          that.element = that.$el
        }, 500)
      },
      handleChange(col, rowIndex, colIndex) {
        let seat = this.curSeat
        if (seat) {
          this.seats = this.seats.map(v => {
            v = v.map(s => {
              if (seat.number === s.number) {
                return {
                  number: s.number,
                  selected: false,
                  data: col.data ? { ...col.data, seatNo: s.number } : null
                }
              }
              if (col.number === s.number) {
                return {
                  number: s.number,
                  selected: false,
                  data: seat.data ? { ...seat.data, seatNo: s.number } : null
                }
              }
              return s
            })
            return v
          })
          this.curSeat = null
        } else {
          col.selected = !col.selected
          this.$set(this.seats[rowIndex], colIndex, col)
          this.curSeat = col
        }
      },
      handleSubmit() {
        let students = []
        this.seats.map(v => {
          v.map(s => {
            if (s.data) {
              students.push(s.data)
            }
          })
        })
        this.setArrangeExam({ place: { ...this.arrange.place, students: students } })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .platform {
    padding: rem(10) 0;
    & > div {
      width: 200px;
      height: rem(35);
      line-height: rem(35);
      text-align: center;
      background: #b7dfff;
      color: #333;
      font-size: rem(16);
      border-radius: rem(5);
      margin: 0 auto;
    }
  }
  .seat-list {
    position: relative;
    overflow: hidden;
    padding-right: rem(10);
    .sl-main {
      width: 100%;
      height: 100%;
      position: relative;
      .sl-seat {
        color: #333;
        border-radius: rem(5);
        overflow: hidden;
        background: #e5f5ff;
        cursor: pointer;
        border: rem(1) solid transparent;
        margin-left: rem(10);
        margin-bottom: rem(10);
        font-size: rem(16);
        &.active {
          @include borderColor;
        }
        .name {
          text-align: center;
          height: rem(50);
          line-height: rem(50);
          color: #333;
          overflow: hidden;
          white-space: nowrap;
        }
        .info {
          position: relative;
          height: rem(25);
          line-height: rem(25);
          background: #b7dfff;
          box-sizing: border-box;
          width: 100%;
          font-size: rem(12);
          i {
            display: inline-block;
            margin-left: rem(5);
            font-style: normal;
          }
          span {
            position: absolute;
            right: rem(5);
          }
        }
      }
      table {
        width: 100%;
        display: table;
        border-collapse: separate;
      }
      tr {
        display: table-row;
      }
      td {
        display: table-cell;
      }
    }
  }
</style>
