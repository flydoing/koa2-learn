<template>
  <div class="quill-editor editor_"
       :style="editorStyle"
       :id="id">
    <div id="toolbar"
         class="editor-toolbars"
         ref="_toolbar">
      <div class="custom-toolbar">
        <el-upload ref="_imageUpload"
                   class="editor-upload"
                   :action="uploadURL"
                   :data="{'cover':1}"
                   :show-file-list="false"
                   :multiple="multiple"
                   accept="image/png, image/jpeg,.gif"
                   :before-upload="onPhotoBefore"
                   :on-success="onSuccess"
                   :on-error="onError"
                   :on-exceed="onExceed">
          <i class="ico ico-photo" />
        </el-upload>
        <el-upload ref="_fileUpload"
                   class="editor-upload"
                   :action="uploadURL"
                   :show-file-list="false"
                   :multiple="multiple"
                   accept=".doc,.docx,.zip,.pdf,.xls,.xlsx,.rp"
                   :before-upload="onFileBefore"
                   :on-progress="onProgress"
                   :on-success="onSuccess"
                   :on-error="onError">
          <i class="ico ico-file" />
        </el-upload>
        <slot name="toolbar"></slot>
      </div>
      <slot name="toolbar-button"></slot>
      <button type="button"
              class="ql-bold"
              title="加粗"></button>
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
      <button type="button"
              class="ql-italic"
              title="斜体"></button>
      <button type="button"
              class="ql-underline"
              title="下划线"></button>
      <button type="button"
              class="ql-strike"
              title="删除线"></button>
      <button type="button"
              class="ql-blockquote"
              title="引用"></button>
      <!-- <button type="button" class="ql-code-block" title="代码"></button> -->
      <button type="button"
              class="ql-header"
              value="1"
              title="标题1"></button>
      <button type="button"
              class="ql-header"
              value="2"
              title="标题2"></button>
      <button type="button"
              class="ql-list"
              value="ordered"
              title="有序列表"></button>
      <button type="button"
              class="ql-list"
              value="bullet"
              title="无序列表"></button>
      <button type="button"
              class="ql-indent"
              value="-1"
              title="减少缩进"></button>
      <button type="button"
              class="ql-indent"
              value="+1"
              title="增加缩进"></button>
      <button type="button"
              class="ql-direction"
              value="rtl"
              title="输入方向"></button>
      <select class="ql-color"
              title="字体颜色">
        <option selected="selected"></option>
        <option value="#e60000"></option>
        <option value="#ff9900"></option>
        <option value="#ffff00"></option>
        <option value="#008a00"></option>
        <option value="#0066cc"></option>
        <option value="#9933ff"></option>
        <option value="#ffffff"></option>
        <option value="#facccc"></option>
        <option value="#ffebcc"></option>
        <option value="#ffffcc"></option>
        <option value="#cce8cc"></option>
        <option value="#cce0f5"></option>
        <option value="#ebd6ff"></option>
        <option value="#bbbbbb"></option>
        <option value="#f06666"></option>
        <option value="#ffc266"></option>
        <option value="#ffff66"></option>
        <option value="#66b966"></option>
        <option value="#66a3e0"></option>
        <option value="#c285ff"></option>
        <option value="#888888"></option>
        <option value="#a10000"></option>
        <option value="#b26b00"></option>
        <option value="#b2b200"></option>
        <option value="#006100"></option>
        <option value="#0047b2"></option>
        <option value="#6b24b2"></option>
        <option value="#444444"></option>
        <option value="#5c0000"></option>
        <option value="#663d00"></option>
        <option value="#666600"></option>
        <option value="#003700"></option>
        <option value="#002966"></option>
        <option value="#3d1466"></option>
      </select>
      <select class="ql-background"
              title="背景色">
        <option value="#000000"></option>
        <option value="#e60000"></option>
        <option value="#ff9900"></option>
        <option value="#ffff00"></option>
        <option value="#008a00"></option>
        <option value="#0066cc"></option>
        <option value="#9933ff"></option>
        <option selected="selected"></option>
        <option value="#facccc"></option>
        <option value="#ffebcc"></option>
        <option value="#ffffcc"></option>
        <option value="#cce8cc"></option>
        <option value="#cce0f5"></option>
        <option value="#ebd6ff"></option>
        <option value="#bbbbbb"></option>
        <option value="#f06666"></option>
        <option value="#ffc266"></option>
        <option value="#ffff66"></option>
        <option value="#66b966"></option>
        <option value="#66a3e0"></option>
        <option value="#c285ff"></option>
        <option value="#888888"></option>
        <option value="#a10000"></option>
        <option value="#b26b00"></option>
        <option value="#b2b200"></option>
        <option value="#006100"></option>
        <option value="#0047b2"></option>
        <option value="#6b24b2"></option>
        <option value="#444444"></option>
        <option value="#5c0000"></option>
        <option value="#663d00"></option>
        <option value="#666600"></option>
        <option value="#003700"></option>
        <option value="#002966"></option>
        <option value="#3d1466"></option>
      </select>
      <select class="ql-align"
              title="对齐">
        <option selected="selected"></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
      <button type="button"
              title="超链接"
              class="ql-link"></button>
      <button type="button"
              class="ql-clean"
              title="还原"></button>
      <el-popover placement="bottom-start"
                  width="200"
                  trigger="click"
                  v-model="showSetTable">
        <div>
          <el-input placeholder="输入行数"
                    v-model="tableConfig.row">
            <template slot="prepend">行数</template>
          </el-input>
        </div>
        <div style="margin:10px 0 10px 0">
          <el-input placeholder="输入列数"
                    v-model="tableConfig.colunm">
            <template slot="prepend">列数</template>
          </el-input>
        </div>
        <div style="text-align: right;">
          <el-button size="mini"
                     type="text"
                     @click="showSetTable = false">取消</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="handleTable">确定</el-button>
        </div>
        <i class="ico ico-date custom-table"
           slot="reference"
           title="插入表格" />
      </el-popover>

    </div>
    <div ref="_editor"></div>
    <div class="media-body">
      <div class="file-list"
           v-if="files.length > 0">
        <a class="file-block"
           target="_blank"
           v-for="(file,i) in files"
           :key="i">
          <div class="logo"><img :src="fileLogo(file)"
                 alt='头像'></div>
          <div class="title">
            <div>{{file.fileName}}</div>
            <div>{{file.size | filterSize}}</div>
          </div>
          <div class="remark">
            <i class="ico ico-delete"
               @click="removeMedia(file)" />
          </div>
          <div class="progress"
               v-if="file.percentage"
               :data-progress="file.percentage"
               :style="prefixProgress(file)"></div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import Str from '@/utils/string'
  import Quill from 'quill'
  import FileUtils from '@/utils/file'
  import Media from '@/constant/media'
  import PhotoBlot from './photo/PhotoBlot'
  import TableBlot from './table/TableBlot'
  import Check from '@/utils/check'
  import M from './mixin'
  var Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px']
  Quill.register({
    'formats/photo': PhotoBlot,
    'formats/table': TableBlot
  })
  Quill.register(Size, true)
  export default {
    mixins: [M],
    components: {},
    props: {
      id: { type: String, default: `editor_${Str.uuid()}` },
      store: { type: Object },
      multiple: { type: Boolean, default: true },
      height: { type: Number, default: 0 },
      placeholder: { type: String, default: '请输入内容' }
    },
    data() {
      return {
        loading: null,
        mediaDatas: [],
        isInit: false,
        showSetTable: false,
        tableConfig: {
          row: '',
          colunm: ''
        }
      }
    },
    computed: {
      files() {
        return this.medias.filter(v => {
          return v.type !== 'photo'
        })
      },
      editorStyle() {
        if (this.height) {
          return { height: `${this.height - 38}px` }
        }
        return {}
      }
    },
    methods: {
      initialize() {
        const that = this
        let store = this.store || {}
        let medias = []
        if (store.medias) {
          medias = this.store.medias.filter(v => {
            return v.type !== 'photo'
          })
        }
        that.medias = medias
        that.mediaDatas = store.medias || []
        if (!that.quill) {
          if (that.$el) {
            that.quill = new Quill(
              that.$refs._editor,
              Object.assign({}, this.defaultOptions, {
                placeholder: this.placeholder,
                modules: {
                  toolbar: { container: '#toolbar' }
                }
              })
            )
            // 禁用所以的调试
            Quill.debug(false)
            if (store.content) {
              let content = store.content
              content = content.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g, '&nbsp;&nbsp;')
              that.quill.pasteHTML(0, content)
              if (Check.isRealArray(that.mediaDatas)) {
                let imgMedias = that.mediaDatas.filter(v => {
                  return v.type !== 'file'
                })
                let opts = that.quill.getContents().ops
                let index = 0
                if (Check.isRealArray(opts)) {
                  let datas = opts.map(v => {
                    if (Check.isObject(v.insert) && v.insert.photo && imgMedias[index]) {
                      v.insert = {
                        photo: { url: that.url(imgMedias[index].fileId), data: imgMedias[index] }
                      }
                      index++
                    }
                    return v
                  })
                  this.quill.setContents(datas)
                }
              }
            }
            // 监听编辑变化
            this.quill.on('editor-change', function(eventName, delta, oldDelta, source) {
              let html = that.$refs._editor.children[0].innerHTML
              that.quill.update()
              // TODO 转换@ 、# 等特殊业务标签
              that.getMedias()
              if (html === '<p><br></p>') {
                that.$emit('input', '')
              }
              that.$emit('input', html)
              that.$emit('update:store', { ...that.store, content: that.filterHtml(html), medias: that.mediaDatas })
            })
            that.$emit('ready', that.quill)
          }
        }
      },
      getMedias() {
        if (this.quill) {
          let ops = this.quill.getContents().ops
          let photos = []
          if (Check.isRealArray(ops)) {
            ops.forEach(c => {
              if (c.insert.photo && c.insert.photo.data) {
                photos.push(c.insert.photo.data)
              }
            })
          }
          let fileMedias = this.mediaDatas.filter(v => {
            return v.type !== 'photo'
          })
          this.mediaDatas = [...fileMedias, ...photos]
        }
      },
      onPhotoBefore() {
        this.loading = this.$loading({ target: this.$el })
      },
      getMediaData(file) {
        return {
          fileName: file.name,
          status: file.status || '1',
          extension: file.extension,
          size: file.size,
          fileId: file.id,
          type: FileUtils.getType(file.name) || Media.FILE,
          remark: file.remark || void 0
        }
      },
      onSuccess(res, file, fileList) {
        const that = this
        let range = that.quill.getSelection(true)
        let _file = file.response.file
        let fileType = FileUtils.getType(file.name) || Media.FILE
        if (fileType === Media.PHOTO) {
          that.quill.insertEmbed(
            range.index,
            'photo',
            {
              url: that.url(_file.id),
              data: that.getMediaData(_file)
            },
            Quill.sources.USER
          )
          that.quill.setSelection(range.index + 1, Quill.sources.SILENT)
        } else {
          fileList.some(f => {
            that.medias.some((m, i) => {
              if (f.uid === m.fileId && f.response) {
                let _file = f.response.file
                that.$set(that.medias, i, that.getMediaData(_file))

                let imgMedias = that.mediaDatas.filter(v => {
                  return v.type !== 'file'
                })
                that.mediaDatas = [...imgMedias, ...that.medias]
                that.$emit('update:store', { ...that.store, medias: that.mediaDatas })
              }
            })
          })
        }
        that.loading && that.loading.close()
      },
      removeMedia(file) {
        this.medias.some((media, i) => {
          if (media.fileId === file.fileId) {
            this.medias.splice(i, 1)
            return true
          }
        })
        this.mediaDatas.some((media, i) => {
          if (media.fileId === file.fileId) {
            this.mediaDatas.splice(i, 1)
            return true
          }
        })
        this.$emit('update:store', { ...this.store, medias: this.mediaDatas })
      }
    },
    activated() {
      this.initialize()
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    watch: {}
  }
