<template>
  <page title="发布范围"
        @submit="handleSubmit"
        hasSubmit>
    <Tabs theme="theme-1">
      <TabPane label="班级"
               v-if="isSchool">
        <Scroller :height="scrollerHeight">
          <SelectGroup :groups="classes"
                       :multiselect='true'
                       @change="onClasses"
                       :cache="vscreen.classes" />
        </Scroller>
      </TabPane>
      <TabPane label="群组">
        <Scroller :height="scrollerHeight">
          <SelectGroup :groups="groups"
                       :multiselect='true'
                       @change="onGroups"
                       :cache="vscreen.groups" />
        </Scroller>
      </TabPane>
      <TabPane label="场所">
        <Scroller :height="scrollerHeight">
          <el-tree :data="places"
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
        </Scroller>
      </TabPane>
    </Tabs>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    data() {
      return {
        maxHeight: 200,
        classes: [],
        groups: [],
        places: [],
        caches: [],
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
        vscreen: 'getCreateObject'
      }),
      scrollerHeight() {
        return this.maxHeight - 52
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      nodeTxt(item, data) {
        if (data.groupName) {
          return `${data.name || ''}  <label style="color:#999;">（常驻：${data.groupName}）</label>`
        }
        return data.name || ''
      },
      fetchData() {
        const that = this
        let ranges = []
        GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
          this.classes = res.classes || []
          this.groups = res.groups || []
        })
        GroupApi.getPlacesBySchooId({
          schoolId: that.currentGroup.parentId,
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
              that.places.push(item)
            }
            ranges.push(v)
          })
          that.$nextTick(() => {
            if (Check.isRealArray(that.vscreen.places)) {
              this.$refs.tree.setCheckedNodes(that.vscreen.places)
            }
          })
        })
      },
      onClasses(arr) {
        this.setCreateObject({ classes: arr })
      },
      onGroups(arr) {
        this.setCreateObject({ groups: arr })
      },
      handleSubmit() {
        let ranges = this.$refs.tree.getCheckedNodes()
        this.setCreateObject({ places: ranges })
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
