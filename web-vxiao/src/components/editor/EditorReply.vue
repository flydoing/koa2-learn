<template>
  <div class="quill-editor _editor-reply"
       :id="id">
    <div ref="_editor"></div>
    <div id="toolbar"
         class="custom-toolbars">
      <div class="custom-toolbar">
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
                   :on-exceed="onExceed"> <i class="ico ico-photo" />
        </el-upload>
        <el-popover placement="right"
                    width="500"
                    trigger="click"
                    v-model="showAt"
                    @show="handleShow"
                    @hide="handleHide">
          <div class="vx-emojis">
            <keep-alive>
              <SelectPopoverUser title="成员选择"
                                 :users="users"
                                 @submit="handleAt"
                                 :hasBack="true"
                                 @back="handleBack"
                                 ref="SelectPopoverUser" />
            </keep-alive>
          </div>
          <i class="ico ico-at"
             slot="reference" />
        </el-popover>
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
             slot="reference" />
        </el-popover>
      </div>
      <div class="submit-btn button"
           @click="submit">评论</div>
    </div>
  </div>
</template>
<script>
  import 'quill/dist/quill.snow.css'
  import FileUtils from '@/utils/file'
  import Str from '@/utils/string'
  import Check from '@/utils/check'
  import Media from '@/constant/media'
  import Quill from 'quill'
  import PhotoBlot from './photo/PhotoBlot'
  import EmojiBlot from './emoji/EmojiBlot'
  import AtBlot from './at/AtBlot'
  import M from './mixin'
  import R from '@/views/group/mixin'
  Quill.register({
    'formats/emoji': EmojiBlot,
    'formats/at': AtBlot,
    'formats/photo': PhotoBlot
  })

  export default {
    mixins: [M, R],
    components: {
      Emoji: resolve => require(['@/views/components/Emoji'], resolve),
      SelectPopoverUser: resolve => require(['@/views/components/group/SelectPopoverUser'], resolve)
    },
    props: {
      store: { type: Object },
      id: { type: String, default: `editor_${Str.uuid()}` },
      multiple: { type: Boolean, default: true },
      placeholder: { type: String, default: '请输入内容' }
    },
    data() {
      return {
        showEmoji: false,
        showAt: false,
        loading: {}
      }
    },
    computed: {
      users() {
        return this.getGroupUsers(this.groupId, '1_2_3') || []
      }
    },
    methods: {
      handleBack() {
        this.showAt = false
      },
      handleShow() {
        this.$refs.SelectPopoverUser.isShow = true
      },
      handleHide() {
        this.$refs.SelectPopoverUser.isShow = false
      },
      onPhotoBefore() {
        this.loading = this.$loading({ target: this.$el })
      },
      onSuccess(res, file, fileList) {
        let range = this.quill.getSelection(true)
        let _file = file.response.file
        this.quill.insertEmbed(
          range.index,
          'photo',
          {
            width: '100',
            height: '80',
            url: this.url(_file.id),
            data: {
              fileName: _file.name,
              status: _file.status || '1',
              extension: _file.extension,
              size: _file.size,
              fileId: _file.id,
              type: FileUtils.getType(_file.name) || Media.FILE,
              remark: _file.remark || void 0
            }
          },
          Quill.sources.USER
        )
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
        this.loading.close()
      },
      handleAt(users) {
        this.showAt = false
        if (Check.isRealArray(users)) {
          users.some(u => {
            let range = this.quill.getSelection(true)
            this.quill.insertEmbed(
              range.index,
              'at',
              {
                text: `@${u.name}`,
                userId: u.userId,
                data: `{\\@\\${u.name}\\${u.userId}\\}`
              },
              Quill.sources.USER
            )
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
          })
        }
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
        if (!this.quill.hasFocus() && val) {
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
  @import '~scss/_mixin';
  ._editor-reply {
    .ql-editor {
      max-height: rem(300);
      min-height: rem(90) !important;
      padding: rem(8) !important;
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
      background: nth($background, 9);
      padding-left: rem(8);
      overflow: hidden;
      .custom-toolbar {
        float: left;
      }
      i {
        padding: 0;
        width: rem(30);
        height: rem(30);
        line-height: rem(30);
      }

      .submit-btn {
        float: right;
        margin: 0 !important;
        border-radius: rem(0);
        min-width: rem(80);
      }
    }

    .editor-upload {
      display: inline-block;
    }
  }
</style>
