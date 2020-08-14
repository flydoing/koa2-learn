<template>
  <page title="新建投票"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <label slot="btn"
           @click="handleSaveDraft">存草稿</label>
    <div class="category-title template"
         @click="handleMsgTemplate"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div class="questionaire-create">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleType">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">投票人是否可见结果</div>
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
      <item @click="handleRange">
        <div slot="main">投票范围</div>
        <div slot="remark"
             class="ellipsis"
             v-html="rangeTxt"></div>
      </item>
      <item class="q-time"
            :hasClick="false">
        <div slot="main">截止时间</div>
        <div slot="after">
          <el-date-picker v-model="form.deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item v-if="!isSchool">
        <div slot="main">匿名投票</div>
        <div slot="after">
          <i-switch :value="isAnonymous"
                    @click="handleAnonymous"></i-switch>
        </div>
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleCount">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">每人投票上限</div>
            <div slot="remark"
                 v-html="form.limit"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(count,i) in counts"
                            :key="i"
                            :command="count">{{count}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <keep-alive>
        <EditorSimple placeholder="投票内容"
                      :store.sync="editorMessage"
                      :toolbars="['photo', 'file']" />
      </keep-alive>
      <div v-for="(item,i) in form.options"
           :key="i">
        <div class="category-title"></div>
        <keep-alive>
          <EditorSimple placeholder="选项内容"
                        :store.sync="form.options[i]"
                        :toolbars="['photo', 'file']" />
        </keep-alive>
      </div>
      <item @click="handleAddOption"
            v:hasArrow="false">
        <div slot="before">
          <i class='ico ico-plus'></i>
        </div>
        <div slot="main">添加选项</div>
      </item>
    </div>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import MessageApi from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          type: null,
          deadline: '',
          ranges: [],
          anonymous: '1',
          limit: 1,
          options: [{}, {}, {}]
        },
        types: [],
        counts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        count: ''
      }
    },
    created() {
      this.getTemplatesCount()
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        vote: 'getCreateObject'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      },
      isAnonymous() {
        return this.form.anonymous === '1'
      },
      rangeTxt() {
        let ranges = this.form.ranges
        if (Check.isRealArray(ranges)) {
          return ranges
            .map(v => {
              return v.name
            })
            .join('、')
        }
        return '全体成员'
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1007').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        const that = this
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          let json = JSON.parse(msgTmp.msgJson)
          let ext = JSON.parse(msgTmp.extensionType)
          let opts = ext.questions.options
          if (opts.length < 3) {
            for (let i = 0; i < 3 - opts.length; i++) {
              opts.push({})
            }
          }
          this.form = {
            deadline: DateUtils.format(ext.expirationDate, DateUtils.YMD_HM),
            ranges: [],
            anonymous: ext.anonymous === '1' ? '0' : '1',
            limit: json.maxValue,
            type: json.isAnonymousObj || null,
            options: opts
          }
          this.editorMessage = {
            content: msgTmp.content,
            medias: msgTmp.medias
          }
          that.modifyCreateObjectField('form')
        } else if (that.vote.form) {
          that.form = JSON.parse(JSON.stringify(that.vote.form))
          if (that.vote.ranges) {
            that.form.ranges = that.vote.ranges
            that.modifyCreateObjectField('ranges')
          }
          that.modifyCreateObjectField('form')
        }

        CategoryApi.getCategorys({
          type: '109',
          groupId: that.groupId
        }).then(res => {
          that.types = res.categorys
          if (!that.form.type) {
            that.form.type = that.types[0]
          }
        })
      },
      handleType(item) {
        this.form.type = item
      },
      handleRange() {
        this.setCreateObject({ form: this.form, ranges: this.form.ranges })
        if (this.isSchool) {
          this.routePush({ name: 'selectGroup1007' })
        } else {
          this.routePush({ name: 'selectMember1007' })
        }
      },
      handleAnonymous() {
        let ams = this.form.anonymous
        this.form.anonymous = ams === '1' ? '0' : '1'
      },
      handleCount(count) {
        this.form.limit = count
      },
      handleAddOption() {
        this.form.options.push({})
      },
      getMessageData(users, opts) {
        const that = this

        let form = that.form
        let message = that.constructionMessage({
          type: '1007',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            isDisplay: form.type.value,
            maxValue: form.limit,
            isAnonymousObj: {
              id: form.type.id,
              name: form.type.name,
              value: form.type.value
            }
          }),
          toUsers: users || [],
          extensionType: JSON.stringify({
            questions: {
              title: this.editorMessage.content,
              options: opts || []
            },
            expirationDate: form.deadline ? DateUtils.format_0800(form.deadline) : '',
            anonymous: form.anonymous === '1' ? '0' : '1'
          }),
          medias: this.editorMessage.medias
        })

        return message
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '投票内容不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        let opts = form.options.filter(v => {
          return !Check.isNullString(v.content) || Check.isRealArray(v.medias)
        })
        if (!Check.isRealArray(opts) || opts.length < 2) {
          that.$message({ message: '不能少于两个选项', type: 'warning' })
          return false
        }

        let users = []
        if (that.isSchool && Check.isRealArray(form.ranges)) {
          form.ranges.map(v => {
            users.push({
              userId: v.id,
              name: v.name,
              userType: v.type === '1' ? 'group' : 'class',
              type: 'cc',
              groupId: v.groupId
            })
          })
        } else if (Check.isRealArray(form.ranges)) {
          form.ranges.map(v => {
            users.push({
              userId: v.userId,
              name: v.name,
              userType: v.userType,
              type: 'cc',
              groupId: v.groupId
            })
          })
        }

        that.addMessage(that.getMessageData(users, opts)).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.modifyCreateObjectField('form')
          this.routeBack()
        })
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '投票内容不能为空', type: 'warning' })
          return false
        }

        let opts = form.options.filter(v => {
          return !Check.isNullString(v.content) || Check.isRealArray(v.medias)
        })
        let message = that.getMessageData([], opts)
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1007',
          type: '1',
          message: { ...message, content: this.editorMessage.content }
        }

        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setCreateObject({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1007'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.modifyCreateObjectField('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
  .questionaire-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .q-time input {
      min-width: initial !important;
    }
  }
</style>
