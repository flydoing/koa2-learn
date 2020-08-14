import R from './mixin'
import { addClass, removeClass, hasClass } from '@/utils/dom'
import { getCell, getColumnByCell } from './utils'
export default {
  name: 'VxTableBody',
  mixins: [R],
  props: {
    store: {
      required: true
    },
    stripe: Boolean,
    rowClassName: [String, Function]
  },
  computed: {
    table() {
      return this.$parent
    },
    data() {
      return this.store.states.data
    },
    columns() {
      return this.store.states.columns
    }
  },
  render(h) {
    return (
      <table class="vx-table--body" cellpadding="0" cellspacing="0">
        <colgroup>
          {this.columns.map(column => (
            <col name={column.id} />
          ))}
        </colgroup>
        <tbody>
          {this.data.map((row, $index) => {
            return (
              <tr
                class={[this.getRowClass(row, $index)]}
                on-click={$event => this.onClick($event, row, $index)}
                on-mouseenter={$event => this.onMouseEnter($index)}
                on-mouseleave={$event => this.onMouseLeave()}>
                {this.columns.map((column, cellIndex) => {
                  return (
                    <td style={this.getCellStyle($index, cellIndex, row, column)} class={this.getCellClass($index, cellIndex, row, column)}>
                      {column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store })}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  },
  methods: {
    getRowClass(row, rowIndex) {
      const classes = ['vx-table--row']
      if (row === this.store.states.currentRow) {
        classes.push('current-row')
      }

      if (this.stripe && rowIndex % 2 === 1) {
        classes.push('vx-table--row--striped')
      }
      const rowClassName = this.table.rowClassName
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName)
      }
      if (typeof rowClassName === 'function') {
        classes.push(rowClassName(rowIndex, row) || '')
      }
      return classes.join(' ')
    },
    getCellClass(rowIndex, columnIndex, row, column) {
      const classes = [column.id, column.align, column.className]
      const cellClassName = this.table.cellClassName
      if (typeof cellClassName === 'string') {
        classes.push(cellClassName)
      }
      return classes.join(' ')
    },
    getCellStyle(rowIndex, columnIndex, row, column) {
      const cellStyle = this.table.cellStyle
      if (typeof cellStyle === 'function') {
        return cellStyle(rowIndex, columnIndex, row, column)
      }
      return cellStyle
    },
    onEvent(event, row, name, rowIndex) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        column = getColumnByCell(table, cell)
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event, rowIndex)
        }
      }
      table.$emit(`row-${name}`, row, event, column, rowIndex)
    },
    onClick(event, row, rowIndex) {
      this.store.commit('setCurrentRow', row)
      this.onEvent(event, row, 'click', rowIndex)
    },
    onMouseEnter(index) {
      this.store.commit('setHoverRow', index)
    },
    onMouseLeave() {
      this.store.commit('setHoverRow', null)
    }
  },
  watch: {
    'store.states.hoverRow'(newVal, oldVal) {
      const el = this.$el
      if (!el) return
      const tr = el.querySelector('tbody').children
      const rows = [].filter.call(tr, row => hasClass(row, 'vx-table--row'))
      const oldRow = rows[oldVal]
      const newRow = rows[newVal]
      if (oldRow) {
        removeClass(oldRow, 'hover-row')
      }
      if (newRow) {
        addClass(newRow, 'hover-row')
      }
    }
  }
}
