import Vue from 'vue'
class TableLayout {
  /**
   *Creates an instance of TableLayout.
   * @param {*} options
   * @memberof TableLayout
   */
  constructor(options) {
    this.observers = []

    this.table = null
    this.store = null
    this.columns = null

    this.height = null
    this.scrollX = false
    this.scrollY = false
    this.bodyWidth = null
    this.fixedWidth = null
    this.rightFixedWidth = null
    this.bodyHeight = null
    this.tableHeight = null
    this.fixedBodyHeight = null
    this.viewportHeight = null
    this.headerHeight = 40

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }
    if (!this.table) {
      throw new Error('table is required for Table Layout')
    }
    if (!this.store) {
      throw new Error('store is required for Table Layout')
    }
  }

  addObserver(observer) {
    this.observers.push(observer)
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }

  /**
   * @param {*} value
   * @param {string} [prop='height']
   * @memberof TableLayout
   */
  setHeight(value, prop = 'height') {
    const el = this.table.$el
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = Number(value)
    }
    this.height = value

    if (!el && (value || value === 0)) return Vue.nextTick(() => this.setHeight(value, prop))
    if (typeof value === 'number') {
      el.style[prop] = value + 'px'
      this.updateElsHeight()
    } else if (typeof value === 'string') {
      el.style[prop] = value
      this.updateElsHeight()
    }
  }
  /**
   * 实时更新滚动条
   * @memberof TableLayout
   */
  updateScrollY() {}

  /**
   * 更新element高度
   * @memberof TableLayout
   */
  updateElsHeight() {
    const { headerWrapper, appendWrapper } = this.table.$refs
    this.appendHeight = appendWrapper ? appendWrapper.offsetHeight : 0
    const headerHeight = (this.headerHeight = headerWrapper.offsetHeight)
    if (headerWrapper.offsetWidth > 0 && (this.table.columns || []).length > 0 && headerHeight < 2) {
      return Vue.nextTick(() => this.updateElsHeight())
    }
    const tableHeight = (this.tableHeight = this.table.$el.clientHeight)
    if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
      this.bodyHeight = tableHeight - headerHeight
    }
    this.fixedBodyHeight = this.bodyHeight
    this.viewportHeight = tableHeight
  }

  /**
   * 更新列宽
   * @memberof TableLayout
   */
  updateColumnsWidth() {
    const bodyWidth = this.table.$el.clientWidth
    let bodyMinWidth = 0

    const flattenColumns = this.store.states.columns
    let flexColumns = flattenColumns.filter(column => typeof column.width !== 'number')

    flattenColumns.forEach(column => {
      if (typeof column.width === 'number' && column.realWidth) column.realWidth = null
    })

    if (flexColumns.length > 0) {
      flattenColumns.forEach(column => {
        bodyMinWidth += column.width || column.minWidth || 80
      })
      // 如果最小宽小于容器的宽，则在已固定的列的基础上 ，等比放大
      if (bodyMinWidth <= bodyWidth) {
        this.scrollX = false
        const totalFlexWidth = bodyWidth - bodyMinWidth

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth
        } else {
          // 计算需要固定宽的所有列的总和
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0)
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth
          let noneFirstWidth = 0

          flexColumns.forEach((column, index) => {
            if (index === 0) return
            const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel)
            noneFirstWidth += flexWidth
            column.realWidth = (column.minWidth || 80) + flexWidth
          })
          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth
        }
      } else {
        this.scrollX = true
        flexColumns.forEach(function(column) {
          column.realWidth = column.minWidth
        })
      }
      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth)
    } else {
      flattenColumns.forEach(column => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80
        } else {
          column.realWidth = column.width || column.minWidth
        }

        bodyMinWidth += column.realWidth
      })
      this.scrollX = bodyMinWidth > bodyWidth
      if (bodyMinWidth < bodyWidth) {
        let p = Math.floor((bodyWidth - bodyMinWidth) / flattenColumns.length)
        flattenColumns.forEach(column => {
          column.realWidth += p
        })
      } else {
        this.bodyWidth = bodyMinWidth
      }
    }

    const fixedColumns = this.store.states.fixedColumns || []
    if (fixedColumns.length > 0) {
      let fixedWidth = 0
      fixedColumns.forEach(function(column) {
        fixedWidth += column.realWidth || column.width
      })
      this.fixedWidth = fixedWidth
    }
    const rightFixedColumns = this.store.states.rightFixedColumns || []
    if (rightFixedColumns.length > 0) {
      let rightFixedWidth = 0
      rightFixedColumns.forEach(function(column) {
        rightFixedWidth += column.realWidth || column.width
      })
      this.rightFixedWidth = rightFixedWidth
    }
    // 用于更新所有的table-body 组件
    this.observers.forEach(observer => {
      observer.onColumnsChange(this)
    })
  }
}

export default TableLayout
