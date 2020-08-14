<template>
  <page title="总结范围"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll">
      <div slot="before"
           :hasArrow="false">
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
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        summary: 'getApslSummary'
      })
    },
    methods: {
      ...mapActions(['setApslSummary']),
      fetchData() {
        const that = this

        let caches = that.summary.ranges
        let rMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            rMap.set(v.id, v)
          })
        }

        Api.loadRangeList(this.currentGroup.parentId).then(res => {
          let total = 0
          that.list = res.groups.map(v => {
            if (v.grades) {
              v.grades = v.grades.map(g => {
                g.selected = Check.isObject(rMap.get(g.id))
                return g
              })
              total += v.grades.length
            }
            return v
          })
          that.all = caches.length === total
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
        let grades = []
        this.list.map(v => {
          if (v.grades) {
            let gs = v.grades.filter(g => {
              return g.selected
            })
            grades.push(...gs)
          }
        })
        this.setApslSummary({ ranges: grades })
        this.routeBack()
      }
    }
  }
</script>
