<template>
  <div class="quill-editor im _editor-im"
       :id="id">
    <div id="toolbar"
         class="custom-toolbars">
      <el-upload ref="_fileUpload"
                 v-if="toolbars.includes('photo')"
                 class="editor-upload"
                 :action="uploadURL"
                 accept="image/png, image/jpeg,.gif"
                 :show-file-list="false"
                 :multiple="true"
                 :before-upload="onPhotoBefore"
                 :on-progress="onProgress"
                 :on-success="onSuccess"
                 :on-error="onError"
                 :on-exceed="onExceed">
        <i class="ico ico-photo" />
      </el-upload>
      <el-upload ref="_fileUpload"
                 v-if="toolbars.includes('file')"
                 class="editor-upload"
                 :action="uploadURL"
                 :show-file-list="false"
                 :multiple="multiple"
                 accept=".doc,.docx,.zip,.pdf,.xls,.xlsx,.mp4,.ppt,.pptx,.mp3,.rp"
                 :before-upload="onFileBefore"
                 :on-progress="onProgress"
                 :on-success="onSuccess"
                 :on-error="onError">
        <i class="ico ico-file" />
      </el-upload>
      <el-popover placement="top-start"
                  width="432"
                  trigger="click"
                  v-model="showEmoji">
        <div class="vx-emojis">
          <keep-alive>
            <Emoji @click="sendEmoji" />
          </keep-alive>
        </div>
        <i class="ico ico-emoji"
           slot="reference"
           v-if="toolbars.includes('emoji')" />
      </el-popover>
    </div>
    <div ref="_editor"
         @keydown.enter.exact="onEnter($event)"
         @keydown.enter.ctrl="onInsertEnter"></div>
    <div class="submit-btn button"
         @click="submit">发送</div>
  </div>
</template>
<script>
  import Quill from 'quill'
  import FileUtils from '@/utils/file'
  import Str from '@/utils/string'
  import Media from '@/constant/media'
  import PhotoBlot from './photo/PhotoBlot'
  import FileBlot from './file/FileBlot'
  import EmojiBlot from './emoji/EmojiBlot'
  import M from './mixin'
  Quill.register({
    'formats/emoji': EmojiBlot,
    'formats/photo': PhotoBlot,
    'formats/file': FileBlot
  })

  export default {
    mixins: [M],
    components: {
      Emoji: resolve => require(['@/views/components/Emoji'], resolve)
    },
    props: {
      store: { type: Object },
      toolbars: {
        type: Array,
        default: () => {
          return ['photo', 'file', 'emoji']
        }
      },
      id: { type: String, default: `editor_${Str.uuid()}` },
      placeholder: { type: String, default: '输入内容' }
    },
    data() {
      return {
        multiple: true,
        showEmoji: false,
        showAt: false,
        loading: {}
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
        if (fileType === Media.PHOTO) {
          this.quill.insertEmbed(
            range.index,
            'photo',
            {
              width: '80',
              height: '60',
              url: this.url(_file.id),
              data: mediaData
            },
            Quill.sources.USER
          )
        } else {
          this.quill.insertEmbed(
            range.index,
            'file',
            {
              name: _file.name,
              url: this.fileLogo(_file),
              data: mediaData
            },
            Quill.sources.USER
          )
        }
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
        this.loading.close()
      },
      onEnter($event) {
        if (!$event.ctrlKey && !$event.altKey) {
          this.submit()
          this.quill.setText('', 'api')
        }
        $event.preventDefault()
      },
      onInsertEnter() {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, '\n')
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
      }
    },
    activated() {
      this.initialize()
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    watch: {
      'store.content'(val) {
        if (!this.quill.hasFocus()) {
          this.quill.setText(val, 'api')
        }
      },
      store(val) {
        if (!this.quill.hasFocus() && val) {
          this.quill.setText(val.content || '', 'api ')
        }
      }
    }
  }
</script>
<style lang="scss">
  ._editor-im {
    .ql-editor {
      height: rem(90);
      padding: rem(8) rem(5) !important;
      font-size: rem(14) !important;
      img {
        display: inline-block;
      }
    }

    .ql-toolbar {
      border: none !important;
      padding: rem(0) !important;
      padding-left: nth($padding, 1) !important;
    }

    .ql-container.ql-snow {
      border: none !important;
    }

    .custom-toolbars {
      height: rem(30);
      // background: nth($background, 9);
      padding-left: rem(5);
      overflow: hidden;
      i {
        padding: 0;
        width: rem(30);
        height: rem(30);
        line-height: rem(30);
      }
    }
    .button {
      position: absolute;
      bottom: rem(10);
      right: rem(10);
    }
    .editor-upload {
      display: inline-block;
    }
    .editor-file {
      background: nth($background, 1);
      display: inline-flex;
      width: auto;
      @include jc(flex-start);
      @include ai;
      height: rem(40);
      img {
        width: rem(40);
        vertical-align: middle;
      }
      label {
        margin: rem(0) rem(10);
        vertical-align: middle;
      }
    }
  }
</style>
