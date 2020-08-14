import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class TopicBlot extends Embed {
  static create(value) {
    let node = super.create()
    if (value.data) {
      node.setAttribute('data', `${value.data}`)
      node.style.color = '#00C162'
    }
    node.append(` ${value.text} `)
    return node
  }

  static value(node) {
    return {
      data: node.getAttribute('data'),
      text: node.innerText
    }
  }
}
TopicBlot.blotName = 'topic'
TopicBlot.tagName = 'topic'
