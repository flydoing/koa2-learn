import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class AtBlot extends Embed {
  static create(value) {
    let node = super.create()
    if (value.data && value.userId) {
      node.style.color = 'nth($background,3)'
      node.setAttribute('userId', value.userId)
      node.setAttribute('data', value.data)
    }
    node.append(` ${value.text} `)
    return node
  }

  static value(node) {
    return {
      data: node.getAttribute('data'),
      userId: node.getAttribute('userId'),
      text: node.innerText
    }
  }
}
AtBlot.blotName = 'at'
AtBlot.tagName = 'at'
