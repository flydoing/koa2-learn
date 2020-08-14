<template>
  <page title="选择颁发规则"
        @submit="handleSubmit"
        hasSubmit>
    <div class="category-title text">颁发条件</div>
    <item v-for="(item,i) in conditions"
          :key="i"
          :item="item"
          :hasArrow="false"
          @click="handleConditionSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.active}"></i>
      </div>
      <div slot="main">{{item.name}}</div>
      <div slot="remark">得
        <input class="cndn-score"
               placeholder="分值"
               v-model="item.value"
               @click.stop />分</div>
    </item>
    <div class="category-title text">相关勋章</div>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>
    </item>
    <div class="category-title text"></div>
    <div v-for="(item,i) in medals"
         :key="i"
         :item="item">
      <item @click="handleMedalSelect(item, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.active}"></i>
        </div>
        <div slot="main"
             v-html="itemTxt(item, i + 1, null)"></div>
        <div slot="after"></div>
      </item>
      <item v-for="(child,j) in item.childs"
            :key="j"
            :child="child"
            :hasArrow="false"
            @click="handleMedalSelect(child, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':child.active}"></i>
        </div>
        <div slot="main"
             v-html="itemTxt(child, j + 1, i + 1)"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  import Api1005 from '@/views/business/1005/api'

  export default {
    mixins: [R],
    data() {
      return {
        conditions: [],
        medals: [],
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        commend: 'getCommend'
      })
    },
    methods: {
      ...mapActions(['setCommend']),
      fetchData() {
        const that = this
        let rule = that.commend.cmdn.rule
        let cdCache = rule ? rule.condition : null
        let mdlCaches = rule ? rule.medals : []

        Api.loadConditions(that.currentGroup.groupId).then(res => {
          that.conditions = res.categorys.map(c => {
            if (cdCache && cdCache.extension === c.extension) {
              c.value = cdCache.value
              c.active = true
            } else {
              c.active = false
            }
            return c
          })
        })

        let mMap = new Map()
        if (Check.isRealArray(mdlCaches)) {
          mdlCaches.map(m => {
            mMap.set(m.id, m)
          })
        }

        let total = 0
        let count = 0
        Api1005.loadMedalList(that.currentGroup.groupId).then(res => {
          that.medals = res.categorys.filter(m => {
            let flag = m.description !== '2' && m.description !== '3'
            if (flag) {
              if (mMap.get(m.id)) {
                m.active = true
                count++
              } else {
                m.active = false
              }
              if (m.childs) {
                m.childs.map(c => {
                  if (mMap.get(c.id)) {
                    c.active = true
                    count++
                  } else {
                    c.active = false
                  }
                })
              }
              total++
              total += m.childs ? m.childs.length : 0
            }
            return flag
          })
          that.all = count === total
        })
      },
      itemTxt(item, index, pIndex) {
        if (pIndex) {
          return `${pIndex}.${index} ${item.name}`
        }
        return `${index} ${item.name}`
      },
      handleAll() {
        this.all = !this.all

        let all = this.all
        this.medals = this.medals.map(m => {
          m.active = all
          if (m.childs) {
            m.childs.map(c => {
              c.active = all
            })
          }
          return m
        })
      },
      handleMedalSelect(item) {
        item.active = !item.active

        let count = 0
        let total = 0
        this.medals = this.medals.map(m => {
          if (m.active) {
            count++
          }

          if (item.id === m.id && m.childs) {
            m.childs.map(c => {
              c.active = item.active
            })
            count += m.childs.length
          } else {
            let cCount = 0
            let isChild = false
            if (m.childs) {
              m.childs.map(c => {
                if (c.active) {
                  count++
                  cCount++
                }
                if (item.id === c.id) {
                  isChild = true
                }
              })
            }

            if (isChild) {
              if (m.childs && cCount === m.childs.length) {
                m.active = true
                count++
              } else {
                m.active = false
                count--
              }
            }
          }
          total += m.childs ? m.childs.length : 0
          total++
          return m
        })
        this.all = count === total
      },
      handleConditionSelect(item) {
        this.conditions = this.conditions.map(c => {
          if (c.id === item.id) {
            item.active = !item.active
          } else {
            c.active = false
          }
          return c
        })
      },
      handleSubmit() {
        const that = this

        let cndns = that.conditions.filter(c => {
          return c.active
        })
        if (!Check.isRealArray(cndns)) {
          that.$message({ message: '请选择颁发条件', type: 'warning' })
          return false
        }

        let mdls = []
        this.medals.map(m => {
          if (m.active === true) {
            mdls.push(m)
            if (m.childs) {
              mdls.push(...m.childs)
            }
          } else {
            if (m.childs) {
              m.childs.map(c => {
                if (c.active === true) {
                  mdls.push(c)
                }
              })
            }
          }
        })
        if (!Check.isRealArray(mdls)) {
          that.$message({ message: '请选择相关勋章', type: 'warning' })
          return false
        }
        that.setCommend({ cmdn: { ...that.commend.cmdn, rule: { medals: mdls, condition: cndns[0] } } })
        that.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .cndn-score {
    padding: 0 rem(5);
    width: 50px;
    min-width: 50px;
    text-align: center !important;
  }
</style>
