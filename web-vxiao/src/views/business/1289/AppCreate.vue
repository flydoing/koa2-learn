<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        @submit="submit">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleMember">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">责任人/部门</div>
          <div slot="remark"
               class="ellipsis"
               v-html="memberTxt"></div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item command="个人">个人</el-dropdown-item>
        <el-dropdown-item command="小组">小组</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item class="o-time"
          :hasClick="false">
      <div slot="main">截止时间</div>
      <div slot="after">
        <el-date-picker v-model="form.deadline"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleRange">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">查看权限</div>
          <div slot="remark"
               v-html="rangeTxt"></div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in ranges"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
    </keep-alive>
  </Page>
</template>
<script>
  // import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api.js'
  import dateFormat from '@/utils/date'
  export default {
    mixins: [R, MixinMessage],
    props: { app: Object },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          deadline: '', // 截止时间
          members: [], // 责任人
          range: null // 查看权限
        },
        ranges: [
          {
            name: '全体可见',
            value: '0'
          },
          {
            name: '管理员可见',
            value: '1'
          }
        ],
        editorMessage: {} // 富文本内容
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        order: 'getOrder'
      }),
      title() {
        if (this.app) {
          return `新建${this.app.name}`
        } else {
          return '新建'
        }
      },
      memberTxt() {
        let mbs = this.form.members
        return mbs.length > 0
          ? mbs
              .map(v => {
                return v.name
              })
              .join('、')
          : ''
      },
      rangeTxt() {
        return this.form.range ? this.form.range.name : ''
      }
    },
    methods: {
      ...mapActions(['setOrder', 'modifyChannelMessage']),
      fetchData() {
        // console.log(this.order, 'fetchData')
        if (this.order.users) {
          this.form.members = this.order.users
        }
      },
      // 责任人/部门选择
      handleMember(value) {
        if (value === '个人') {
          this.setOrder({ form: this.form, users: this.form.members })
          this.routePush({ name: 'selectMember1289' })
        } else {
          this.setOrder({ form: this.form, users: this.form.members })
          this.routePush({ name: 'selectGroups1289' })
        }
      },
      // 查看权限选择
      handleRange(item) {
        this.form.range = item
      },
      submit() {
        if (this.form.members.length < 1) {
          this.$message({ message: '责任人不能为空', type: 'warning' })
          return
        }
        if (!this.form.deadline) {
          this.$message({ message: '截止时间不能为空', type: 'warning' })
          return
        }
        if (!this.form.range) {
          this.$message({ message: '查看权限不能为空', type: 'warning' })
          return
        }
        if (!this.editorMessage) {
          this.$message({ message: '文本内容不能为空', type: 'warning' })
          return
        }
        this.order.form.members.forEach(item => {
          item['type'] = 'executor'
        })
        let postData = this.constructionMessage({
          isPrivate: this.form.range.value,
          type: '128901',
          groupId: this.currentGroupId,
          times: [
            {
              type: 'end',
              setTime: dateFormat.format_0800(this.form.deadline)
            }
          ],
          ...this.editorMessage,
          toUsers: this.order.form.members
        })
        Api.addCalendar(postData).then(res => {
          if (res.code === '1') {
            this.$message({ message: '操作成功', type: 'success' })
            this.form.members = []
            this.setOrder({ form: this.form, users: this.form.members })
            this.modifyChannelMessage(res.messages[0]) // 更新列表
            this.routeBack()
          }
        })
      },
      handleBack() {
        if (this.content.length > 0) {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.routeBack()
          })
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
