import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class PhotoBlot extends Embed {
  static create(value) {
    let node = super.create()
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    node.setAttribute('max-width', value.maxWidth)
    node.style.display = 'inline-block'
    node.setAttribute('src', value.url)
    node.mediaData = value.data
    return node
  }

  static value(node) {
    return {
      data: node.mediaData
    }
  }
}
PhotoBlot.blotName = 'photo'
PhotoBlot.tagName = 'img'
