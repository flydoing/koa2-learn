let columnIdSeed = 1
const defaults = {
  default: {},
  index: {
    width: 50,
    minWidth: 50,
    realWidth: 50
  },
  selection: {
    width: 50,
    minWidth: 50,
    realWidth: 50,
    className: 'vx-table-column--selection'
  }
}

const parseWidth = width => {
  if (width !== undefined) {
    width = parseInt(width, 10)
    if (isNaN(width)) {
      width = null
    }
  }
  return width
}

const parseMinWidth = minWidth => {
  if (minWidth !== undefined) {
    minWidth = parseInt(minWidth, 10)
    if (isNaN(minWidth)) {
      minWidth = 100
    }
  }
  return minWidth
}

const getDefaultColumn = (type, options) => {
  const column = { ...defaults[type || 'default'] }
  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name]
      if (typeof value !== 'undefined') {
        column[name] = value
      }
    }
  }
  if (!column.minWidth) {
    column.minWidth = 100
  }
  column.realWidth = column.width === undefined ? column.minWidth : column.width
  return column
}

export default {
  name: 'VxTableColumn',
  props: {
    type: { type: String, default: 'default' }, // 对应列的类型，selection 则显示多选框；如果设置了 index 则显示该行的索引 selection/index
    label: String, // 表头列，显示的标题
    className: String, // 列的样式
    labelClassName: String, // 表头列的样式
    prop: String, // 对应列内容的字段名
    width: {},
    minWidth: {},
    align: String, // 对齐方式 left/center/right
    fixed: [Boolean, String], // 列是否固定在左侧或者右侧，true 表示固定在左侧，rue, left, right
    index: [Number, Function], // 如果设置了 type=index，可以通过传递 index 属性来自定义索引
    showTooltip: Boolean, // 当内容过长被隐藏时显示 tooltip
    renderHeader: Function
  },
  data() {
    return {
      columns: []
    }
  },
  beforeCreate() {
    this.row = {}
    this.column = {}
    this.$index = 0
  },
  computed: {
    owner() {
      let parent = this.$parent
      while (parent && !parent.tableId) {
        parent = parent.$parent
      }
      return parent
    }
  },
  created() {
    this.customRender = this.$options.render
    this.$options.render = h => h('div', this.$slots.default)

    let type = this.type
    let parent = this.owner
    let _id = parent.tableId
    this.columnId = `${_id}_column_${columnIdSeed++}`

    const width = parseWidth(this.width, 10)
    const minWidth = parseMinWidth(this.minWidth, 10)

    let _column = getDefaultColumn(type, {
      id: this.columnId,
      label: this.label,
      className: this.className,
      labelClassName: this.labelClassName,
      type,
      width,
      minWidth,
      property: this.prop,
      align: this.align ? `is-${this.align}` : null,
      index: this.index,
      fixed: this.fixed === '' ? true : this.fixed,
      showTooltip: this.showTooltip,
      renderCell: null,
      renderHeader: this.renderHeader
    })
    this.columnConfig = _column
    let renderCell = _column.renderCell
    let _self = this
    _column.renderCell = function(h, data) {
      if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data)
      }
      if (!renderCell) {
        renderCell = function(h, { row, column, $index }) {
          const property = column.property
          const value = row[property]
          if (column && column.formatter) {
            return column.formatter(row, column, value, $index)
          }
          return value
        }
      }
      return <div class="cell">{renderCell(h, data)}</div>
    }
  },
  mounted() {
    const owner = this.owner
    let columnIndex = [].indexOf.call(owner.$refs.hiddenColumns.children, this.$el)
    this.$set(this.columnConfig, 'columnIndex', columnIndex)
    owner.store.commit('insertColumn', this.columnConfig, columnIndex)
  },
  destroyed() {
    this.owner.store.commit('removeColumn', this.columnConfig, parent.columnConfig)
  }
}
