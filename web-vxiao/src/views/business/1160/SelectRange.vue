<template>
  <Page title="班牌显示"
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
        <span v-html="nodeTxt(node, data)"></span>
      </span>
    </el-tree>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
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
    computed: {
      ...mapGetters({
        mien: 'getTeacherMien'
      })
    },
    methods: {
      ...mapActions(['setTeacherMien']),
      nodeTxt(item, data) {
        if (data.groupName) {
          return `${data.name || ''}  <label style="color:#999;">（常驻：${data.groupName}）</label>`
        }
        return data.name || ''
      },
      fetchData() {
        const that = this

        GroupApi.getPlacesBySchooId({
          schoolId: that.currentGroup.parentId,
          userId: that.mien.form.user.userId,
          level: 1
        }).then(res => {
          let obj = {}
          res.places.map(v => {
            if (v.type === '1') {
              obj[v.id] = v
            } else {
              obj[v.id] = { ...v, children: [] }
            }
          })

          res.places.map(v => {
            let item = obj[v.id]
            let parent = obj[v.parentId]
            if (parent) {
              parent.children.push(item)
            } else {
              that.list.push(item)
            }
          })
          that.$nextTick(() => {
            if (Check.isRealArray(that.mien.ranges)) {
              this.$refs.tree.setCheckedNodes(that.mien.ranges)
            }
          })
        })
      },
      handleSubmit() {
        let ranges = this.$refs.tree.getCheckedNodes()
        this.setTeacherMien({ ranges: ranges })
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
