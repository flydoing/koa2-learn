<template>
  <page :title="titleText" hasSubmit @submit="commitHandle">
    <item :hasClick="false">
      <div>项目名称</div>
      <input type="text" slot="remark" placeholder="请输入内容" v-model="projectName">
    </item>
    <el-dropdown class="block-element" trigger="click" @command="handleType" v-if="!routeQuery('isParent')">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">分值</div>
          <div slot="remark">{{projectScore}} 分</div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu" slot="dropdown">
        <el-dropdown-item class="menu-item" v-for="type in Number(template.extensionType)" :key="type" :command="type">{{type}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="list-button">
      <div class="button button-common" v-if="routeQuery('isEdit')" @click="deleteHandle">删除项目</div>
    </div>
  </page>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        projectName: '',
        projectScore: null,
        projects: [],
        parentIndex: 1,
        childIndex: 1
      }
    },
    created() {
      this.projects = [...this.template.categories] || []
      this.projectScore = Number(this.template.extensionType)
      if (this.routeQuery('isParent')) {
        this.parentIndex = Number(this.routeQuery('index'))
      } else {
        this.parentIndex = Number(this.routeQuery('index').split('.')[0])
        this.childIndex = Number(this.routeQuery('index').split('.')[1])
      }
      if (this.routeQuery('isEdit')) {
        if (this.routeQuery('isParent')) {
          this.projectName = this.projects[this.parentIndex - 1].name
        } else {
          this.projectName = this.projects[this.parentIndex - 1].childs[this.childIndex - 1].name
          this.projectScore = this.projects[this.parentIndex - 1].childs[this.childIndex - 1].value
        }
      }
    },
    methods: {
      ...mapActions(['saveTemplate']),
      commitHandle() {
        // 编辑
        if (this.routeQuery('isEdit')) {
          if (this.routeQuery('isParent')) {
            this.projects[this.parentIndex - 1].name = this.projectName
          } else {
            this.projects[this.parentIndex - 1].childs[this.childIndex - 1].name = this.projectName
            this.projects[this.parentIndex - 1].childs[this.childIndex - 1].value = this.projectScore
          }
          this.saveTemplate({
            ...this.template,
            categories: this.projects
          })
          this.routeBack()
        } else {
          // 新建
          if (this.routeQuery('isParent')) {
            this.projects.push({
              type: '144',
              name: this.projectName
            })
            // 父项目
            this.saveTemplate({
              ...this.template,
              categories: this.projects
            })
            this.routeBack()
          } else {
            // 子项目
            let tempProject = {
              type: '145',
              name: this.projectName,
              value: this.projectScore
            }
            this.projects[this.parentIndex - 1].childs ? this.projects[this.parentIndex - 1].childs[this.childIndex - 1] =
              tempProject : this.projects[this.parentIndex - 1].childs = [tempProject]
            this.saveTemplate({
              ...this.template,
              categories: this.projects
            })
            this.routeBack()
          }
        }
      },
      handleType(type) {
        this.projectScore = type
      },
      deleteHandle() {
        if (this.routeQuery('isParent')) {
          // 父项目
          this.projects.splice(this.parentIndex - 1, 1)
        } else {
          // 子项目
          this.projects[this.parentIndex - 1].childs.splice(this.childIndex - 1, 1)
        }
        this.saveTemplate({
          ...this.template,
          categories: this.projects
        })
        this.routeBack()
      }
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      }),
      titleText() {
        return this.routeQuery('isEdit') ? `编辑${this.routeQuery('index')}项目` : `新建${this.routeQuery('index')}项目`
      }
    }
  }

</script>
