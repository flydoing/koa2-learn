<template>
  <page title="选择场所"
        closePrompt
        @submit="placeSubmit"
        hasSubmit>
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
  </page>
</template>
<script>
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        placeProps: {
          children: 'children',
          label: 'name'
        },
        places: [],
        all: false
      }
    },
    created() {
      this.getPlaces()
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
      handleAll() {
        this.all = !this.all
        this.placeList.map(v => {
          v.selected = this.all
          return v
        })
      },
      handleSelect(item) {
        item.selected = !item.selected

        let gs = this.placeList.filter(v => {
          return v.selected
        })
        this.all = gs.length === this.placeList.length
      },
      getPlaces() {
        let ranges = []
        const schoolId = this.schoolId
        GroupApi.getPlacesBySchooId({ schoolId: schoolId, level: '1' }).then(res => {
          if (res.code === '1' && res.places) {
            let obj = {}
            if (res.places) {
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
                  this.places.push(item)
                }
                ranges.push(v)
              })
              this.$nextTick(() => {
                if (Check.isRealArray(this.vscreen.places)) {
                  this.$refs.tree.setCheckedNodes(this.vscreen.places)
                }
              })
            }
          }
        })
      },
      placeSubmit() {
        let ranges = this.$refs.tree.getCheckedNodes()
        this.setCreateObject({ places: ranges })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
</style>
