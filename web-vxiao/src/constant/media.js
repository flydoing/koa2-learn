export default class Media {}
Media.PHOTO = 'photo'
Media.FILE = 'file'
Media.AUDIO = 'audio'
Media.VIDEO = 'video'
Media.URL = 'url'

Media.size = size => {
  let remark = size
  if (size < 1024) {
    remark = `${size}Bytes`
  } else if (size < 1024 * 1024) {
    remark = (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    remark = (size / (1024 * 1024)).toFixed(2) + 'MB'
  }
  return remark
}
