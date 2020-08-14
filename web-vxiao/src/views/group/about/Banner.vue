<template>
  <Page title="封面设置"
        :loading="loading">
    <div slot="btn">
      <label>
        上传
        <el-upload :action="uploadURL"
                   :show-file-list="false"
                   :on-success="uploadSuccess"
                   :before-upload="beforeUpload"></el-upload>
      </label>
    </div>
    <div class="bannar">
      <img v-for="(banner,i) in banners"
           :key="i"
           :src="url(banner.fileId)" />
    </div>
  </Page>
</template>
<script>
  import R from '../mixin'
  import Api from '@/api/group'
  export default {
    mixins: [R],
    data() {
      return {
        banners: [],
        loading: false
      }
    },
    created() {
      Api.getGroupBannar(this.groupId).then(res => {
        this.banners = res.banners
      })
    },
    methods: {
      uploadSuccess(data, file, fileLlist) {
        Api.addGroup({
          groups: [{ id: this.currentGroup.id, groupId: this.groupId, logo: data.file.id }]
        }).then(res => {
          this.banners.unshift({
            fileId: data.file.id,
            groupId: this.groupId
          })
          this.loading = false
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit5M = file.size / 1024 / 1024 < 5
        if (!limit5M) {
          this.$message({ message: '上传头像图片大小不能超过 5MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bannar {
    width: 100%;
    padding: rem(15);
    img {
      width: 100%;
      height: rem(300);
      cursor: pointer;
      margin-bottom: rem(15);
      &:last-child {
        margin: 0;
      }
      &:hover {
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
