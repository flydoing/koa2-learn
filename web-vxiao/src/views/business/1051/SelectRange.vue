<template>
  <page title="发布范围"
        @submit="handleSubmit"
        hasSubmit>
    <Tabs theme="theme-1">
      <TabPane label="班级"
               v-if="isSchool">
        <Scroller :height="scrollerHeight">
          <!-- <SelectGroup :groups="classes"
                       :multiselect='true'
                       @change="onClasses"
                       :cache="vscreen.classes" /> -->
          <item @click="handleAll"
                :hasArrow="false">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':all}"></i>
            </div>
            <div slot="main">全选</div>
          </item>
          <div v-for="(campus,i) in classes"
               :key="i"
               :campus="campus">
            <div class="category-title text"
                 v-html="campus.name"></div>
            <div v-for="(grade,j) in campus.groups"
                 :key="j"
                 :grade="grade">
              <item @click="onClasses(grade)"
                    :hasArrow="false"
                    :label="grade.name">
                <div slot="before">
                  <i class="ico ico-select"
                     :class="{'active':grade.selected}"></i>
                </div>
              </item>
              <item v-for="(cls,k) in grade.groups"
                    :key="k"
                    :cls="cls"
                    :hasArrow="false"
                    :label="cls.name"
                    @click="onClasses(cls)">
                <div slot="before">
                  <i class="ico ico-select"
                     :class="{'active':cls.selected}"></i>
                </div>
              </item>
            </div>
          </div>
        </Scroller>
      </TabPane>
      <TabPane label="群组">
        <Scroller :height="scrollerHeight">
          <SelectGroup v-if="groups.length>0"
                       :groups="groups"
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
        },
        all: false
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
        let schoolId = this.currentGroup.parentId

        let cacheMap = new Map()
        let caches = that.vscreen.classes
        if (Check.isRealArray(caches)) {
          caches.map(c => {
            cacheMap.set(c.groupId, c)
          })
        }
        GroupApi.getSchoolGroupList(schoolId).then(res => {
          if (Check.isRealArray(res.groups)) {
            let count = 0
            let total = 0
            let cMap = new Map()
            let gMap = new Map()
            res.groups.map(g => {
              g.selected = Check.isObject(cacheMap.get(g.groupId))
              if (g.selected) {
                count++
              }

              let grade = gMap.get(`${g.cId}_${g.gId}`)
              if (g.type === '4') {
                cMap.set(g.id, { ...g, groups: [] })
              } else if (g.type === '1') {
                that.groups.push(g)
              } else if (g.type === '3') {
                gMap.set(`${g.cId}_${g.id}`, { ...g, groups: [] })
              } else {
                if (grade) {
                  grade.groups.push(g)
                  gMap.set(`${g.cId}_${g.gId}`, grade)
                }
              }

              if (g.type !== '1' && g.type !== '4') {
                total++
              }
            })

            gMap.forEach((v, k, i) => {
              let index = k.indexOf('_')
              let campus = cMap.get(parseInt(k.substring(0, index)))
              if (Check.isRealArray(v.groups)) {
                campus.groups.push(v)
                cMap.set(campus.id, campus)
              }
            })

            cMap.forEach((v, k, i) => {
              if (Check.isRealArray(v.groups)) {
                this.classes.push(v)
              }
            })

            this.all = total === count
          }
        })

        GroupApi.getPlacesBySchooId({
          schoolId: schoolId,
          level: 1
        }).then(res => {
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
                that.places.push(item)
              }
              ranges.push(v)
            })
            that.$nextTick(() => {
              if (Check.isRealArray(that.vscreen.places)) {
                this.$refs.tree.setCheckedNodes(that.vscreen.places)
              }
            })
          }
        })
      },
      handleAll() {
        this.all = !this.all

        let cs = []
        let all = this.all
        this.classes = this.classes.map(r => {
          r.groups.map(g => {
            g.selected = all
            if (g.selected) {
              cs.push(g)
            }
            g.groups.map(c => {
              c.selected = all
              if (c.selected) {
                cs.push(c)
              }
            })
          })
          return r
        })
        this.setCreateObject({ classes: cs })
      },
      onClasses(item) {
        item.selected = !item.selected
        let count = 0
        let total = 0
        let cs = []
        this.classes = this.classes.map(r => {
          r.groups.map(g => {
            if (g.selected) {
              count++
              cs.push(g)
            }

            if (item.groupId === g.groupId) {
              g.groups.map(c => {
                c.selected = item.selected
              })
              cs.push(...g.groups)
              count += g.groups.length
            } else {
              let cCount = 0
              let isClass = false
              g.groups.map(c => {
                if (c.selected) {
                  count++
                  cCount++
                  cs.push(c)
                }
                if (item.id === c.id) {
                  isClass = true
                }
              })

              if (isClass) {
                if (cCount === g.groups.length) {
                  g.selected = true
                  cs.push(g)
                  count++
                } else {
                  g.selected = false
                  count--
                }
              }
            }
            total += g.groups ? g.groups.length : 0
            total++
          })
          return r
        })
        this.all = count === total
        this.setCreateObject({ classes: cs })
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