</script>
<style lang="scss">
  .quill-editor.editor_ {
    .ql-editor {
      min-height: rem(90) !important;
      padding: rem(8) !important;
      font-size: rem(14) !important;
      img {
        display: inline-block;
      }
    }

    .ql-container.ql-snow {
      border: none !important;
    }

    .ql-snow {
      &.ql-toolbar {
        button,
        .ql-picker {
          margin-top: rem(2.5) !important;
        }
        .ql-picker-options {
          right: 0 !important;
        }
      }
      .ql-picker {
        &.ql-size {
          .ql-picker-label[data-value='10px']::before {
            content: '10px';
            font-size: 10px;
          }
          .ql-picker-label[data-value='12px']::before {
            content: '12px';
            font-size: 12px;
          }
          .ql-picker-label[data-value='14px']::before {
            content: '14px';
            font-size: 14px;
          }
          .ql-picker-label[data-value='16px']::before {
            content: '16px';
            font-size: 16px;
          }
          .ql-picker-label[data-value='18px']::before {
            content: '18px';
            font-size: 18px;
          }
          .ql-picker-label[data-value='20px']::before {
            content: '20px';
            font-size: 20px;
          }
          .ql-picker-label[data-value='24px']::before {
            content: '24px';
            font-size: 24px;
          }
          .ql-picker-label[data-value='32px']::before {
            content: '32px';
            font-size: 32px;
          }
        }
      }
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
      content: '10px';
      font-size: 10px;
    }

    .editor-toolbars {
      border: none !important;
      padding: rem(0) !important;
      padding-left: nth($padding, 1) !important;
      padding-bottom: rem(5) !important;
      padding-top: rem(2.5) !important;
      background: nth($background, 9);
      @include flex;
      flex-wrap: wrap;
      padding-left: rem(8);
      .custom-toolbar {
        display: inline-block;
      }
    }

    .editor-upload {
      display: inline-block;
    }

    .ql-tooltip {
      left: rem(30) !important;
    }
  }

  .media-body {
    padding: rem(0) rem(10);
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      overflow: hidden;
      &:after {
        content: attr(data-progress);
      }
    }
    .file {
      &-block {
        .progress {
          width: 0%;
          text-align: right;
          padding-right: rem(10);
          line-height: rem(45);
        }
        .ico {
          vertical-align: middle;
        }
      }
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
      content: '10px';
      font-size: 10px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
      content: '20px';
      font-size: 20px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
      content: '20px';
      font-size: 20px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
      content: '20px';
      font-size: 20px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
      content: '20px';
      font-size: 20px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
      content: '20px';
      font-size: 20px;
    }
    //默认的样式
    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '14px';
      font-size: 14px;
    }
  }
  .custom-table {
    color: #000;
    font-size: 15px;
    line-height: 30px;
    margin: 0px 5px;
    font-weight: 600;
  }
</style>
