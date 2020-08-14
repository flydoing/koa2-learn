<template>
  <div class='t-container'>
    <div class="t-message"
         v-html="message"
         ref="_message"
         v-if="message!==''"></div>
    <div class='t'
         ref="t">
      <div class='t-lockCom'
           v-if="showCom"
           ref="_lockCom">
        <!-- 公共固定的行列 -->
        <table :class="tblClasses">
          <thead>
            <tr class="t-row"
                ref="com_th_">
              <template v-for="(title,i) in table.columns">
                <th class="t-header"
                    v-if="i<lockColumn"
                    :key="i"
                    v-html="title"></th>
              </template>
            </tr>
          </thead>
          <tbody ref="com_body_">
            <template v-for="(row,i) in table.datas">
              <tr class="t-row"
                  v-if="i<lockRow-1"
                  :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                  :key="i">
                <template v-for="(cell,j) in row.columns">
                  <td class="t-cell"
                      v-if="j<lockColumn"
                      :key="j"
                      v-html="cell"></td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class='t-lockRow'
           v-if="showRow"
           ref="_lockRow">
        <!-- 固定行 -->
        <table :class="tblClasses">
          <thead>
            <tr class="t-row"
                ref="row_th_">
              <th class="t-header"
                  v-for="(title,i) in table.columns"
                  :key="i"
                  v-html="title"></th>
            </tr>
          </thead>
          <tbody ref="row_body_">
            <template v-for="(row,i) in table.datas">
              <tr class="t-row"
                  v-if="i<lockRow-1"
                  :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                  :key="i">
                <td class="t-cell"
                    v-for="(cell,j) in row.columns"
                    :key="j"
                    v-html="cell"
                    @click="onClick(cell,row,i,j)"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class='t-lockColumn'
           v-if="showColumn"
           ref="_lockColumn">
        <!-- 固定列 -->
        <table :class="tblClasses">
          <thead>
            <tr class="t-row"
                ref="column_th_">
              <template v-for="(title,i) in table.columns">
                <th class="t-header"
                    v-if="i<lockColumn"
                    :key="i"
                    v-html="title"></th>
              </template>
            </tr>
          </thead>
          <tbody ref="column_body_">
            <tr class="t-row"
                v-for="(row,i) in table.datas"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td v-if="row.colspan>0"
                  :style="{color:row.color?row.color:'#333'}"
                  v-html="row.colspanText"
                  @click="onClick(row)"
                  :colspan="row.colspan"
                  class="t-cell t-cell-colspan"></td>
              <template v-else>
                <template v-for="(cell,j) in row.columns">
                  <td v-if="j<lockColumn"
                      :style="{color:row.color?row.color:'#333'}"
                      v-html="cell"
                      class="t-cell"
                      :key="j"
                      @click="onClick(cell,row,i,j)"></td>
                </template>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <scroller :height="scrollHeight"
                v-on:scrolling="scrolling">
        <table :class='classes'
               ref="t_table">
          <thead>
            <tr class="t-row"
                ref="setData_th_">
              <th class="t-header"
                  v-for="(title,i) in table.columns"
                  :key="i"
                  v-html="title"></th>
            </tr>
          </thead>
          <tbody ref="setDataRow_body_">
            <template v-for="(row,i) in table.datas">
              <tr class="t-row"
                  :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                  :key="i">
                <td v-if="row.colspan>0"
                    :style="{color:row.color?row.color:'#333'}"
                    :colspan="row.colspan"
                    v-html="row.colspanText"
                    @click="onClick(row)"
                    class="t-cell t-cell-colspan"></td>
                <td v-else
                    :style="{color:row.color?row.color:'#333'}"
                    v-for="(cell,o) in row.columns"
                    @click="onClick(cell,row,i,o)"
                    :key="o"
                    class="t-cell">
                  <template v-if="row.cellType==='timePicker'">
                    <span v-html="cell"></span>
                  </template>
                  <template v-else>
                    <span v-html="cell"></span>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </scroller>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Table',
    props: {
      height: { type: Number },
      tableData: { type: Object },
      title: { type: String, default: '' },
      emptyMessage: { type: String, default: '' },
      cellClick: { type: Boolean, default: false },
      multiple: { type: Boolean, default: false },
      hasTool: { type: Boolean, default: false }
    },
    computed: {
      lockRow() {
        return this.table.lockRows === false ? 0 : this.table.lockRows || 1
      },
      lockColumn() {
        return this.table.lockColumns || 0
      },
      showRow() {
        return this.lockRow > 0
      },
      showColumn() {
        return this.lockColumn > 0
      },
      showCom() {
        return this.lockRow > 0 && this.lockColumn > 0
      },
      message() {
        return this.title
      },
      table() {
        return this.tableData
      }
    },
    methods: {
      onClick(cell, row, rIndex, oIndex) {
        this.$emit('cellClick', cell, oIndex, rIndex)
        this.$emit('rowClick', row, rIndex)
      },
      clsStyle() {
        this.classes = [
          `t-table`,
          {
            [`t-table-fixed`]: true,
            // this.$refs.t_table.offsetWidth <= this.$refs._scroll.offsetWidth,
            [`t-cell-click`]: this.cellClick
          }
        ]
        this.tblClasses = [
          `t-lock-table`,
          {
            [`t-cell-click`]: this.cellClick
          }
        ]
      },
      scrolling(status) {
        if (this.showRow) {
          this.$refs._lockRow.style.left = `-${status.offset.x}px`
        }
        if (this.showColumn) {
          this.$refs._lockColumn.style.top = `-${status.offset.y}px`
        }
      },
      getHeight() {
        // this.$refs.t.getBoundingClientRect().top
        if (!this.multiple) {
          setTimeout(() => {
            if (this.$refs.t && this.$parent) {
              let height = Math.floor(this.$parent.height.replace('px', ''))
              let _h = this.$refs.t.offsetHeight
              let h = Math.floor(height - this.$refs.t.offsetTop)
              this.scrollHeight = _h > h ? h : _h
            }
          })
        }
      },
      resize() {
        this.$nextTick(() => {
          this.clsStyle()
          // this.getHeight()
          this.$nextTick(() => {
            if (this.table && this.lockRow > 0) {
              let l = this.$refs.row_th_.children.length
              while (l--) {
                const _width = this.$refs.setData_th_.children[l].offsetWidth
                this.$refs.row_th_.children[l].style.width = `${_width}px`
                if (l < this.lockColumn) {
                  this.$refs.com_th_.children[l].style.width = `${_width}px`
                }
              }
              let r = this.$refs.row_body_.children.length
              while (r--) {
                const _height = this.$refs.setDataRow_body_.children[r].clientHeight
                this.$refs.row_body_.children[r].style.height = `${_height}px`
                if (r < this.lockRow) {
                  this.$refs.com_body_.children[r].style.height = `${_height}px`
                }
              }
            }
            if (this.table && this.lockColumn > 0) {
              let l = this.$refs.column_th_.children.length
              while (l--) {
                const _width = this.$refs.setData_th_.children[l].offsetWidth
                this.$refs.column_th_.children[l].style.width = `${_width}px`
              }
              let r = this.$refs.column_body_.children.length
              while (r--) {
                const _height = this.$refs.setDataRow_body_.children[r].children[0].clientHeight + 1
                this.$refs.column_body_.children[r].style.height = `${_height}px`
              }
            }
            this.$nextTick(() => {
              this.getHeight()
            })
          })
        })
      }
    },
    data() {
      return {
        classes: '',
        tblClasses: '',
        scrollHeight: '',
        toolRow: [],
        toolStyle: {},
        showTool: false
      }
    },
    watch: {
      tableData() {
        this.classes = ['t-table']
        this.resize()
      },
      'tableData.datas'(d) {
        this.tableData.datas = d
        this.classes = ['t-table']
        this.resize()
      }
    },
    mounted() {
      this.resize()
    },
    beforeDestroy() {}
  }
</script>
