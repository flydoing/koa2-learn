<template>
  <div class="project-list">
    <div class="pl-item"
         v-for="(project,i) in list"
         :key="i"
         :project="project">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="projectEdit">
        <div class="el-dropdown-link">
          <item>
            <div slot="main"
                 v-html="projectTxt(project, parent, i + 1, parentIndex)"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(m,i) in menus(project, parent, i + 1, parentIndex)"
                            :key="i"
                            :m="m"
                            :command="m">{{m.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="pl-children">
        <ProjectList :list="project.childs || []"
                     :parent="project"
                     :parentIndex="i + 1"
                     :level="level"
                     :depth="dp"
                     v-on:add="projectAdd"
                     v-on:edit="projectEdit"></ProjectList>
      </div>
      <div class="category-title text"
           v-if="!parent && level > 1"></div>
    </div>
    <item @click="projectAdd(parent)"
          v-if="dp <= level"
          :hasArrow="false">
      <div slot="before">
        <i class='ico ico-plus' />
      </div>
      <div slot="main"
           v-html="projectAddTxt(parent)"></div>
    </item>
  </div>
</template>
<script>
  export default {
    name: 'ProjectList',
    props: {
      list: { type: [Array] },
      parent: { type: [Object] },
      parentIndex: { type: [Number] },
      level: { type: [Number] },
      depth: { type: [Number] }
    },
    components: {},
    computed: {
      dp() {
        return (this.depth || 0) + 1
      }
    },
    methods: {
      menus(project, parent, index, pIndex) {
        let ms = []
        let data = { project: project, parent: parent, index: index, pIndex: pIndex }
        if (this.dp === 1) {
          ms = [{ name: '修改', type: 'modify', ...data }, { name: '删除', type: 'remove', ...data }, { name: '设置管理员', type: 'admin', ...data }]
        } else {
          ms = [
            { name: '修改', type: 'modify', ...data },
            { name: '删除', type: 'remove', ...data },
            { name: '编辑封面', type: 'cover', ...data },
            { name: '设置管理员', type: 'admin', ...data },
            { name: '编辑跳转链接', type: 'link', ...data }
          ]
        }
        return ms
      },
      projectTxt(project, parent, index, pIndex) {
        return parent ? `${pIndex}.${index} ${project.name}` : `${index} ${project.name}`
      },
      projectAddTxt(parent) {
        return parent ? `二级栏目` : `一级栏目`
      },
      projectEdit(menu) {
        this.$emit('edit', menu)
      },
      projectAdd(parent) {
        this.$emit('add', parent)
      }
    }
  }
</script>
