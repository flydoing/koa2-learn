<template>
  <page title="发布范围"
        @submit="handleSubmit"
        hasSubmit>
    <el-tree :data="list"
             show-checkbox
             default-expand-all
             check-on-click-node
             node-key="id"
             ref="tree"
             highlight-current
             :props="placeProps">
      <span class="custom-tree-node"
            slot-scope="{ node, data }">
        <span v-html="data.name"></span>
      </span>
    </el-tree>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: [],
        placeProps: {
          children: 'children',
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
        const that = this
        GroupApi.getSchoolGroupList(that.currentGroup.parentId).then(res => {
          let obj = {}
          res.groups.map(v => {
            if (v.type === '4') {
              obj[v.id] = { ...v, children: [] }
            } else {
              obj[v.groupId] = v
            }
          })

          let groups = []
          res.groups.map(v => {
            let item = obj[v.type === '4' ? v.id : v.groupId]
            let parent = obj[v.cId]
            if (parent) {
              parent.children.push(item)
            } else {
              groups.push(item)
            }
          })
          that.list = [{ id: 0, name: '全部', children: groups }]
        })
      },
      handleSubmit() {
        let ranges = this.$refs.tree.getCheckedNodes()
        if (ranges.length > 0) {
          ranges = ranges.filter(v => {
            return v.id !== 0
          })
        }
        this.setStorage('_1169_range_cache', ranges)
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: rem(10);
  }
</style>
