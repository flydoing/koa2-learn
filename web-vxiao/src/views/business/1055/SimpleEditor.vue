<template>
  <div class="simple-editor"
       :id="id"
       v-loading.lock="loadingBol"
       element-loading-text="上传中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.5)">
    <textarea :placeholder="placeholder"
              :rows="rows"
              :maxlength="maxLength"
              @click="focusTextArea"
              @change="getContent"
              :value="content"
              :disabled="disabledBol"></textarea>
    <div>
      <div class="images-block">
        <div class="image-box"
             :style="bgImage(media)"
             @click.self="handleImage(media,m)"
             v-if="media.type==='photo'"
             v-for="(media, m) in medias"
             :key="m">
          <div class="image-delete"
               @click="deleteClick(m)"></div>
          <div class="loding-box">
            <div class="loading-bar"></div>
          </div>
          <image-view :images="showImgs"
                      :show.sync="showImageViewBox"
                      :index="m"></image-view>
        </div>
      </div>
      <div class="medias-block"
           v-for="(media, m) in medias"
           :key="m"
           v-if="media.type==='file'">
        <a :href="media.href"
           class="file-block f12 has-click"
           target="_blank">
          <div class="image-delete"
               @click="deleteFile(m)"></div>
          <div class="logo">
            <img :src="fileLogo(media)"
                 alt='附件LOGO'>
          </div>
          <div class="title">{{media.fileName}}</div>
          <div class="remark"
               v-text="conputedSize(media.size)"></div>
        </a>
      </div>
    </div>
    <!-- <div class="images-block" v-if="imagesArr.length>0">
      <div class="image-box" v-for="(image, j) in imagesArr" :key="j" :style="bgImage(image)" @click.self="handleImage(image,j)">
        <div class="image-delete" @click="deleteClick(j)"></div>
        <div class="loding-box">
          <div class="loading-bar"></div>
        </div>
        <image-view :images="showImgs" :show.sync="showImageViewBox" :index="j"></image-view>
      </div>
    </div>
    <div class="medias-block" v-if="files.length>0">
      <a :href="file.href" class="file-block f12 has-click" v-for="(file,i) in files" target="_blank" :key="i">
        <div class="image-delete" @click="deleteFile(i)"></div>
        <div class="logo">
          <img :src="fileLogo(file)" alt='附件LOGO'>
        </div>
        <div class="title">{{file.fileName}}</div>
        <div class="remark" v-text="conputedSize(file.size)"></div>
      </a>
    </div> -->
    <div class="custom-toolbars"
         v-if="!disabledBol">
      <!-- <div v-for="(toolbar, i) in tools" :class="toolbar+'-Icon'" class="left" :key="i" @click="clickIcon(toolbar)"></div> -->
      <div class="toolbars-box"
           v-for="(toolIcon, i) in tools"
           :key="i">
        <el-upload :action="uploadURL"
                   v-if="toolIcon === 'pic' || toolIcon === 'file'"
                   multiple
                   :limit="9"
                   :on-success="uploadSuccess"
                   :on-error="handleError"
                   :before-upload="handleBeforeUpload"
                   :on-exceed="handleExceed"
                   :show-file-list="false"
                   :on-change="getMedias">
          <div :class="toolIcon+'-Icon'"></div>
        </el-upload>
        <div v-else
             :class="toolIcon+'-Icon'"
             class="left"
             @click="clickIcon(toolIcon)"></div>
      </div>
    </div>
    <div v-if="!noBottom"
         class="category-title text"></div>
  </div>
