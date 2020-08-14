<template>
  <page title="编辑封面"
        v-loading="loading">
    <div class="column-cover">
      <img v-if="column.logo"
           v-lazy="{src:logo}" />
      <div class="cc-upload">
        <el-upload :action="uploadURL"
                   :show-file-list="false"
                   :on-success="uploadSuccess"
                   :before-upload="beforeUpload">
          <div class="button button-common">上传封面</div>
        </el-upload>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        column: {
          logo: ''
        },
        loading: false
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      }),
      logo() {
        return this.column.logo ? this.url(this.column.logo) : ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fectchData() {
        if (this.active.column) {
          this.column = this.active.column
        }
      },
      uploadSuccess(res, file, fileLlist) {
        const that = this
        let parent = that.active.parent
        let logo = res.file.id
        let postData = {
          category: { id: parent.id, status: '1' },
          subCategory: [
            {
              id: that.column.id,
              groupId: that.currentGroup.groupId,
              parentId: parent.id,
              type: 'portal_menu',
              logo: logo,
              status: '1'
            }
          ]
        }
        Api.commitColumn([postData]).then(res => {
          that.column = { ...that.column, logo: logo }
          that.loading = false
          that.$message({ message: '操作成功', type: 'success' })
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
  .column-cover {
    img {
      display: block;
      margin: rem(10) auto;
      max-width: 90%;
    }
    .cc-upload {
      width: rem(200);
      margin: 0 auto;
    }
  }
</style>
