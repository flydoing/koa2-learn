<template>
  <page title="新建布告栏"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="notice-board-create">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleColumn">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">栏目</div>
            <div slot="remark"
                 v-html="columnTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in columns"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item v-if="hasDate"
            class="nb-time"
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
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file', 'emoji']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import DateUtils from '@/utils/date'
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
          column: null,
          deadline: ''
        },
        columns: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      columnTxt() {
        return this.form.column ? this.form.column.name : ''
      },
      hasDate() {
        return this.form.column && this.form.column.value === '2'
      }
    },
    methods: {
      fetchData() {
        const that = this
        CategoryApi.getCategorysByType('138').then(res => {
          that.columns = res.categorys
        })
      },
      handleColumn(item) {
        this.form.column = item
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (!form.column) {
          that.$message({ message: '请选择栏目', type: 'warning' })
          return false
        }

        if (that.hasDate && Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1184',
          groupId: that.currentGroup.groupId,
          categoryId: form.column.id,
          categoryName: form.column.name,
          ...this.editorMessage
        })

        if (that.hasDate) {
          postData.extension = DateUtils.format_0800(form.deadline)
        }

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
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .notice-board-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .nb-time input {
      min-width: initial !important;
    }
  }
</style>
