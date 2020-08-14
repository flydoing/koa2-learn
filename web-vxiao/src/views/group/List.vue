<template>
  <div class="group-list group-list222">
    <template v-for="(g,i) in searchGroup">
      <template v-if="g.childrens">
        <ItemText v-if="g.childrens.length > 0"
                  @click.native="handleParent(g)"
                  icon="ico-right"
                  :item="rule(g)"
                  :key="g.groupId">
          <span slot="text">{{g.name}}</span>
          <div slot="after"
               :class="prefixParentBubble(g)"><span v-if="g.bubbleCount">{{g.bubbleCount}}</span></div>
        </ItemText>
        <transition name="fade"
                    :key="i">
          <div class="childs"
               v-if="g.groupId===parentId"
               :key="i">
            <template v-for="c in g.childrens">
              <ItemText @click="handleGroup(c)"
                        :item="rule(c)"
                        :class="{'active':c.groupId===groupId}"
                        :key="c.groupId">
                <span slot="text">{{c.showName || c.name}}</span>
                <div slot="after"
                     v-if="c.bubbleCount > 0"
                     :class="prefixBubble(c)">{{c.bubbleCount}}</div>
                <div slot="after"
                     v-if="c.bubbleCount === 0 && c.redotCount > 0"
                     :class="prefixBubble(c)"></div>
              </ItemText>
            </template>
          </div>
        </transition>
      </template>
      <template v-else>
        <ItemText @click.native="handleGroup(g)"
                  :item="rule(g)"
                  :class="{'active':g.groupId===groupId}"
                  :key="g.groupId">
          <span slot="text">{{g.name}}</span>
          <div slot="after"
               :class="prefixBubble(g)"><span v-if="g.bubbleCount">{{g.bubbleCount}}</span></div>
        </ItemText>
      </template>
    </template>
  </div>
