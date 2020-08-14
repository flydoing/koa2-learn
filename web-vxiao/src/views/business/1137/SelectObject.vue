<template>
  <page title="面向群体"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全部</div>
    </item>
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item v-for="(grade,j) in item.grades"
            :key="j"
            :hasArrow="false"
            @click="handleSelect(grade, i, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':grade.selected}"></i>
        </div>
        <div slot="main"
             v-html="grade.name"></div>
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
        all: true
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        countdown: 'getCountdown'
      })
    },
    methods: {
      ...mapActions(['setCountdown']),
      fetchData() {
        const that = this

        let caches = that.countdown.objects
        Api.loadRangeList(this.currentGroup.parentId).then(res => {
          if (Check.isRealArray(caches)) {
            let oMap = new Map()
            caches.map(v => {
              oMap.set(v.id, v)
            })
            that.list = res.groups.map(v => {
              if (v.grades) {
                v.grades = v.grades.map(g => {
                  g.selected = Check.isObject(oMap.get(g.id))
                  return g
                })
              }
              return v
            })
          } else {
            that.list = res.groups.map(v => {
              if (v.grades) {
                v.grades = v.grades.map(g => {
                  g.selected = true
                  return g
                })
              }
              return v
            })
          }
        })
      },
      handleSelect(item, i, j) {
        item.selected = !item.selected
        this.$set(this.list[i].grades, j, item)
        let total = 0
        let count = 0
        this.list.map(v => {
          if (v.grades) {
            let gs = v.grades.filter(g => {
              return g.selected
            })
            count += gs.length
            total += v.grades.length
          }
        })
        this.all = count === total
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(v => {
          if (v.grades) {
            v.grades = v.grades.map(g => {
              g.selected = this.all
              return g
            })
          }
          return v
        })
      },
      handleSubmit() {
        if (this.all) {
          this.setCountdown({ objects: [] })
        } else {
          let grades = []
          this.list.map(v => {
            if (v.grades) {
              let gs = v.grades.filter(g => {
                return g.selected
              })
              grades.push(...gs)
            }
          })

          if (grades.length < 1) {
            this.$message({ message: '请选择面向群体', type: 'warning' })
            return false
          }
          this.setCountdown({ objects: grades })
        }
        this.routeBack()
      }
    }
  }
</script>
