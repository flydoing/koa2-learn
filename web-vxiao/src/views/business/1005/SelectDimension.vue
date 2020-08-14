<template>
  <page title="选择统计维度"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleSelectAll">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>
      <div slot="after"></div>
    </item>
    <div class="category-title text"></div>
    <div v-for="(item,i) in list"
         :key="i"
         :item="item">
      <item @click="handleSelect(item, i)">
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
            @click="handleSelect(child, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':child.active}"></i>
        </div>
        <div slot="main"
             v-html="itemTxt(child, j + 1, i + 1)"></div>
        <div slot="after"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      itemTxt(item, index, pIndex) {
        if (pIndex) {
          return `${pIndex}.${index} ${item.name}`
        }
        return `${index} ${item.name}`
      },
      fetchData() {
        const that = this
        let medalId = this.routeQuery('mId')
        let caches = that.evaluate.medal.dimensions

        let cMap = new Map()
        Check.isRealArray(caches) &&
          caches.map(v => {
            cMap.set(v.id, v)
          })

        let total = 0
        let count = 0
        Api.loadMedalList(that.currentGroup.groupId).then(res => {
          that.list = res.categorys.filter(v => {
            if (cMap.get(v.id)) {
              v.active = true
              count++
            } else {
              v.active = false
            }

            if (v.childs && v.description !== '2' && v.description !== '3') {
              v.childs = v.childs.filter(c => {
                if (cMap.get(c.id)) {
                  c.active = true
                  count++
                } else {
                  c.active = false
                }
                return c.id !== medalId
              })
              total += v.childs.length
            }
            return v.description !== '2' && v.description !== '3'
          })
          total += that.list.length
          count === total && (that.all = true)
        })
      },
      handleSelectAll() {
        this.all = !this.all

        let all = this.all
        this.list = this.list.map(u => {
          if (all === true) {
            u.active = true
            u.childs.map(c => {
              c.active = true
            })
          } else {
            u.active = false
            u.childs.map(c => {
              c.active = false
            })
          }
          return u
        })
      },
      handleSubmit() {
        let caches = []
        this.list.map(v => {
          v.active && caches.push(v)
          if (v.childs) {
            v.childs.map(c => {
              c.active && caches.push(c)
            })
          }
        })

        if (caches.length < 1) {
          this.$message({ message: '选择维度统计', type: 'warning' })
          return false
        }

        this.setCreateObject({
          medal: {
            ...this.evaluate.medal,
            dimensions: caches,
            dimensionTxt: caches
              .map(c => {
                return c.name
              })
              .join('、')
          }
        })
        this.routeBack()
      },
      handleSelect(dimension, index) {
        dimension.active = !dimension.active

        let count = 0
        let total = 0
        this.list = this.list.map(u => {
          if (u.active) {
            count++
          }
          if (dimension.id === u.id && u.childs) {
            u.childs.map(c => {
              c.active = dimension.active
            })
            count += u.childs.length
          } else {
            let cCount = 0
            let isChild = false
            u.childs.map(c => {
              if (c.active) {
                count++
                cCount++
              }
              if (dimension.id === c.id) {
                isChild = true
              }
            })

            if (isChild) {
              if (u.childs && cCount === u.childs.length) {
                u.active = true
                count++
              } else {
                u.active = false
                count--
              }
            }
          }
          total += u.childs ? u.childs.length : 0
          total++
          return u
        })
        this.all = count === total
      }
    }
  }
</script>
