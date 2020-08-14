<template>
  <page title="新建招生"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="recruit-create">
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <el-upload :action="uploadURL"
                 :data="{'cover':1}"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item id="_cover"
              label="封面">
          <img slot="remark"
               class="a-img"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </item>
      </el-upload>
      <item :hasClick="false"
            label="报名开始">
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="必填"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false"
            label="报名结束">
        <div slot="after">
          <el-date-picker v-model="form.endTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="必填"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item label="人数上限"
            :hasClick="false">
        <input slot="remark"
               placeholder="不限"
               v-model="form.up" />
      </item>
      <item label="招生方案"
            :remark="caseTxt"
            @click="handleCase">
      </item>
      <item v-if="hasAspiration"
            :hasClick="false"
            label="志愿填报截止">
        <div slot="after">
          <el-date-picker v-model="form.vEndTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="必填"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item label="介绍内容"
            :remark="contentTxt"
            @click="handleContent">
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          title: '',
          case: null,
          cover: null,
          up: '',
          startTime: '',
          endTime: '',
          vEndTime: '',
          editor: null
        },
        maxHeight: 0,
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">',
        loading: null,
        columns: [],
        showColumn: false,
        message: null
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      logo() {
        let cover = this.form.cover
        return cover ? this.url(cover.fileId || cover.id) : ''
      },
      caseTxt() {
        let _case = this.form.case || {}
        return _case.title || '必填'
      },
      hasAspiration() {
        let _case = this.form.case || {}
        return _case.hasAspiration === '1'
      },
      contentTxt() {
        let editor = this.form.editor
        return editor ? '已填' : '必填'
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.form) {
          this.form = JSON.parse(JSON.stringify(this.obj.form))
          if (this.obj.case) {
            this.form.case = this.obj.case
            this.modifyCreateObjectField('case')
          }
          if (this.obj.editor) {
            this.form.editor = this.obj.editor
            this.modifyCreateObjectField('editor')
          }
          this.modifyCreateObjectField('form')
        }
      },
      handleCase() {
        this.setCreateObject({ form: this.form })
        this.routePush({
          path: '/vx/group/business/1300/selectCase'
        })
      },
      handleContent() {
        this.setCreateObject({ form: this.form, editor: this.form.editor })
        this.routePush({
          path: '/vx/group/business/1300/contentEdit'
        })
      },
      uploadSuccess(res, file, fileLlist) {
        this.form.cover = res.file
        this.loading.close()
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 5
        if (!limit1M) {
          this.$message({ message: '上传头像图片大小不能超过 5MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = this.$loading({ target: '#_cover' })
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.startTime)) {
          that.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.startTime)) {
          that.$message({ message: '结束时间不能为空', type: 'warning' })
          return false
        }
        if (new Date(form.startTime).getTime() > new Date(form.endTime).getTime()) {
          that.$message({ message: '开始时间不能大于结束时间', type: 'warning' })
          return false
        }
        if (!form.cover) {
          that.$message({ message: '封面不能为空', type: 'warning' })
          return false
        }
        if (!form.case) {
          that.$message({ message: '招生方案不能为空', type: 'warning' })
          return false
        }
        if (!form.editor) {
          that.$message({ message: '招生内容不能为空', type: 'warning' })
          return false
        }
        if (this.hasAspiration && Check.isNullString(form.vEndTime)) {
          that.$message({ message: '志愿填报截止时间不能为空', type: 'warning' })
          return false
        }

        let medias = []
        let cover = form.cover
        medias.push({
          type: 'photo',
          fileName: cover.name || cover.fileName,
          fileId: cover.fileId || cover.id,
          size: cover.size,
          remark: cover.remark,
          status: '2'
        })

        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1300',
          title: form.title,
          groupId: that.groupId,
          content: `${that.style}${form.editor.content}</div></body></html>`,
          medias: [...medias, ...(form.editor.medias || [])],
          msgJson: JSON.stringify({
            formId: form.case.id,
            recruitLimit: form.up,
            aspirationEndTime: form.vEndTime ? DateUtils.format_0800(form.vEndTime) : ''
          }),
          times: [{ type: 'start', setTime: DateUtils.format_0800(form.startTime) }, { type: 'end', setTime: DateUtils.format_0800(form.endTime) }]
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
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .recruit-create {
    .el-upload {
      display: block !important;
    }

    .a-img {
      height: rem(50);
      margin: rem(5) 0 rem(5) rem(5);
    }
  }
</style>
