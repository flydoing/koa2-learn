export const getCell = function(event) {
  let cell = event.target

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD' || cell.tagName.toUpperCase() === 'TH') {
      return cell
    }
    cell = cell.parentNode
  }

  return null
}

export const getColumnByCell = function(table, cell) {
  const matches = (cell.className || '').match(/vx-table--[^\s]+/gm)
  if (matches) {
    return getColumnById(table, matches[0])
  }
  return null
}

export const getColumnById = function(table, columnId) {
  let column = null
  table.columns.forEach(function(item) {
    if (item.id === columnId) {
      column = item
    }
  })
  return column
}
