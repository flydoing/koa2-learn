<template>
  <page title="添加焦点图"
        @submit="handleSubmit"
        hasSubmit
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
    <div class="banner-edit">
      <img v-if="banner.logo"
           v-lazy="{src:logo}" />
      <div class="category-title text">描述</div>
      <TextInput placeholder="输入内容"
                 v-model="banner.description" />
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        banner: {
          logo: '',
          description: ''
        },
        loading: false
      }
    },
    created() {},
    computed: {
      logo() {
        return this.banner.logo ? this.url(this.banner.logo) : ''
      }
    },
    methods: {
      uploadSuccess(res, file, fileLlist) {
        this.banner.logo = res.file.id
        this.loading = false
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
      },
      handleSubmit() {
        let postData = {
          groupId: this.currentGroup.groupId,
          banner: {
            userId: this.currentGroup.id,
            metaType: 'm_protal_index_banner',
            obj: this.banner.logo,
            extension: this.banner.description
          }
        }
        Api.commitBanner(postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banner-edit {
    img {
      display: block;
      min-width: 90%;
      margin: rem(10) auto;
      max-width: 90%;
    }
    textarea {
      height: rem(150);
    }
  }
</style>
