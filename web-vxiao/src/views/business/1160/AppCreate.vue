<template>
  <page title="新建教师风采"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="teacher-mien-create">
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">上传风采形象</div>
          <div slot="remark">
            <img class="avatar"
                 v-lazy="{src:logo}"
                 alt='LOGO' />
          </div>
        </item>
      </el-upload>
      <item @click="handleMember">
        <div slot="main">教师</div>
        <div slot="remark"
             v-html="userTxt"></div>
      </item>
      <item @click="handlePost">
        <div slot="main">职务</div>
        <div slot="remark"
             v-html="postTxt"
             class="ellipsis"></div>
      </item>
      <item v-if="form.user"
            @click="handleRange">
        <div slot="main">班牌显示</div>
        <div slot="remark"
             v-html="rangeTxt"
             class="ellipsis"></div>
      </item>
      <item :hasClick="false"
            class="full-input">
        <input placeholder="荣誉介绍（限20字）"
               v-model="form.description" />
      </item>
      <TextInput placeholder="介绍内容（200字以内）"
                 v-model="form.content"></TextInput>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          content: '',
          avatar: null,
          description: '',
          user: null,
          posts: [],
          ranges: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        mien: 'getTeacherMien'
      }),
      logo() {
        return this.form.avatar ? this.url(this.form.avatar.id) : ''
      },
      userTxt() {
        return this.form.user ? this.form.user.name : ''
      },
      postTxt() {
        let posts = this.form.posts
        return posts.length > 0
          ? posts
              .map(v => {
                return v.name
              })
              .join('、')
          : ''
      },
      rangeTxt() {
        if (Check.isRealArray(this.form.ranges)) {
          let rs = this.form.ranges.map(v => {
            return v.type !== '3'
          })
          return `${rs.length}个群组`
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setTeacherMien', 'deleteTeacherMienProp']),
      fetchData() {
        const that = this
        if (that.mien.form) {
          that.form = { ...that.mien.form }
          if (that.mien.user) {
            that.form.user = that.mien.user
            that.deleteTeacherMienProp('user')
            GroupApi.getPlacesBySchooId({
              schoolId: that.currentGroup.parentId,
              userId: that.form.user.userId,
              level: 1
            }).then(res => {
              if (res.places) {
                that.form.ranges = res.places.filter(v => {
                  return v.isGroupUser === '1'
                })
              }
            })
          }
          if (Check.isRealArray(that.mien.posts)) {
            that.form.posts = that.mien.posts
          }
          if (that.mien.ranges) {
            that.form.ranges = that.mien.ranges
          }
          that.deleteTeacherMienProp('ranges')
        }
      },
      uploadSuccess(res, file, fileLlist) {
        this.form.avatar = res.file
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 1
        if (!limit1M) {
          this.$message({ message: '上传风采形象图片大小不能超过 1MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
      },
      handleMember(item) {
        this.setTeacherMien({ form: this.form, user: this.form.user })
        this.routePush({ name: 'selectMember1160' })
      },
      handlePost() {
        this.setTeacherMien({ form: this.form, posts: this.form.posts })
        this.routePush({ name: 'selectPost1160' })
      },
      handleRange() {
        this.setTeacherMien({ form: this.form, ranges: this.form.ranges })
        this.routePush({ name: 'selectRange1160' })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(form.avatar)) {
          that.$message({ message: '风采形象不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.posts)) {
          that.$message({ message: '请选择职务', type: 'warning' })
          return false
        }

        if (!form.user) {
          that.$message({ message: '请选择老师', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.description)) {
          that.$message({ message: '荣誉介绍简介不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.content)) {
          that.$message({ message: '介绍内容不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.ranges)) {
          that.$message({ message: '班牌展示不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1161',
          content: form.content,
          title: form.description,
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify({
            categorys: form.posts.map(v => {
              return { id: v.id, name: v.name }
            })
          }),
          medias: [
            {
              type: 'photo',
              fileId: form.avatar.id,
              fileName: form.avatar.name,
              size: form.avatar.size,
              extension: form.avatar.extension,
              remark: form.avatar.remark,
              status: 1
            }
          ],
          extensionType: form.user.name,
          userId: form.user.userId,
          toUsers: form.ranges.map(v => {
            return {
              userId: v.id,
              name: v.name,
              userType: 'place'
            }
          })
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setTeacherMien({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .teacher-mien-create {
    .el-upload {
      display: block !important;
    }

    textarea {
      height: rem(150);
    }
  }
</style>
