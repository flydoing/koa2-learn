<template>
  <el-upload ref="_upload"
             :show-file-list="false"
             :action="uploadURL"
             :on-success="onSuccess"
             :on-progress="onProgress"
             :before-upload="onBefore">
    <slot></slot>
    <div class="vx-upload-progress"
         :style="prefixProgress"></div>
  </el-upload>
</template>
<script>
  export default {
    props: {
      size: { type: Number, default: 5 }
    },
    data() {
      return {
        progress: 0
      }
    },
    computed: {
      prefixProgress() {
        return { width: `${this.progress}%` }
      }
    },
    methods: {
      onBefore(file) {
        const isJPG = ['image/jpg', 'image/jpeg', 'image/png', 'image/pjpeg', 'image/gif', 'image/bmp', 'image/x-png'].includes(file.type)
        const isLt = file.size / 1024 / 1024 < this.size
        if (!isJPG) {
          this.$message.error('上传头像只能是 JPG、PNG、GIF 格式！')
        }
        if (!isLt) {
          this.$message.error(`上传头像图片大小不能超过 ${this.size}MB！`)
        }
        return isJPG && isLt
      },
      onProgress(e, file, fileList) {
        this.progress = e.percent
      },
      onSuccess(res, file) {
        this.progress = 0
        this.$emit('success', res.file, file)
      }
    }
  }
</script>
<style lang="scss">
  .el-upload {
    display: block;
    width: 100%;
    position: relative;
  }

  .vx-upload-progress {
    height: rem(2);
    bottom: rem(1);
    position: absolute;
    @include bc;
  }
</style>
