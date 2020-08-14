import R from './mixin'
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
      <table class="vx-table--header" cellpadding="0" cellspacing="0">
        <colgroup>
          {this.columns.map(column => (
            <col name={column.id} />
          ))}
        </colgroup>
        <thead>
          <tr class={[this.getHeaderClass()]} on-click={$event => this.onClick($event)}>
            {this.columns.map((column, cellIndex) => {
              return (
                <th
                  style={this.getHeaderCellStyle(cellIndex, column)}
                  class={this.getHeaderCellClass(cellIndex, column)}
                  on-click={$event => this.onCellClick(column, cellIndex, $event)}
                  domPropsInnerHTML={column.label}
                />
              )
            })}
          </tr>
        </thead>
      </table>
    )
  },
  methods: {
    onClick(event) {
      this.table.$emit(`header-row-click`, event)
    },
    onCellClick(column, index, event) {
      this.table.$emit(`header-cell-click`, this.table, column, index, event)
    },
    getHeaderClass() {
      const classes = ['']
      const headerClassName = this.table.headerClassName
      if (typeof headerClassName === 'string') {
        classes.push(headerClassName)
      }
      if (typeof headerClassName === 'function') {
        classes.push(headerClassName() || '')
      }
      return classes
    },
    getHeaderCellStyle(cellIndex, column) {
      const headerStyle = this.table.headerStyle
      if (typeof headerStyle === 'function') {
        return headerStyle(column, cellIndex)
      }
      return headerStyle
    },
    getHeaderCellClass(cellIndex, column) {
      const classes = []
      const headerCellClassName = this.table.headerCellClassName
      if (typeof headerCellClassName === 'string') {
        classes.push(headerCellClassName)
      }
      if (typeof headerCellClassName === 'function') {
        return headerCellClassName(this.table, column, cellIndex)
      }
      return classes.join(' ')
    }
  }
}
