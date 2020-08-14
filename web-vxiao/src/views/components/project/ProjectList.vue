<template>
  <div class="project-list">
    <div class="pl-item" v-for="(project,i) in list" :key="i" :project="project">
      <item className="vx-item-show" @click="projectEdit(project, parent, i + 1, parentIndex, dp, sort)">
        <div slot="main">
          <div class="pjt-txt" v-html="projectTxt(project, parent, i + 1)"></div>
        </div>
        <div slot="remark">
          <div class="pjt-remark" v-html="remarkTxt(project, dp)"></div>
        </div>
      </item>
      <div class="pl-children" v-if="dp < level">
        <ProjectList :list="project.childs || []" :parent="project" :parentIndex="i + 1" :sort="sortTxt(i + 1)" :level="level" :depth="dp" v-on:add="projectAdd" v-on:edit="projectEdit" :remarkHandle="remarkHandle"></ProjectList>
      </div>
      <div class="category-title text" v-if="!parent && level > 1"></div>
    </div>
    <item className="vx-item-show" @click="projectAdd(parent, list, parentIndex, dp, sort)" v-if="dp <= level">
      <div slot="before">
        <i class="ico ico-plus" />
      </div>
      <div slot="main" v-html="projectAddTxt(parent, list)"></div>
    </item>
  </div>
</template>
<script>
  export default {
    name: 'ProjectList',
    props: {
      list: { type: [Array] },
      sort: { type: [String] },
      parent: { type: [Object] },
      parentIndex: { type: [Number] },
      level: { type: [Number] },
      depth: { type: [Number] },
      remarkHandle: { type: [Function] }
    },
    components: {},
    computed: {
      dp() {
        return (this.depth || 0) + 1
      }
    },
    methods: {
      sortTxt(index) {
        return this.parent ? `${this.sort}.${index}` : `${index}`
      },
      projectTxt(project, parent, index) {
        return parent ? `${this.sort}.${index} ${project.name}` : `${index} ${project.name}`
      },
      projectAddTxt(parent, list) {
        return parent ? `${this.sort}.${(list ? list.length : 0) + 1} 新项目` : `${(list ? list.length : 0) + 1} 新项目`
      },
      projectEdit(project, parent, index, pIndex, dp, sort) {
        this.$emit('edit', project, parent, index, pIndex, dp, sort)
      },
      projectAdd(parent, list, pIndex, dp, sort) {
        this.$emit('add', parent, list, pIndex, dp, sort)
      },
      remarkTxt(project, dp) {
        if (this.remarkHandle) {
          return this.remarkHandle(project, dp)
        }
        return ''
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .project-list {
    .pjt-txt {
      text-align: justify!important;
      padding: rem(5) 0!important;
    }
    .pjt-remark {
      width: rem(150)!important;
    }
  }

</style>
