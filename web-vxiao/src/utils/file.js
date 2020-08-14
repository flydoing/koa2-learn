import Media from '@/constant/media'
const PHOTO = ['bpm', 'jpeg', 'jpg', 'gif', 'png', 'webp']
const FILE = ['doc', 'pdf', 'ppt', 'xls', 'txt', 'docx', 'pptx', 'xlsx', 'zip', 'apk']
const AUDIO = ['mp3', 'ogg', 'wav']
const VIDEO = ['avi', 'mpg', 'mpeg', 'mpe', 'm1v', 'm2v', 'mpv2', 'mp2v', 'dat', 'ts', 'tp', 'tpr', 'pva', 'pss', 'mp4', 'm4v', 'm4p', 'm4b', '3gp', '3gpp', '3g2', '3gp2', 'ogg', 'mov', 'qt', 'amr', 'rm', 'ram', 'rmvb', 'rpm', 'aac']

/**
 * 获取文件图标
 * @param  {[type]} t [description]
 * @return {[type]}   [description]
 */
const getFileIcon = (t) => {
  return `/static/f/icon_${t}@2x.png`
}
/**
 * 获取文件后缀
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const getExt = path => {
  let ext = ''
  if (path && path.length > 0) {
    ext = path.substring(path.lastIndexOf('.') + 1, path.length)
  }
  return ext.toLocaleLowerCase()
}

/**
 * 获取文件大小
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
const getSize = size => {
  let str = ''
  if (size < 1024) {
    str = size + 'B'
  } else if (size < 1024 * 1024) {
    str = (size / 1024).toFixed(1) + 'K'
  } else if (size < 1024 * 1024 * 1024) {
    str = (size / (1024 * 1024)).toFixed(1) + 'MB'
  }
  return str
}
/**
 * 判断是否图片
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const isPhoto = path => {
  const ext = getExt(path)
  if (PHOTO.indexOf(ext) > -1) return true
}

/**
 * 判断是否文件
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const isFile = path => {
  const ext = getExt(path)
  if (FILE.indexOf(ext) > -1) return true
}

/**
 * 判断是否音频
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const isAudio = path => {
  const ext = getExt(path)
  if (AUDIO.indexOf(ext) > -1) return true
}

/**
 * 判断是否视频
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const isVideo = path => {
  const ext = getExt(path)
  if (VIDEO.indexOf(ext) > -1) return true
}

const getType = path => {
  if (isVideo(path)) {
    return Media.VIDEO
  } else if (isAudio(path)) {
    return Media.AUDIO
  } else if (isPhoto(path)) {
    return Media.PHOTO
  } else { return Media.FILE }
}

export default { isVideo, isAudio, isFile, isPhoto, getSize, getExt, getFileIcon, getType }
