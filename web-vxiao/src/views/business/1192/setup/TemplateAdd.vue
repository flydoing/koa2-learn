<template>
  <page :title="pageTitle"
        hasSubmit
        @submit="createTemplateCommit"
        listenBack
        @back="back">
    <item :hasClick="false">
      <div>模板名称</div>
      <input type="text"
             slot="remark"
             placeholder="请输入内容"
             v-model="templateObj.title"
             @change="titleInput">
    </item>
    <item @click="addSubjects">
      <div>评价科目</div>
      <div slot="remark"
           v-if="templateObj.extension">{{templateObj.extension.length}}科</div>
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">评价方式</div>
          <div v-if="templateObj.extensionType"
               slot="remark">{{scoreTypeText}}</div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(type,i) in scoreValue"
                          :key="i"
                          :type="type"
                          :command="type">{{type.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item @click="commentResult">
      <div>评价结果</div>
      <div slot="remark"
           v-if="templateObj.metaDatas">{{templateObj.metaDatas.length}}级</div>
    </item>
    <div class="category-title total">
      <div>评价内容</div>
      <div>{{total}}</div>
    </div>
    <ProjectList v-if="templateObj.categories"
                 :list="templateObj.categories"
                 :level="level"
                 v-on:add="projectAdd"
                 v-on:edit="projectEdit"
                 :remarkHandle="remarkHandle"></ProjectList>
    <div class="list-button"
         v-if="routeQuery('templateId')">
      <div class="button button-common"
           @click="deleteTemplate">删除模板</div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Api from '../api'
  import G from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [G],
    components: {
      ProjectList: resolve => require(['@/views/components/project/ProjectList'], resolve)
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      }),
      scoreTypeText() {
        return (
          this.template.extensionType &&
          this.scoreValue.filter(type => {
            return Number(this.template.extensionType) === type.type
          })[0].text
        )
      },
      total() {
        let total = 0
        this.templateObj.categories &&
          this.templateObj.categories.forEach(c => {
            c.childs &&
              c.childs.forEach(child => {
                total += Number(child.value)
              })
          })
        return total > 0 ? total : ''
      }
    },
    data() {
      return {
        pageTitle: this.routeQuery('templateId') ? '评价模板详情' : '新建模板',
        level: 2,
        scoreValue: [
          {
            text: '1-5分',
            type: 5
          },
          {
            text: '1-10分',
            type: 10
          }
        ],
        templateObj: {
          title: '',
          extensionType: ''
        }
      }
    },
    created() {
      if (this.routeQuery('templateId')) {
        // 编辑
        if (Number(this.routeQuery('templateId')) !== this.template.id) {
          Api.getCommentItem(this.routeQuery('templateId')).then(res => {
            res.template.extension = JSON.parse(res.template.extension)
            this.saveTemplate({
              ...this.template,
              ...res.template
            })
            this.gainData()
          })
        } else {
          this.gainData()
        }
      } else {
        // 新建
        this.gainData()
      }
    },
    methods: {
      ...mapActions(['saveTemplate', 'clearTemplate']),
      gainData() {
        let template = this.template
        this.templateObj = {
          ...template
        }
      },
      addSubjects() {
        this.routePush({
          name: 'templateSubjects1192',
          query: {
            templateId: this.routeQuery('templateId')
          }
        })
      },
      titleInput() {
        this.saveTemplate({
          ...this.template,
          title: this.templateObj.title
        })
      },
      handleType(scoreType) {
        // const that = this
        this.$set(this.templateObj, 'extensionType', scoreType.type)
        this.templateObj.categories = this.templateObj.categories.map(v => {
          v.childs = v.childs.map(c => {
            return {
              ...c,
              value: scoreType.type
            }
          })
          return v
        })
        this.saveTemplate({
          ...this.template,
          categories: this.templateObj.categories,
          extensionType: scoreType.type
        })
      },
      commentResult() {
        this.routePush({
          name: 'templateCommentResult1192'
        })
      },
      createTemplateCommit() {
        if (Check.isNullString(this.template.title)) {
          this.$message({
            type: 'warning',
            message: '请输入模板名称'
          })
          return false
        }
        if (!Check.isRealArray(this.template.extension)) {
          this.$message({
            type: 'warning',
            message: '请选择评价科目'
          })
          return false
        }
        if (!Check.isRealArray(this.template.categories)) {
          this.$message({
            type: 'warning',
            message: '请添加评价内容'
          })
          return false
        }
        this.gainData()
        this.templateObj.categories.forEach(c => {
          c.id && delete c.id
          let total = 0
          c.childs &&
            c.childs.forEach(child => {
              child.id && delete child.id
              total += Number(child.value)
            })
          c.value = total
        })
        this.templateObj.metaDatas = this.templateObj.metaDatas.map(mate => {
          return {
            obj: mate.obj,
            key: mate.key,
            extension: mate.extension
          }
        })
        Api.createTemplate({
          template: {
            categories: this.templateObj.categories,
            extension: JSON.stringify(this.template.extension),
            extensionType: this.template.extensionType,
            groupId: this.currentGroup.groupId,
            metaDatas: this.templateObj.metaDatas,
            score: this.total,
            title: this.template.title,
            type: this.routeQuery('appType')
          }
        }).then(res => {
          if (res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.clearTemplate()
            this.routeBack()
          }
        })
      },
      projectAdd(parent, list, parentIndex, dp, sort) {
        if (!this.templateObj.extensionType) {
          this.$message({
            type: 'warning',
            message: '请先选择评价方式'
          })
          return false
        }
        this.routePush({
          name: 'projectCreateAndEdit1192',
          query: {
            isParent: !parent,
            index: !parent ? list.length + 1 : `${parentIndex}.${(parent.childs ? parent.childs.length : 0) + 1}`
          }
        })
      },
      projectEdit(project, parent, index, parentIndex, dp, sort) {
        this.routePush({
          name: 'projectCreateAndEdit1192',
          query: {
            isEdit: true,
            isParent: !parent,
            index: !parent ? index : `${parentIndex}.${index}`
          }
        })
      },
      remarkHandle(project, dp) {
        if (project) {
          if (dp === 1) {
            let total = 0
            project.childs &&
              project.childs.forEach(child => {
                total += Number(child.value)
              })
            return total
          } else {
            return project.value
          }
        }
      },
      deleteTemplate() {
        Api.createTemplate({
          template: {
            id: this.routeQuery('templateId'),
            status: 'd',
            type: '1192'
          }
        }).then(res => {
          this.routeBack()
        })
      },
      back() {
        this.clearTemplate()
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .total {
    @include flex;
    justify-content: space-between;
  }
</style>
