<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false"
        v-loading="loading">
    <div class="dimension-edit">
      <item :hasClick="false">
        <div slot="main">维度名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="dimension.name" />
      </item>
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">图标</div>
          <img slot="remark"
               class="avatar"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </item>
      </el-upload>
      <div v-if="dimension.id"
           class="button button-common"
           @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        dimension: {
          name: '',
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
        teacherDate: 'getTeacherDate'
      }),
      title() {
        return this.dimension.id ? '编辑维度' : '新建维度'
      },
      logo() {
        return this.dimension.logo ? this.url(this.dimension.logo) : ''
      }
    },
    methods: {
      ...mapActions(['setTeacherDate']),
      fectchData() {
        let that = this
        if (that.teacherDate.cache) {
          that.dimension = { ...that.teacherDate.cache }
        }
      },
      uploadSuccess(res, file, fileLlist) {
        this.dimension.logo = res.file.id
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
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该维度？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitMedalData({
              category: {
                id: that.dimension.id,
                groupId: that.currentGroup.groupId,
                status: 'd'
              }
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this

        let dim = that.dimension
        if (Check.isNullString(dim.name)) {
          that.$message({ message: '维度名称不能为空', type: 'warning' })
          return false
        }

        let category = {
          groupId: that.currentGroup.groupId,
          name: dim.name,
          type: '200'
        }
        dim.logo && (category.logo = dim.logo)
        dim.id && (category.id = dim.id)

        Api.commitMedalData({ category: category })
          .then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
          .catch(res => {
            this.$message({ type: 'warning', message: '添加失败le！' })
          })
      }
    }
  }
</script>
<style lang="scss">
  .dimension-edit {
    .el-upload {
      display: block !important;
    }
  }
</style>
