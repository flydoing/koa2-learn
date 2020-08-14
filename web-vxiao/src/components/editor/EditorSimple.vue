<template>
  <div class="quill-editor _editor-simple"
       :id="id"
       :class="{'no-content': hideEditor,'borderActive':toolbars.length === 0}">
    <div ref="_editor"></div>
    <div class="media-body">
      <div class="image-list"
           v-if="images.length > 0">
        <div class="image-block"
             :data-progress="image.percentage"
             v-for="(image,i) in images"
             :key="i">
          <img v-lazy="{src:url(image.fileId),error:'/static/ico_im_empty.png'}" />
          <i class="ico ico-delete"
             @click="removeMedia(image)" />
          <div class="progress"
               v-if="image.percentage"
               :data-progress="image.percentage"></div>
        </div>
      </div>
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
    <div id="toolbar"
         class="custom-toolbars"
         v-if="toolbars.length>0 || $slots.toolbar">
      <div class="custom-toolbar">
        <el-upload ref="_imageUpload"
                   v-if="toolbars.includes('photo')"
                   class="editor-upload"
                   :action="uploadURL"
                   :data="uploadData"
                   :limit="9"
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
        <i class="ico ico-at"
           v-if="toolbars.includes('at')"
           @click="handleAt" />
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
        <i class="ico ico-topic"
           v-if="toolbars.includes('topic')"
           @click="handleTopic" />
        <slot name="toolbar"></slot>
      </div>
      <button type="button"
              class="ql-image"
              title="图片上传"></button>
      <div class="submit-btn button"
           v-if="toolbars.includes('submit')"
           @click="submit">发布</div>
      <div class="submit-btn"
           v-if="toolbars.includes('open')">
        <el-dropdown trigger="click"
                     placement="bottom"
                     @command="handleChange">
          <div>
            <i class="ico ico-range" />&nbsp;<span v-html="openTxt"
                  class="public_btn"></span>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item v-for="(op,i) in operates"
                              :key="i"
                              :command="op">
              <div>{{op.name}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <slot name="toolbar-button"></slot>
    </div>
  </div>
</template>
<script>
  import 'quill/dist/quill.snow.css'
  import Str from '@/utils/string'
  import Quill from 'quill'
  import EmojiBlot from './emoji/EmojiBlot'
  import TopicBlot from './topic/TopicBlot'
  import AtBlot from './at/AtBlot'
  import Check from '@/utils/check'
  import M from './mixin'

  Quill.register({
    'formats/emoji': EmojiBlot,
    'formats/topic': TopicBlot,
    'formats/at': AtBlot
  })

  export default {
    mixins: [M],
    components: {
      Emoji: resolve => require(['@/views/components/Emoji'], resolve)
    },
    props: {
      value: String,
      store: { type: Object },
      toolbars: {
        type: Array,
        default: () => {
          return ['photo', 'file', 'at', 'emoji', 'topic', 'submit', 'open']
        }
      },
      noContent: { type: Boolean, default: false },
      id: { type: String, default: `editor_${Str.uuid()}` },
      multiple: { type: Boolean, default: true },
      uploadData: {
        type: Object,
        default() {
          return {}
        }
      },
      placeholder: { type: String, default: '请输入内容' }
    },
    data() {
      return {
        showEmoji: false,
        hideEditor: this.noContent,
        operates: [
          {
            name: '公开',
            value: '0',
            type: '1'
          },
          {
            name: '私密',
            value: '1',
            type: '1'
          },
          {
            name: '部分人可见',
            value: '1',
            type: '2'
          }
        ]
      }
    },
    computed: {
      files() {
        return this.medias.filter(media => {
          return media.type !== 'photo'
        })
      },
      images() {
        return this.medias.filter(media => {
          return media.type === 'photo'
        })
      },
      openTxt() {
        // isPrivate === '1' 是私密 === 0 为公开
        // 计算函数判断isPrivate === '1'
        let isPrivate = this.store.isPrivate
        let toUsers = this.store.toUsers
        if (isPrivate === '1' && Check.isRealArray(toUsers)) {
          return `部分人可见（${toUsers.length}人）`
        }
        return isPrivate === '1' ? '私密' : '公开'
      }
    },
    methods: {
      handleChange(op) {
        if (op.type === '2') {
          this.setStorage('_cache_user_select_type', 'part')
          this.routePushModel({
            path: '/vx/group/user/select'
          })
        } else {
          this.$emit('update:store', {
            ...this.store,
            isPrivate: op.value
          })
        }
      }
    },
    activated() {
      this.initialize()
      let type = this.getStorage('_cache_user_select_type')
      let cacheUsers = this.getStorage('_cache_user_select')
      let cacheTopic = this.getStorage('_cache_topic_select')
      if (!Check.isNullString(cacheTopic)) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(
          range.index,
          'topic',
          {
            text: cacheTopic,
            data: cacheTopic
          },
          Quill.sources.USER
        )
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
      }
      if (type && Check.isRealArray(cacheUsers)) {
        // 重新返回一个新的对象
        let toUsers = cacheUsers.map(v => {
          return {
            name: v.name,
            type: 'cc',
            userId: v.userId,
            status: '1',
            userType: v.userType,
            avatar: v.avatar
          }
        })
        this.$emit('update:store', {
          ...this.store,
          toUsers: toUsers,
          isPrivate: '1'
        })
      } else if (Check.isRealArray(cacheUsers)) {
        cacheUsers.some(u => {
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
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    watch: {
      store(val) {
        this.medias = val.medias || []
        if (!this.quill.hasFocus()) {
          this.quill.deleteText(0, this.quill.getLength(), 'api')
          let content = this.converContent(val.content)
          this.quill.pasteHTML(0, content)
        }
      },
      'store.content'(val) {
        if (!this.quill.hasFocus() && val) {
          this.quill.deleteText(0, this.quill.getLength(), 'api')
          let content = this.converContent(val.content)
          this.quill.pasteHTML(0, content)
        }
      },
      noContent(val) {
        this.hideEditor = val
      }
    }
  }
</script>
<style lang="scss">
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
    .image {
      &-block {
        position: relative;
        display: inline-block;
        margin-right: rem(10);
        .progress {
          text-align: center;
          line-height: rem(80);
        }
        img {
          width: rem(100);
          height: rem(80);
        }
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
          position: static;
          vertical-align: middle;
        }
      }
    }
    .ico {
      position: absolute;
      right: rem(0);
      top: rem(0);
    }
  }

  ._editor-simple {
    &.no-content {
      .ql-editor {
        display: none;
      }
    }
    &.borderActive {
      border-bottom: 1px solid #cccccc75;
    }
    .ql-editor {
      max-height: rem(300);
      min-height: rem(90) !important;
      padding: 0 !important;
      font-size: rem(14) !important;
      img {
        display: inline-block;
      }
    }

    .ql-container.ql-snow {
      padding: rem(8) rem(20);
      border: none !important;
    }
    #toolbar:after {
      content: '';
      display: table;
      clear: both;
    }
    .custom-toolbars {
      border: none !important;
      padding: rem(0) !important;
      padding-left: nth($padding, 6) !important;
      padding-right: nth($padding, 1) !important;
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

      span.btn {
        display: inline-block;
        padding: 0 rem(5);
        text-align: center;
        line-height: rem(20);
        height: rem(20);
        border: rem(1) solid #ebebeb;
        border-radius: rem(5);
        background: #fafafa;
        color: #7d7d7d;
        margin-left: rem(5);
        cursor: pointer;
        margin-top: rem(5);
      }

      .submit-btn {
        float: right;
        margin: 0 !important;
        border-radius: rem(0);
        position: relative;
      }
      .submit-btn:after {
        content: '';
        display: table;
        clear: both;
      }
      .ql-image {
        display: none;
      }
    }

    .editor-upload {
      display: inline-block;
    }
  }
  .public_btn {
    cursor: pointer;
    font-size: rem(12);
  }
</style>
