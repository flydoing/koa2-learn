<template>
  <div class="praxis-editor">
    <div :id="id">
      <el-upload ref="_imageUpload"
                 class="editor-upload"
                 :action="uploadURL"
                 :show-file-list="false"
                 :multiple="multiple"
                 accept="image/png, image/jpeg,.gif"
                 :before-upload="onPhotoBefore"
                 :on-progress="onProgress"
                 :on-success="onSuccess"
                 :on-error="onError"
                 :on-exceed="onExceed">
        <i class="ico ico-photo" />
      </el-upload>
      <select class="ql-align">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <select class="ql-size"
              title="字体大小">

        <option value="12px">12px</option>
        <option value="14px"
                selected>14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
      </select>
      <button class="ql-indent"
              value="-1"></button>
      <button class="ql-indent"
              value="+1"></button>
      <button class="ql-link"></button>
    </div>
    <div ref="_editor"></div>
  </div>
</template>
<script>
  import Quill from 'quill'
  import Str from '@/utils/string'
  import PhotoBlot from './photo/PhotoBlot'
  import Media from '@/constant/media'
  import FileUtils from '@/utils/file'
  import M from './mixin'
  import Check from '@/utils/check'

  var Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px']
  Quill.register({
    'formats/photo': PhotoBlot
  })
  Quill.register(Size, true)

  export default {
    mixins: [M],
    props: {
      value: String,
      // id: {
      //   type: String,
      //   default: `editor_${Str.uuid()}`
      // },
      property: {
        id: {
          type: String,
          default: 'content'
        }
      },
      placeholder: {
        type: String,
        default: '请输入解析内容'
      },
      multiple: {
        type: Boolean,
        default: true
      },
      store: {
        type: Object
      }
    },
    data() {
      return {
        id: `editor_${Str.uuid()}`,
        loading: {},
        isInit: false
      }
    },
    methods: {
      onPhotoBefore() {
        this.loading = this.$loading({ target: this.$el })
      },
      onSuccess(res, file, fileList) {
        let range = this.quill.getSelection(true)
        let _file = file.response.file
        let fileType = FileUtils.getType(_file.name) || Media.FILE
        let mediaData = {
          fileName: _file.name,
          status: _file.status || '1',
          extension: _file.extension,
          size: _file.size,
          fileId: _file.id,
          type: fileType,
          remark: _file.remark || void 0
        }
        this.quill.insertEmbed(
          range.index,
          'photo',
          {
            // width: '80',
            // height: '60',
            maxWidth: '300',
            url: this.url(_file.id),
            data: mediaData
          },
          Quill.sources.USER
        )
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
        this.loading.close()
      },
      initialize() {
        let that = this
        if (that.$el) {
          that.quill = new Quill(
            that.$refs._editor,
            Object.assign({}, this.defaultOptions, {
              placeholder: this.placeholder,
              modules: {
                toolbar: {
                  container: `#${this.id}`
                }
              }
            })
          )
          // 禁用所以的调试
          Quill.debug(false)
          if (that.store.ops && that.store.ops.length > 0) {
            that.quill.setContents(that.store.ops)
          } else if (that.store[that.property]) {
            that.quill.pasteHTML(0, that.store[that.property])
            if (Check.isRealArray(that.store[`${that.property}_imgs`])) {
              let urls = []
              let attrReg = /data-src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
              that.store[`${that.property}_imgs`].map(v => {
                let src = v.match(attrReg)
                urls.push(src[1])
              })

              let index = 0
              let opts = this.quill.getContents().ops
              if (Check.isRealArray(opts)) {
                let datas = opts.map(v => {
                  if (Check.isObject(v.insert) && v.insert.photo && urls[index]) {
                    v.insert = {
                      photo: {
                        url: this.url(urls[index]),
                        data: {
                          fileName: `fileName${index}`,
                          status: '1',
                          extension: '',
                          size: '',
                          fileId: urls[index],
                          type: 'photo',
                          remark: ''
                        }
                      }
                    }
                    index++
                  }
                  return v
                })
                this.quill.setContents(datas)
              }
            }
          }
          that.quill.on('text-change', (delta, oldDelta, source) => {
            let html = that.$refs._editor.children[0].innerHTML
            that.$emit('input', html)
            if (html === '<p><br></p>') {
              that.$emit('input', '')
            }
            that.quill.update()
          })
          that.$emit('ready', that.quill)
        }
      }
    },
    mounted() {
      this.initialize()
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    watch: {
      'store.explain'(val) {
        const that = this
        if (that.quill) {
          let ops = that.quill.getContents().ops
          if (Check.isRealArray(ops)) {
            ops.forEach(c => {
              if (c.insert.photo) {
                that.$set(c.insert.photo, 'url', that.url(c.insert.photo.data.fileId))
                that.$emit('update:store', {
                  ...that.store,
                  explain: that.filterHtml(val),
                  ops: ops
                })
              }
            })
          }
        }
      },
      'store.content'(val) {
        const that = this
        if (that.quill) {
          let ops = that.quill.getContents().ops
          if (Check.isRealArray(ops)) {
            ops.forEach(c => {
              if (c.insert.photo) {
                that.$set(c.insert.photo, 'url', that.url(c.insert.photo.data.fileId))
                that.$emit('update:store', {
                  ...that.store,
                  content: that.filterHtml(val),
                  ops: ops
                })
              }
            })
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .praxis-editor {
    padding: 0 rem(10) rem(10);
    .editor-upload {
      display: inline-block;
      .ico-photo {
        font-size: rem(18);
      }
    }
    .ql-toolbar {
      &.ql-snow {
        @include flex;
        @include ai;
        border: $border;
        background-color: #ededed;
        padding: rem(3) rem(8);
      }
    }

    .ql-container {
      &.ql-snow {
        border: $border;
      }
    }

    .ql-tooltip {
      left: rem(15) !important;
    }

    .ql-editor {
      max-height: rem(300);
      min-height: rem(90) !important;
      padding: rem(8) !important;
      font-size: rem(14) !important;
      img {
        display: inline-block;
      }
    }
  }
</style>
