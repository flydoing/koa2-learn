import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class EmojiBlot extends Embed {
  static create(value) {
    let node = super.create()
    node.setAttribute('width', value.width)
    node.setAttribute('src', value.url)
    node.setAttribute('data', value.data)
    return node
  }

  static value(node) {
    return {
      data: node.getAttribute('data'),
      url: node.getAttribute('src')
    }
  }
}
EmojiBlot.blotName = 'emoji'
EmojiBlot.tagName = 'img'
