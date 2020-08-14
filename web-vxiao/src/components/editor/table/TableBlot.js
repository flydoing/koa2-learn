import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class TableBlot extends Embed {
  static create(value) {
    let node = super.create()
    console.log(node, 'node')
    console.log(value, 'value')
    // node.setAttribute('cellspacing', 0)
    // node.setAttribute('cellpadding', 0)
    node.className = 'noticeTable'
    let thead = document.createElement('thead')
    node.appendChild(thead)
    thead.style.height = 250 / value.row + 'px'
    thead.style.width = 500 / value.colunm + 'px'
    let tr = document.createElement('tr')
    thead.appendChild(tr)
    for (let i = 0; i < value.colunm; i++) {
      let th = document.createElement('th')
      th.style.height = 250 / value.row + 'px'
      th.style.width = 500 / value.colunm + 'px'
      tr.appendChild(th)
      th.setAttribute('contenteditable', true)
    }
    let tbody = document.createElement('tbody')
    node.appendChild(tbody)
    for (let i = 0; i < value.row - 1; i++) {
      let tr = document.createElement('tr')
      tr.style.height = 250 / value.row + 'px'
      tbody.appendChild(tr)
      for (let i = 0; i < value.colunm; i++) {
        let td = document.createElement('td')
        tr.appendChild(td)
        tr.style.width = 500 / value.colunm + 'px'
        td.setAttribute('contenteditable', true)
      }
    }

    return node
  }

  // static value(node) {
  //   console.log(node, 'back')
  //   return {
  //     data: node.getAttribute('data')
  //   }
  // }
}
TableBlot.blotName = 'table'
TableBlot.tagName = 'table'
