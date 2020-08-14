import Quill from 'quill'
let Embed = Quill.import('blots/embed')

export default class FileBlot extends Embed {
  static create(value) {
    let node = super.create()
    node.classList = 'editor-file'
    let $img = document.createElement('img')
    let $label = document.createElement('label')
    $img.setAttribute('src', value.url)
    $label.append(value.name)
    node.appendChild($img)
    node.appendChild($label)
    node.mediaData = value.data
    return node
  }

  static value(node) {
    if (node.mediaData) {
      return {
        data: node.mediaData
      }
    }
    return null
  }
}
FileBlot.blotName = 'file'
FileBlot.tagName = 'file'
