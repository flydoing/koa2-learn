import 'quill/dist/quill.snow.css'
import Media from '@/constant/media'
import Check from '@/utils/check'
import ArrayUtils from '@/utils/array'
import FileUtils from '@/utils/file'
import defaultOptions from './options'
import Quill from 'quill'
// 合并对象
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value(target, varArgs) {
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource !== null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}
export default {
  data() {
    return {
      fileSize: 512,
      quill: null,
      medias: [],
      defaultOptions
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.store)
    },
    initialize() {
      const that = this
      let store = this.store || {}
      this.medias = store.medias || []
      if (!this.quill) {
        if (that.$el) {
          that.quill = new Quill(
            that.$refs._editor,
            Object.assign({}, this.defaultOptions, {
              placeholder: this.placeholder,
              modules: {
                toolbar: { container: that.$refs._editor }
              }
            })
          )

          // 截屏粘贴图片上传
          that.quill.root.addEventListener(
            'paste',
            e => {
              that.pasteUpload(e)
            },
            false
          )

          // 拖放图片上传
          that.quill.root.addEventListener(
            'drop',
            e => {
              that.dropUpload(e)
            },
            false
          )

          // 禁用所以的调试
          Quill.debug(false)
          if (store.content) {
            that.quill.pasteHTML(0, store.content)
          }
          that.quill.on('text-change', (delta, oldDelta, source) => {
            let html = that.$refs._editor.children[0].innerHTML
            that.quill.update()
            if (source === 'user') {
              // TODO 转换@ 、# 等特殊业务标签
              if (html === '<p><br></p>') {
                that.$set(that.store, 'content', '')
                that.$emit('input', '')
                return
              }
              this.$emit('input', that.getContent())
            }
          })
          that.$emit('ready', that.quill)
        }
      }
    },
    // 粘贴上传
    pasteUpload(event) {
      if (event.clipboardData.files.length > 0) {
        event.preventDefault()
        let files = [...event.clipboardData.files]
        files.forEach((v, i) => {
          let timeStamp = new Date().getTime()
          this.uploadImage(v, timeStamp)
        })
      }
    },
    // 拖放上传
    dropUpload(event) {
      event.preventDefault()
      if (event.dataTransfer.files.length > 0) {
        let files = [...event.dataTransfer.files]
        files.forEach((v, i) => {
          let timeStamp = new Date().getTime()
          this.uploadImage(v, timeStamp)
        })
      }
    },
    // 上传图片
    uploadImage(file, timeStamp) {
      const that = this
      // 构造表单
      let formData = new FormData()
      formData.append('file', file)

      // 创建ajax请求
      let xhr = new XMLHttpRequest()
      xhr.open('post', that.uploadURL, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          // success
          let res = JSON.parse(xhr.responseText)
          if (xhr.status === 200) {
            let _file = res.file
            that.medias.some((m, i) => {
              if (m.fileId === timeStamp) {
                that.$set(that.medias, i, {
                  fileName: _file.name,
                  status: _file.status || '1',
                  extension: _file.extension,
                  size: _file.size,
                  fileId: _file.id,
                  type: FileUtils.getType(_file.name) || Media.FILE,
                  remark: _file.remark || void 0
                })
                return true
              }
            })
            that.$emit('update:store', {
              ...that.store,
              medias: that.medias
            })
          } else {
            // error
            that.$message({ message: res.msg || '操作失败', type: 'warning' })
          }
        }
      }
      // 开始上传数据
      xhr.upload.onloadstart = e => {
        that.medias.push({
          type: Media.PHOTO,
          fileName: file.name,
          fileId: timeStamp,
          size: file.size,
          status: '1'
        })
      }
      // 上传过程
      xhr.upload.onprogress = e => {
        let complete = ((e.loaded / e.total) * 100) | 0
        that.medias.some((m, i) => {
          if (m.fileId === timeStamp) {
            that.$set(that.medias[i], 'percentage', `${complete}%`)
            return true
          }
        })
      }
      // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
      xhr.upload.onerror = e => {
        this.$message({ type: 'warning', message: '上传失败，请重新上传' })
      }
      // 上传数据完成（成功或者失败）时会触发
      xhr.upload.onloadend = e => {}
      xhr.send(formData)
    },
    getContent() {
      let that = this
      let content = ''
      if (that.quill) {
        let ops = that.quill.getContents().ops
        let tagging = []
        let notify = []
        let toUsers = []
        let medias = []
        if (Check.isRealArray(ops)) {
          ops.forEach(c => {
            let insert = c.insert
            if (Check.isString(insert)) {
              content = `${content}${insert}`
            } else if (insert.emoji) {
              content = `${content}${insert.emoji.data}`
            } else if (insert.topic) {
              content = `${content}${insert.topic.data}`
              tagging.push(insert.topic.data)
            } else if (insert.at) {
              content = `${content}${insert.at.data}`
              notify.push(insert.at.userId)
            } else if (c.insert.photo) {
              medias.push(c.insert.photo.data)
            } else if (c.insert.file) {
              medias.push(c.insert.file.data)
            }
          })
        }
        medias.push(...(this.medias || []))
        this.$emit('update:store', {
          ...this.store,
          medias,
          tagging,
          notify,
          toUsers,
          content: this.filterHtml(content.replace(/^\s+|\s+$/g, ''))
        })
      }
      return this.filterHtml(content.replace(/^\s+|\s+$/g, ''))
    },
    filterHtml(content) {
      content = content.replace(/[\\"\\'][\\s]*javascript:(.*)[\\"\\']/gi, '\\"\\"')
      content = content.replace(/<script.*?>.*?<\/script>/gi, ' ')
      content = content.replace(/<script.*?>.*?<script>/gi, ' ')
      content = content.replace(/\s*on[a-z]+\s*=\s*("[^"]+"|'[^']+'|[^\s]+)\s*/gi, '')
      content = content.replace(/<(style.*?)>.*?<(\/style.*?)>/gi, ' ')
      content = content.replace(/<\/?style.*?>/gi, ' ')
      // content = content.replace(/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i, ' ')
      return content
    },
    sendEmoji(emoji) {
      this.showEmoji = false
      let range = this.quill.getSelection(true)
      this.quill.insertEmbed(
        range.index,
        'emoji',
        {
          width: '20',
          data: `${emoji.phrase}`,
          url: `/static/e/${emoji.url}`
        },
        Quill.sources.USER
      )
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
    },
    handleAt() {
      this.routePushModel({
        path: '/vx/group/user/select'
      })
    },
    handleTopic() {
      this.routePush({
        path: '/vx/group/business/topic/select'
      })
    },
    // 插入表格
    handleTable() {
      this.showSetTable = false
      let range = this.quill.getSelection(true)
      this.quill.insertEmbed(
        range.index,
        'table',
        {
          row: this.tableConfig.row,
          colunm: this.tableConfig.colunm
        },
        Quill.sources.USER
      )
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
      this.tableConfig = {}
      // this.quill.insertEmbed(range.index + 1, 'br', Quill.sources.USER)
      // this.$nextTick(() => {
      //   this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
      //   // this.quill.insertText(range.index + 2, '000', { color: '#000' }, true)
      // })
    },
    fileLogo(file) {
      if (
        !ArrayUtils.contains(
          ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
          file.extension
        )
      ) {
        return '/static/f/icon_query@2x.png'
      }
      return `/static/f/icon_${file.extension}@2x.png`
    },
    onPhotoBefore(file) {
      const isLt = file.size / 1024 / 1024 < this.fileSize
      if (!isLt) {
        this.$message.error(`上传图片大小不能超过 ${this.fileSize}MB！`)
        return false
      }
      this.medias.push({
        type: Media.PHOTO,
        fileName: file.name,
        fileId: file.uid,
        size: file.size,
        status: '1'
      })
    },
    onProgress(e, file, fileList) {
      let that = this
      fileList.some(f => {
        that.medias.some((m, i) => {
          if (f.uid === m.fileId) {
            that.$set(this.medias[i], 'percentage', `${f.percentage.toFixed(0)}%`)
            return true
          }
        })
      })
    },
    onSuccess(res, file, fileList) {
      let that = this
      fileList.some(f => {
        that.medias.some((m, i) => {
          if (f.uid === m.fileId && f.response) {
            let _file = f.response.file
            that.$set(this.medias, i, {
              fileName: _file.name,
              status: _file.status || '1',
              extension: _file.extension,
              size: _file.size,
              fileId: _file.id,
              type: FileUtils.getType(f.name) || Media.FILE,
              remark: _file.remark || void 0
            })
            return true
          }
        })
      })
      this.$emit('update:store', {
        ...this.store,
        medias: this.medias
      })
    },
    onError(e, file, fileList) {
      let that = this
      fileList.some(f => {
        that.medias.some((m, i) => {
          if (f.uid === m.fileId) {
            that.medias.splice(i, 1)
            return true
          }
        })
      })
      this.$emit('update:store', {
        ...this.store,
        medias: this.medias
      })
      this.$message({ type: 'warning', message: '上传失败，请重新上传' })
    },
    onExceed() {
      this.$message({ type: 'warning', message: '最多只能上传9张图片' })
      return false
    },
    onFileBefore(file) {
      const isLt = file.size / 1024 / 1024 < this.fileSize
      if (!isLt) {
        this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB！`)
        return false
      }
      this.medias.push({
        new: 1,
        type: Media.FILE,
        fileName: file.name,
        fileId: file.uid,
        size: file.size,
        extension: FileUtils.getExt(file.name),
        status: '1'
      })
    },
    prefixProgress(file) {
      if (file.percentage) {
        return {
          width: `${file.percentage}`
        }
      }
      return {}
    },
    removeMedia(file) {
      this.medias.some((media, i) => {
        if (media.fileId === file.fileId) {
          this.medias.splice(i, 1)
          return true
        }
      })
      this.$emit('update:store', {
        ...this.store,
        medias: this.medias
      })
    }
  },
  filters: {
    filterSize(size) {
      return FileUtils.getSize(size)
    }
  },
  watch: {
    placeholder(v) {
      this.quill.options.placeholder = v
    },
    disabled(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    },
    store(val) {
      this.medias = val.medias || []
    }
  }
}
