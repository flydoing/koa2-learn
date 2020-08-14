<template>
  <Page title="编辑"
        hasSubmit
        @submit="handleSubmit">
    <div class="category-edit">
      <el-upload :action="uploadURL"
                 :data="{'cover':1}"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item label="图片"
              id="_cover">
          <img slot="remark"
               class="logo-img"
               v-lazy="{src: logo}"
               alt='LOGO' />
        </item>
      </el-upload>
      <item label="名称"
            :remark="form.name"
            :hasClick="false"></item>
      <item label="编号"
            :remark="form.sortNum"
            :hasClick="false"></item>
      <item label="推荐到首页"
            v-if="form.type === '2'">
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        form: {
          name: '',
          sortNum: '',
          icon: '',
          isRecommend: '0',
          type: '1'
        },
        loading: null
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      logo() {
        let icon = this.form.icon
        return icon ? this.url(icon) : ''
      },
      isSwitched() {
        return this.form.isRecommend === '1'
      }
    },
    created() {
      if (this.obj.category) {
        this.form = JSON.parse(JSON.stringify(this.obj.category))
        this.modifyCreateObjectField('category')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      uploadSuccess(res, file, fileLlist) {
        this.$set(this.form, 'icon', res.file.id)
        this.loading.close()
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit2M = file.size / 1024 / 1024 < 2
        if (!limit2M) {
          this.$message({ message: '上传头像图片大小不能超过 2MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = this.$loading({ target: '#_cover' })
      },
      handleSwitch() {
        let value = this.form.isRecommend
        this.$set(this.form, 'isRecommend', value === '1' ? '0' : '1')
      },
      handleSubmit() {
        delete this.form.children
        Api.modifyGoodsTypes({
          mallGoodsType: { ...this.form }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .category-edit {
    .el-upload {
      display: block !important;
    }

    .logo-img {
      height: rem(50);
      margin: rem(5) rem(10) rem(5) rem(5);
    }
  }
</style>
