<template>
  <page title="岗位"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false"
        v-loading="loading">
    <div class="add-post">
      <item :hasClick="false">
        <div slot="main">岗位名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="post.name" />
      </item>
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">图片</div>
          <img slot="remark"
               class="ap-img"
               v-lazy="{src:logo}"
               alt='PHOTO' />
        </item>
      </el-upload>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        post: {
          name: '',
          logo: ''
        },
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        handover: 'getHandover'
      }),
      logo() {
        return this.post.logo ? this.url(this.post.logo) : ''
      }
    },
    methods: {
      ...mapActions(['setHandover']),
      uploadSuccess(res, file, fileLlist) {
        this.post.logo = res.file.id
        this.loading = false
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 1
        if (!limit1M) {
          this.$message({ message: '上传头像图片大小不能超过 1MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = true
      },
      handleSubmit() {
        const that = this
        let campus = that.handover.campus
        let post = that.post
        if (Check.isNullString(post.name)) {
          that.$message({ message: '岗位名称不能为空', type: 'warning' })
          return false
        }

        let category = {
          groupId: that.currentGroup.groupId,
          name: post.name,
          type: '114',
          extension: campus.id
        }
        post.logo && (category.logo = post.logo)

        CategoryApi.addCategory([category]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .add-post {
    .el-upload {
      display: block !important;
    }
    .ap-img {
      display: block !important;
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
    }
  }
</style>