</template>
<script>
  import IMApi from '@/api/im'
  import Check from '@/utils/check'
  import Group from '@/constant/group'
  import ItemText from '@/components/item/ItemText'
  import { mapGetters, mapActions } from 'vuex'
  import * as Storage from '@/utils/storage'
  export default {
    props: {
      keyword: { type: String }
    },
    components: { ItemText },
    data() {
      return {
        parentId: '',
        redotTimeout: null,
        redotTs: 0,
        todolistTimeout: null,
        todolistTsObj: {}
      }
    },
    computed: {
      ...mapGetters({
        groups: 'getGroupMenus',
        historyGroup: 'getCurrentGroup',
        groupUsers: 'getCurrentGroupUsers',
        notifyBubble: 'getNotifyBubble',
        getMetaDataByType: 'getMetaDataByType'
      }),
      spaceMeta() {
        return this.getMetaDataByType('m_group_space', false)
      },
      displayMeta() {
        return this.getMetaDataByType('m_school_group_display', false)
      },
      orgShow() {
        let meta = this.getMetaDataByType('m_user_org_show') || {}
        return meta.obj === '1'
      },
      groupId() {
        return this.historyGroup.groupId
      },
      searchGroup() {
        let search = this.keyword
        if (search) {
          return this.groups.filter(g => {
            return g.name.indexOf(search) > -1 || g.groupId.indexOf(search) > -1
          })
        }

        let top = []
        let bottom = []
        let schools = []
        let map = new Map()
        this.groups.forEach(v => {
          if ((v.isTop === 1 && v.type !== Group.SCHOOL) || v.type === Group.SUBSCRIBE_IMP) {
            top.push(v)
          } else if (v.type === Group.SCHOOL) {
            let _spaceMetas = this.spaceMeta.filter(_meta => {
              return _meta.extension === v.groupId
            })
            let _displayMeta = this.displayMeta.filter(_meta => {
              return _meta.extension === v.groupId
            })[0]
            // 如果设置过空间昵称，则走默认例如：“教育局空间”
            if (_spaceMetas.length > 0) {
              _spaceMetas.some(_meta => {
                v.showName = Check.isNullString(_meta.obj) ? `${Group.getKeyName(v.orgType)}空间` : _meta.obj
                return true
              })
            } else {
              v.showName = parseInt(v.orgType) < 100000 ? '学校空间' : `${Group.getKeyName(v.orgType) || ''}空间`
            }
            let data = {
              id: v.parentId,
              groupId: v.groupId,
              name: v.name,
              pId: v.parentId,
              sort: v.sort,
              childrens: []
            }
            let dMeta = _displayMeta || {}
            if (dMeta.obj !== '0' && dMeta.obj !== 'false') {
              data.childrens = [{ ...v, sort: -1 }]
            }
            schools.push({ ...data, items: [] })
            map.set(this.orgShow ? v.id : v.parentId, data)
          } else if (this.orgShow && v.type === Group.GRADE) {
            map.set(v.id, {
              id: v.id,
              groupId: v.groupId,
              name: v.name,
              pId: v.parentId,
              sort: v.sort,
              childrens: []
            })
          } else if (v.parentId === 0) {
            bottom.push(v)
          } else if (v.type === Group.CLASS || v.type === Group.ORDINARY || v.type === Group.COURSE) {
            let pId = this.orgShow ? v.nId : v.parentId
            if (map.get(pId)) {
              map.get(pId).childrens.push(v)
            } else {
              bottom.push(v)
            }
          }
        })

        let others = []
        let middle = [...map.values()].map(v => {
          return {
            ...v,
            childrens: v.childrens.sort((a, b) => {
              return a.sort - b.sort
            })
          }
        })
        if (this.orgShow) {
          // 如果是一个组织结构下的，则按组织结构排序
          let sMap = new Map()
          schools = schools.sort((a, b) => {
            return a.sort - b.sort
          })
          schools.forEach(v => {
            sMap.set(v.id, v)
          })

          middle.map(v => {
            let school = sMap.get(v.id)
            if (!school) {
              let data = sMap.get(v.pId)
              if (data) {
                data.items.push(v)
                sMap.set(v.pId, data)
              } else {
                others.push(v)
              }
            } else {
              sMap.set(v.id, { ...v, items: school.items })
            }
          })

          let groups = []
          sMap.forEach((v, k, i) => {
            let items = v.items
            delete v.items
            groups.push(
              v,
              ...items.sort((a, b) => {
                return a.sort - b.sort
              })
            )
          })
          middle = groups
        }
        middle = middle.sort((a, b) => {
          return a.sort - b.sort
        })
        others = others.sort((a, b) => {
          return a.sort - b.sort
        })
        return [...top, ...middle, ...others, ...bottom]
      }
    },
    mounted() {
      let redotTS = Storage.local.getString(`${this.USER.id}_redot_ts`)
      this.redotTs = redotTS !== null ? redotTS : 0

      this.queryRedot()
      this.modifyGroup({ groupId: this.groupId, redotCount: 0 })
    },
    methods: {
      ...mapActions(['loadGroupUsers', 'currentGroupId', 'modifyGroup', 'modifyNotify', 'saveNotifyTodolist']),
      rule(g, active = '') {
        return { data: g, cls: `${active}` }
      },
      handleParent(g) {
        if (this.parentId === g.groupId) {
          this.parentId = 0
        } else {
          this.parentId = g.groupId
        }
      },
      handleGroup(g) {
        this.currentGroupId(g.groupId)
        this.modifyGroup({ groupId: g.groupId, redotCount: 0 })
        if (!Check.isRealArray(this.groupUsers) || this.groupUsers.length === 1) {
          this.loadGroupUsers(g.groupId)
        }
        this.routeReplace({
          path: `/vx`
        })
      },
      prefixParentBubble(p) {
        let count = 0
        let count2 = 0
        p.childrens &&
          p.childrens.some(c => {
            count += c.bubbleCount
            if (c.redotCount) {
              count2 += c.redotCount
            }
          })
        this.$set(p, 'bubbleCount', count)
        this.$set(p, 'redotCount', count2)
        return [
          `bubble`,
          {
            'has-bubble': p.bubbleCount > 0
          },
          {
            'redot-bubble': p.redotCount > 0 && p.bubbleCount === 0
          }
        ]
      },
      prefixBubble(g) {
        return [
          `bubble`,
          {
            'has-bubble': g.bubbleCount > 0
          },
          {
            'redot-bubble': g.redotCount > 0 && g.bubbleCount === 0
          }
        ]
      },
      getRedot() {
        IMApi.queryRedot(this.redotTs).then(data => {
          if (data.ts) {
            this.redotTs = data.ts
            Storage.local.set(`${this.USER.id}_redot_ts`, this.redotTs)
          }
          if (data.messages) {
            this.updateRedot(data.messages)
          }
        })
      },
      // 红点
      queryRedot() {
        const that = this
        // 第一次查询
        this.getRedot()
        // 2分钟轮询一次
        clearInterval(that.redotTimeout)
        that.redotTimeout = setInterval(() => {
          this.getRedot()
        }, 2 * 60 * 1000)
      },
      // 更新红点
      updateRedot(dots) {
        dots.map(v => {
          this.modifyGroup({ groupId: v.groupId, redotCount: 1 })
        })
      },
      queryTodoList() {
        let key = `${this.groupId}`
        // 第一次查询
        IMApi.queryTodoList(this.groupId).then(data => {
          if (data.ts) {
            this.todolistTsObj[key] = data.ts
          } else {
            this.todolistTsObj[key] = ''
          }
          if (data.messages) {
            this.updateTodoList(data.messages)
          }
        })
      },
      // 更新气泡待办
      updateTodoList(messages) {
        messages.map(message => {
          this.modifyNotify(message)
          this.saveNotifyTodolist(message)
        })
      }
    },
    watch: {
      historyGroup(val) {
        if (!Check.isNullObject(val)) {
          if (val.status === 'd') {
            this.searchGroup.some(g => {
              if (Check.isRealArray(g.childrens)) {
                this.parentId = g.groupId
                this.handleGroup(g.childrens[0])
              } else {
                this.handleGroup(g)
              }
              return true
            })
          } else {
            // 如果属于分组内的群组，则需要展开当前分组
            this.searchGroup.some(g => {
              if (val.isTop === 1) {
                return false
              }
              // 如果是按组织结构展示的群列表
              if (Check.isRealArray(g.childrens)) {
                if (this.orgShow) {
                  if (g.id === val.nId) {
                    this.parentId = g.groupId
                    return true
                  }
                } else if (g.id === val.parentId) {
                  this.parentId = g.groupId
                  return true
                }
              }
            })
          }
        }
      },
      groupId() {
        this.queryTodoList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .childs {
    will-change: transform, opacity, height;
  }
</style>
