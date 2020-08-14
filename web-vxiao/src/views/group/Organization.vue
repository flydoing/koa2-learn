<template>
  <page title="组织架构"
        hasSubmit
        @submit="handleSubmit">
    <el-tree :data="groups"
             :props="defaultProps"
             :allow-drag="allowDrag"
             :allow-drop="allowDrop"
             node-key="id"
             default-expand-all
             @node-drag-start="handleDragStart"
             @node-drag-enter="handleDragEnter"
             @node-drag-leave="handleDragLeave"
             @node-drag-over="handleDragOver"
             @node-drag-end="handleDragEnd"
             @node-drop="handleDrop"
             draggable>
    </el-tree>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    data() {
      return {
        groups: [],
        defaultProps: {
          children: 'groups',
          label: 'name'
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        GroupApi.getTreeGroups(this.schoolId).then(res => {
          if (res.treeGroups) {
            this.groups = [{ ...this.currentGroup, rootId: 0, groups: res.treeGroups, first: '1' }]
          }
        })
      },
      handleDragStart(node, ev) {},
      handleDragEnter(draggingNode, dropNode, ev) {},
      handleDragLeave(draggingNode, dropNode, ev) {},
      handleDragOver(draggingNode, dropNode, ev) {},
      handleDragEnd(draggingNode, dropNode, dropType, ev) {},
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log(draggingNode, dropNode)
      },
      allowDrag(draggingNode) {
        return draggingNode.data.first !== '1'
      },
      allowDrop(draggingNode, dropNode, type) {
        return dropNode.data.first !== '1'
      },
      iterateGroups(id, datas, groups) {
        datas.forEach(v => {
          groups.push({ id: v.id, rootId: id })
          if (v.groups) {
            this.iterateGroups(v.id, v.groups, groups)
          }
        })
        return groups
      },
      handleSubmit() {
        let groups = this.iterateGroups(this.groups[0].id, this.groups[0].groups, [])
        GroupApi.modifyGroupRootIds({
          groups: groups
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
