<template>
  <page title="新建任务"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="task-create">
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
                      placeholder="任务内容"
                      :toolbars="['photo', 'file']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
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
          range: null
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
        ]
      }
    },
    created() {
      this.form.range = this.ranges[0]
    },
    computed: {
      rangeTxt() {
        return this.form.range ? this.form.range.name : ''
      }
    },
    methods: {
      handleRange(item) {
        this.form.range = item
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (!form.range) {
          that.$message({ message: '请选择查看权限', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '任务内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1129',
          groupId: that.currentGroup.groupId,
          extensionType: form.range.value,
          ...this.editorMessage
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .psyc-cnsltn-create {
    textarea {
      height: rem(100);
      border-bottom: rem(1) solid #ededed;
    }
  }
</style>