</template>
<script>
  import ArrayUtils from '@/utils/array'
  import FileUtils from '@/utils/file'
  export default {
    model: {
      prop: 'content',
      event: 'change'
    },
    props: {
      id: {
        type: String,
        default: 'editor' + new Date().getTime()
      },
      tools: {
        type: Array,
        default() {
          return ['pic', 'file', 'and', 'emoji', 'topic']
        }
      },
      placeholder: {
        type: String,
        default: '内容'
      },
      rows: {
        type: Number,
        default: 5
      },
      maxLength: {
        type: Number,
        default: 450
      },
      content: {
        type: [String, Number],
        default: ''
      },
      medias: {
        type: Array,
        default() {
          return []
        }
      },
      noBottom: {
        type: Boolean,
        default: false
      },
      disabledBol: {
        type: Boolean,
        default: false
      },
      clearImagsBol: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getContent(e) {
        this.$emit('change', e.target.value)
      },
      focusTextArea() {
        this.$emit('focusTextArea')
      },
      handleBeforeUpload(file) {
        this.loadingBol = true
      },
      handleError(file) {
        this.loadingBol = false
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 9 个，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      uploadSuccess(response, file, fileList) {
        this.loadingBol = false
        let f = response.file
        const isPhoto = FileUtils.isPhoto(f.name)
        let obj = {
          ...{
            fileId: f.id,
            fileName: f.name,
            type: isPhoto ? 'photo' : 'file'
          },
          ...f
        }
        delete obj.id
        // isPhoto ? this.imagesArr.push(obj) : this.files.push(obj)
        this.allMedias.push(obj)
      },
      bgImage(image) {
        const url = this.url(image.fileId, 'thumb')
        return {
          'background-image': `url(${url})`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'background-position': 'center'
        }
      },
      deleteClick(j) {
        this.allMedias.splice(j, 1)
        // this.allMedias = [...this.imagesArr, ...this.files]
        this.getMedias()
      },
      deleteFile(i) {
        this.allMedias.splice(i, 1)
        // this.allMedias = [...this.imagesArr, ...this.files]
        this.getMedias()
      },
      getMedias() {
        this.$emit('getMedias', {
          // images: this.imagesArr,
          // files: this.files,
          medias: this.allMedias
        })
      },
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
            file.extension
          )
        ) {
          return this.OtherPNG
        }
        return FileUtils.getFileIcon(file.extension, true)
      },
      conputedSize(size) {
        if (size < 1024) {
          return size + 'Bytes'
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(2) + 'KB'
        } else if (size < 1024 * 1024 * 1024) {
          return (size / (1024 * 1024)).toFixed(2) + 'MB'
        }
      },
      handleImage(img, index) {
        this.showImageViewBox = true
        this.index = index
      },
      clearImgs() {
        this.imagesArr = []
      }
    },
    data() {
      return {
        // imagesArr: [],
        // files: [],
        OtherPNG: FileUtils.getFileIcon('query', true),
        loadingBol: false,
        showImageViewBox: false,
        showImgs: [],
        allMedias: this.medias || []
      }
    },
    watch: {
      imagesArr() {
        let that = this
        that.showImgs = []
        this.imagesArr.length > 0 &&
          this.imagesArr.forEach(v => {
            that.showImgs.push({
              thumb: that.url(v.fileId, 'thumb'),
              url: that.url(v.fileId),
              width: JSON.parse(v.remark).original.width,
              height: JSON.parse(v.remark).original.height,
              type: 'photo',
              ...v
            })
          })
      },
      clearImagsBol(v) {
        this.clearImgs()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '~scss/mixin';
  textarea {
    display: block !important;
    width: 100%;
    padding: rem(10);
    border: none !important;
    font-family: '微软雅黑' !important;
    background: transparent;
  }

  .custom-toolbars {
    background-color: #fafafa;
    @include flex;
    .toolbars-box {
      width: rem(40);
    }
  }

  .images-block {
    @include flex;
    padding: rem(10);
    .image-box {
      position: relative;
      margin-right: rem(20);
      width: rem(60);
      height: rem(60);
      cursor: pointer;
      .image-delete {
        position: absolute;
        width: rem(25);
        height: rem(25);
        right: rem(-8);
        top: rem(-8);
        background: url($icon-url) -86px -75px no-repeat;
      }
    }
  }

  .commin-btn {
    button {
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      @include bch;
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bc;
      }
    }
  }

  .medias-block {
    padding-top: nth($padding, 1);
    .file-block {
      position: relative;
      display: block;
      @include flex;
      line-height: rem(45);
      background: nth($background, 9);
      margin-bottom: nth($padding, 3);
      &:hover {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(225, 225, 225, 0.3);
        }
      }
      .image-delete {
        position: absolute;
        width: rem(25);
        height: rem(25);
        right: 0;
        top: rem(-10);
        cursor: pointer;
        z-index: 50;
        background: url($icon-url) -86px -75px no-repeat;
      }
      .logo {
        flex: 1;
        img {
          display: block;
          width: rem(45);
          height: rem(45);
        }
      }
      .title {
        flex: 29;
        padding-left: nth($padding, 3);
      }
      .remark {
        flex: 1;
        padding-right: nth($padding, 3);
      }
    }
  }
</style>
