<template>
  <Page title="发货"
        :loading="loading"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false"
          label="发货时间">
      <div slot="after">
        <el-date-picker v-model="date"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <item :hasClick="false"
          class="full-input">
      <input placeholder="物流公司与单号"
             v-model="number" />
    </item>
    <el-upload class="upload-item"
               :action="uploadURL"
               :show-file-list="false"
               :data="{'cover':1}"
               accept="image/png, image/jpeg,.gif"
               :on-success="uploadSuccess"
               :before-upload="beforeUpload">
      <item label="物流单照片">
        <img slot="remark"
             class="logistics-pic"
             v-lazy="{src:logo}"
             alt='LOGO' />
      </item>
    </el-upload>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="备注"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import Media from '@/constant/media'
  import FileUtils from '@/utils/file'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        date: '',
        number: '',
        file: null,
        loading: false
      }
    },
    computed: {
      logo() {
        return this.file ? this.url(this.file.fileId) : ''
      }
    },
    created() {},
    methods: {
      uploadSuccess(res, file, fileLlist) {
        let f = res.file
        this.file = {
          fileName: f.name,
          status: '1',
          extension: f.extension,
          size: f.size,
          fileId: f.id,
          type: FileUtils.getType(f.name) || Media.FILE,
          remark: f.remark || void 0
        }
        this.loading = false
      },
      beforeUpload(file) {
        const isLt = file.size / 1024 / 1024 < 1
        if (!isLt) {
          this.$message.warning(`上传文件大小不能超过1MB！`)
          return false
        }
        this.loading = true
      },
      handleSubmit() {
        const that = this
        let editor = this.editorMessage
        if (Check.isNullString(this.date)) {
          that.$message({ message: '发货日期不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.number)) {
          that.$message({ message: '物流公司与单号不能为空', type: 'warning' })
          return false
        }
        if (!this.file) {
          that.$message({ message: '物流单照片不能为空', type: 'warning' })
          return false
        }

        let postData = {
          id: this.routeQuery('msgId'),
          status: '8',
          msgJson: JSON.stringify({
            delivery: {
              logisticsCode: this.number,
              deliveryDate: DateUtils.format_0800(this.date),
              remark: editor.content
            }
          }),
          type: '1104',
          toUsers: [
            {
              userId: this.userId,
              type: 'executor'
            }
          ],
          medias: [this.file, ...(editor.medias || [])]
        }

        that.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .upload-item {
    .el-upload {
      display: block !important;
    }
  }
  .logistics-pic {
    width: rem(80);
    height: rem(50);
    margin: rem(5) rem(5) rem(5) 0;
    background: #ededed;
  }
</style>
