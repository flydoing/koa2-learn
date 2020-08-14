<template>
  <Page :title="title"
        :loading="loading"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="handleBack"
        closePrompt>
    <item :hasClick="false"
          label="名称">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <item label="时间"
          :remark="timeTxt"
          @click="handleTime">
    </item>
    <item :hasClick="false"
          label="播放次数">
      <input slot="remark"
             placeholder="必填"
             v-model="form.count" />
    </item>
    <item label="启用">
      <div slot="after">
        <i-switch :value="isEnabled"
                  @click="handleEnable"></i-switch>
      </div>
    </item>
    <item label="广播范围"
          :remark="rangeTxt"
          @click="handleRange">
    </item>
    <el-upload class="upload-item"
               :action="uploadURL"
               accept=".mp4,.mp3,.wma,.wav"
               :show-file-list="false"
               :on-success="uploadSuccess"
               :before-upload="beforeUpload">
      <item label="音频"
            :remark="audioTxt">
      </item>
    </el-upload>
    <div class="button button-common"
         v-if="form.id"
         @click="handleRemove">删除</div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          time: null,
          count: '',
          enable: '1',
          range: null,
          audio: null
        },
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.form.id ? '编辑' : '新增'
      },
      timeTxt() {
        let time = this.form.time || {}
        return time.description || ''
      },
      isEnabled() {
        return this.form.enable === '1'
      },
      rangeTxt() {
        let range = this.form.range
        if (range) {
          return range.type === '1' ? '全校' : `${range.datas.length}个场所`
        }
        return ''
      },
      audioTxt() {
        let audio = this.form.audio || {}
        return audio.fileName || ''
      }
    },
    created() {
      if (this.obj.form) {
        this.form = JSON.parse(JSON.stringify(this.obj.form))
        if (this.obj.time) {
          this.form.time = this.obj.time
          this.modifyCreateObjectField('time')
        }
        if (!Check.isNullObject(this.obj.range)) {
          this.form.range = this.obj.range
        } else {
          this.form.range = null
        }
        this.modifyCreateObjectField('time')
        this.modifyCreateObjectField('form')
      } else if (this.obj.periodic) {
        let periodic = this.obj.periodic
        this.form = {
          ...periodic,
          time: {
            start: periodic.dayStartTime,
            end: periodic.dayEndTime,
            days: periodic.days,
            description: periodic.description
          },
          range: {
            type: periodic.rangeType,
            datas: periodic.ranges
          },
          audio: periodic.medias[0],
          enable: periodic.status === '1' ? '1' : '0'
        }
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      uploadSuccess(res, file, fileLlist) {
        this.form.audio = {
          fileId: file.id,
          fileName: file.name,
          size: file.size,
          type: 'audio',
          status: '1'
        }
        this.loading = false
      },
      beforeUpload(file) {
        const isLt = file.size / 1024 / 1024 < 8
        if (!isLt) {
          this.$message.warning(`上传文件大小不能超过8MB！`)
          return false
        }
        this.loading = true
      },
      handleTime() {
        this.setCreateObject({ form: this.form, time: this.form.time })
        this.routePush({ name: 'selectTime1228' })
      },
      handleEnable() {
        let value = this.form.enable
        this.form.enable = value === '1' ? '0' : '1'
      },
      handleRange() {
        this.setCreateObject({ form: this.form, range: this.form.range })
        this.routePush({ name: 'selectRange1228' })
      },
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.name)) {
          this.$message({ message: '请输入名称', type: 'warning' })
          return false
        }
        if (!form.time) {
          this.$message({ message: '请设置时间', type: 'warning' })
          return false
        }
        if (!/^\d+$/.test(form.count)) {
          this.$message({ message: '请输入播放次数', type: 'warning' })
          return false
        }
        if (!form.range) {
          this.$message({ message: '请选择广播范围', type: 'warning' })
          return false
        }
        if (!form.audio) {
          this.$message({ message: '请上传音频文件', type: 'warning' })
          return false
        }
        let postData = {
          id: form.id || void 0,
          groupId: this.groupId,
          type: 'week',
          days: form.time.days,
          dayStartTime: form.time.start,
          dayEndTime: form.time.end,
          rangeType: form.range.type,
          ranges: form.range.datas,
          name: form.name,
          count: form.count,
          status: this.isEnabled ? '1' : '2',
          medias: [form.audio]
        }

        if (postData.id) {
          Api.modifyPeriodic({ broadcast: postData }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        } else {
          Api.addPeriodic({ broadcast: postData }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        }
      },
      handleRemove() {
        this.$confirm('确认删除该周期广播', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.removePeriodic({
            broadcast: { id: this.form.id }
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
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
  .upload-item {
    .el-upload {
      display: block !important;
    }
  }
</style>
