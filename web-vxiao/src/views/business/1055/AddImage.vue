<template>
  <page title="上传证件照片">
    <div class="add-image">
      <div class="add-button">
        <el-upload :class="{'upload-box': isWap}"
                   :action="uploadURL"
                   :file-list="cacheFileList"
                   list-type="picture-card"
                   :on-remove="handleRemove"
                   :on-success="handleSuccess"
                   :before-upload="beforeAvatarUpload"
                   :disabled="isCreator">
          <div class="add-btn">+</div>
        </el-upload>
        <div>
          <div class="commin-btn">
            <button @click="SubmitResetInfo">{{btnText}}</button>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/plugin/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'AddImage',
    mixins: [R],
    data() {
      return {
        showImageViewBox: false,
        fileIds: [],
        metaDataIndex: null,
        cacheFileList: [],
        isCreator: this.routeQuery('isCreator'),
        btnText: '',
        showImgs: [],
        showIndex: 0,
        isWap: false
      }
    },
    created() {
      this.metaDataIndex = this.routeQuery('index')
      console.log(this.metaDataIndex, 'this.metaDataIndex')
      if (this.routeQuery('isCreator')) {
        this.isCreator = true
        this.btnText = '返回'
      } else {
        this.btnText = '提交修改信息'
      }
      this.routeQuery('cacheList') &&
        this.routeQuery('cacheList').forEach((c, l) => {
          c.fileId && this.fileIds.push(c)
          c.url &&
            this.cacheFileList.push({
              url: c.url,
              fileId: c.fileId
            })
          this.showImgs.push({
            thumb: this.url(c.fileId, 'thumb'),
            url: this.url(c.fileId),
            width: JSON.parse(c.remark).original.width,
            height: JSON.parse(c.remark).original.height,
            type: 'photo',
            id: c.fileId
          })
        })
      const userAgentInfo = navigator.userAgent
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
      this.isWap = Agents.some(a => {
        return userAgentInfo.indexOf(a) > 0
      })
    },
    methods: {
      ...mapActions(['savePersonalInfo']),
      handleRemove(file, fileList) {
        if (this.isCreator) return false
        this.fileIds.forEach((img, i) => {
          if (img.fileId === file.fileId) {
            this.fileIds.splice(i, 1)
          }
        })
      },
      handleSuccess(response, file, fileList) {
        let img = {}
        img.fileId = response.file.id
        img.remark = response.file.remark
        img.uid = file.uid
        this.fileIds.push(img)
        this.showImgs.push({
          thumb: this.url(img.fileId, 'thumb'),
          url: this.url(img.fileId),
          width: JSON.parse(img.remark).original.width,
          height: JSON.parse(img.remark).original.height,
          type: 'photo',
          id: response.file.id
        })
      },
      SubmitResetInfo() {
        const that = this
        // that.setStorage('pics', {
        //   i: that.metaDataIndex,
        //   imgs: JSON.stringify(that.fileIds)
        // })
        // that.$store.dispatch('saveEnroll', {
        //   key: 'addImages',
        //   value: {
        //     i: that.metaDataIndex,
        //     imgs: JSON.stringify(that.fileIds)
        //   }
        // })
        let infoObj = [...this.personalInfo.enrollTable.metaDatas]
        infoObj[that.metaDataIndex].obj = JSON.stringify(that.fileIds)
        console.log(infoObj, 'infoObj')
        this.savePersonalInfo({
          enrollTable: {
            ...this.personalInfo.enrollTable,
            metaDatas: infoObj
          }
        })
        that.routeBack()
      },
      beforeAvatarUpload(file) {
        const isImag = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isImag) {
          this.$message.error('只能上传jpg/jpeg/png格式的图片！')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB！')
        }
        return isLt2M && isImag
      }
    },
    computed: {
      ...mapGetters({
        personalInfo: 'getPersonalInfo'
      })
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .upload-box {
    @include flex;
    @include jc;
    max-width: rem(375);
    width: 100%;
  }

  .vx-image {
    div {
      border: none !important;
      background: transparent !important;
      img {
        width: 100%;
        @include flex;
        @include ai;
      }
    }
  }

  .add-image {
    padding: rem(10);
    .el-upload-list--picture-card {
      .el-upload-list__item {
        width: rem(180);
        height: rem(180);
      }
    }
    .el-upload {
      display: inline-block !important;
      width: rem(150);
      height: rem(150);
    }
  }

  .add-btn {
    display: inline-block;
    width: rem(150);
    height: rem(150);
    text-align: center;
    line-height: rem(150);
    font-size: rem(30);
  }

  .picture-cards {
    @include flex;
    div {
      width: rem(150);
      height: rem(150);
    }
  }

  .commin-btn {
    @include flex;
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
</style>
