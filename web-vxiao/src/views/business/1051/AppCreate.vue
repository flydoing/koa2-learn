<template>
  <page title="新建"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="vscreen-create">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleType">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">类型</div>
            <div slot="remark"
                 v-html="typeTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in types"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item v-if="isSchool"
            @click="handleRange">
        <div slot="main">发布范围</div>
        <div slot="remark"
             v-html="rangeTxt"
             class="ellipsis"></div>
      </item>
      <item class="n-time"
            :hasClick="false">
        <div slot="main">展示开始</div>
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          :placeholder="sPlaceholder"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item class="n-time"
            :hasClick="false">
        <div slot="main">展示结束</div>
        <div slot="after">
          <el-date-picker v-model="form.endTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          :placeholder="ePlaceholder"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item v-if="form.type&&form.type.value === '2'"
            @click="handleTemplate">
        <div slot="main">模板</div>
        <div slot="remark"
             v-html="tmpTxt"></div>
      </item>
      <item v-if="form.type&&form.type.value === '4'"
            :hasClick="false"
            class="full-input">
        <input placeholder="署名（必填）"
               v-model="form.name" />
      </item>
      <keep-alive>
        <EditorSimple :noContent.sync="noContent"
                      :store.sync="form"
                      :toolbars="toolbars"
                      :uploadData="{'cover': 1}" />
      </keep-alive>
      <div v-if="form.type&&(form.type.value === '1'||form.type.value === '2')"
           class="button button-common"
           @click="handleScanning">预览</div>
    </div>
    <ScanTemplate :show.sync="showTemplate"
                  :image="form.medias[0] ? form.medias[0].fileId : ''"
                  :template="form.template"
                  :content="form.content" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import CategoryApi from '@/api/category'
  import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R, MixinMessage],
    components: {
      ScanTemplate: resolve => require(['./ScanTemplate'], resolve),
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          type: null,
          template: null,
          name: '',
          startTime: '',
          endTime: '',
          content: '',
          medias: []
        },
        types: [],
        showTemplate: false,
        noContent: false
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        vscreen: 'getCreateObject'
      }),
      toolbars() {
        let tp = this.form.type || {}
        if (tp.value === '1') {
          return ['photo']
        } else if (tp.value === '3') {
          return ['file']
        }
        return []
      },
      sPlaceholder() {
        if (!Check.isNullString(this.form.endTime)) {
          return '选择时间'
        }
        return '不限'
      },
      ePlaceholder() {
        if (!Check.isNullString(this.form.startTime)) {
          return '选择时间'
        }
        return '不限'
      },
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      },
      rangeTxt() {
        let places = this.vscreen.places || []
        let classes = []
        if (this.vscreen.classes) {
          classes = this.vscreen.classes.filter(v => {
            return v.type === '2'
          })
        }
        let groups = this.vscreen.groups || []
        let ranges = [...places, ...classes, ...groups]
        return ranges.length > 0
          ? ranges
              .map(v => {
                return v.name
              })
              .join('、')
          : '全部'
      },
      tmpTxt() {
        return this.form.template ? this.form.template.name : ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        if (that.vscreen.form) {
          that.form = { ...that.vscreen.form }
          if (that.vscreen.template) {
            that.form.template = that.vscreen.template
          }
        }

        CategoryApi.getCategorysByType('26').then(res => {
          that.types = res.categorys
          if (!that.form.type) {
            that.form.type = res.categorys[0]
          }
        })
      },
      handleType(item) {
        if (item.value !== '2') {
          this.form.template = null
        }
        if (item.value !== '2' && item.value !== '3') {
          this.form.medias = []
        }
        if (item.value === '3') {
          this.noContent = true
        } else {
          this.noContent = false
        }
        this.form.type = item
      },
      handleRange() {
        this.setCreateObject({ form: this.form })
        this.routePush({ name: 'selectRange1051' })
      },
      handleTemplate(item) {
        if (Check.isNullString(this.form.content)) {
          this.$message({ message: '消息内容不能为空', type: 'warning' })
          return false
        }
        this.setCreateObject({ form: this.form, template: this.form.template, content: this.form.content })
        this.routePush({ name: 'selectTemplate1051' })
      },
      handleScanning() {
        let tp = this.form.type
        if (tp.value === '1') {
          if (!Check.isRealArray(this.form.medias)) {
            this.$message({ message: '请先上传图片', type: 'warning' })
            return false
          }
        } else {
          if (!this.form.template) {
            this.$message({ message: '请选择模板', type: 'warning' })
            return false
          }
          if (Check.isNullString(this.form.content)) {
            this.$message({ message: '消息内容不能为空', type: 'warning' })
            return false
          }
        }

        this.showTemplate = true
      },
      handleSubmit() {
        const that = this
        let form = that.form
        let tp = form.type
        let times = []
        if (!Check.isNullString(form.startTime) || !Check.isNullString(form.endTime)) {
          if (Check.isNullString(form.startTime)) {
            that.$message({ message: '展示开始时间不能为空', type: 'warning' })
            return false
          }

          if (Check.isNullString(form.endTime)) {
            that.$message({ message: '展示结束时间不能为空', type: 'warning' })
            return false
          }

          if (new Date(form.startTime).getTime() > new Date(form.endTime).getTime()) {
            that.$message({ message: '展示开始时间不能大于结束时间', type: 'warning' })
            return false
          }

          times = [
            {
              type: 'start',
              setTime: DateUtils.format_0800(form.startTime)
            },
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.endTime)
            }
          ]
        }

        if (tp.value === '2' && !form.template) {
          that.$message({ message: '请选择模板', type: 'warning' })
          return false
        }

        if (tp.value === '4' && Check.isNullString(form.name)) {
          that.$message({ message: '署名不能为空', type: 'warning' })
          return false
        }

        if (tp.value === '1') {
          if (!Check.isRealArray(form.medias)) {
            that.$message({ message: '请先上传图片', type: 'warning' })
            return false
          }
        } else if (tp.value !== '3') {
          if (Check.isNullString(form.content)) {
            that.$message({ message: '消息内容不能为空', type: 'warning' })
            return false
          }

          if (form.content.length > 120) {
            that.$message({ message: '消息内容不能超120字', type: 'warning' })
            return false
          }
        } else {
          if (!Check.isRealArray(form.medias)) {
            that.$message({ message: '请上传视频', type: 'warning' })
            return false
          }
        }

        let toUsers = []
        if (Check.isRealArray(this.vscreen.places)) {
          this.vscreen.places.some(v => {
            toUsers.push({
              name: v.name,
              type: 'cc',
              userId: v.id,
              userType: 'place'
            })
          })
        }

        if (Check.isRealArray(this.vscreen.classes)) {
          this.vscreen.classes.some(v => {
            if (v.type === '2') {
              toUsers.push({
                name: v.name,
                type: 'cc',
                userId: v.id,
                userType: 'class'
              })
            }
          })
        }
        if (Check.isRealArray(this.vscreen.groups)) {
          this.vscreen.groups.some(v => {
            toUsers.push({
              name: v.name,
              type: 'cc',
              userId: v.id,
              userType: 'group'
            })
          })
        }

        let mJson = {}
        let tmp = form.template
        if (tp.value === '2' && form.template) {
          mJson = {
            backgroundImg: tmp.backgroundImg,
            backgroundColor: tmp.backgroundColor,
            fontColor: tmp.fontColor,
            fontSize: (tmp.size * 960) / 342
          }
        } else if (tp.value === '4' && Check.isNullString(form.name)) {
          mJson = { title: form.name }
        }
        if (that.isSchool) {
          mJson.extension = `发布到：${that.rangeTxt}`
        }
        let postData = that.constructionMessage({
          type: '1051',
          msgType: form.type.value,
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify(mJson),
          content: form.content,
          isPrivate: '0',
          times: times,
          toUsers: toUsers,
          medias: form.medias
        })

        if (Check.isRealArray(times)) {
          postData.times = times
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setCreateObject({})
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setCreateObject({})
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .vscreen-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .n-time input {
      min-width: initial !important;
    }
  }
</style>
