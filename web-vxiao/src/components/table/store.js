const TableStore = function(table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.')
  }
  this.table = table
  this.states = {
    data: null,
    columns: [],
    fixedColumns: [],
    fixedRightColumns: [],
    hoverRow: null,
    currentRow: null
  }
  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop]
    }
  }
}
TableStore.prototype.mutations = {
  setData(state, data) {
    state.data = data
  },

  insertColumn(state, column, index) {
    let array = state.columns
    if (typeof index !== 'undefined') {
      array.splice(index, 0, column)
    } else {
      array.push(column)
    }
    this.updateColumns()
    this.scheduleLayout()
  },

  removeColumn(states, column, parent) {
    let array = states._columns
    if (parent) {
      array = parent.children
      if (!array) array = parent.children = []
    }
    if (array) {
      array.splice(array.indexOf(column), 1)
    }

    if (this.table.$ready) {
      this.updateColumns()
      this.scheduleLayout()
    }
  },

  setHoverRow(states, row) {
    states.hoverRow = row
  },

  setCurrentRow(states, row) {
    const oldCurrentRow = states.currentRow
    states.currentRow = row
    // 如果当前行发生改变
    if (oldCurrentRow !== row) {
      this.table.$emit('current-change', row, oldCurrentRow)
    }
  }
}
TableStore.prototype.commit = function(name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}

TableStore.prototype.updateColumns = function() {
  const states = this.states
  const _columns = states.columns || []
  states.fixedColumns = _columns.filter(column => column.fixed === true || column.fixed === 'left')
  states.rightFixedColumns = _columns.filter(column => column.fixed === 'right')
}

TableStore.prototype.scheduleLayout = function(updateColumns) {
  if (updateColumns) {
    this.updateColumns()
  }
  this.table.debouncedUpdateLayout()
}

export default TableStore
