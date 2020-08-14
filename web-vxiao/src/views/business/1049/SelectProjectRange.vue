<template>
  <page title="适用范围"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main"
           style="padding-left:0px;">全选</div>
    </item>
    <div class="category-title text"></div>
    <div v-for="(item,i) in list"
         :key="i"
         :item="item">
      <item @click="handleSelect(item, i)"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.active}"></i>
        </div>
        <div slot="main"
             v-html="rangeTxt(item, i + 1, null)"></div>
      </item>
      <item v-for="(grade,j) in item.grades"
            :key="j"
            :grade="grade"
            :hasArrow="false"
            @click="handleSelect(grade, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':grade.active}"></i>
        </div>
        <div slot="main"
             v-html="rangeTxt(grade, j + 1, i + 1)"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
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
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      rangeTxt(item, index, pIndex) {
        if (pIndex) {
          return `${pIndex}.${index} ${item.name}`
        }
        return `${index} ${item.name}`
      },
      fectchData() {
        const that = this
        Api.loadRangeData(that.currentGroup.groupId).then(res => {
          that.list = res.groups
          that.initRange(that.rating.project.ranges)
        })
      },
      initRange(caches) {
        let rMap = new Map()
        let count = 0
        let total = 0
        if (Check.isRealArray(caches)) {
          caches.map(r => {
            rMap.set(r.groupId, r)
          })
          if (Check.isRealArray(this.list)) {
            this.list = this.list.map(r => {
              if (rMap.get(r.groupId)) {
                r.active = true
                count++
              } else {
                r.active = false
              }
              r.grades.map(g => {
                if (rMap.get(g.groupId)) {
                  g.active = true
                  count++
                } else {
                  g.active = false
                }
              })
              total += r.grades.length
              total++
              return r
            })
            if (count === total) {
              this.all = true
            }
          }
        } else {
          if (Check.isRealArray(this.list)) {
            this.list = this.list.map(r => {
              r.active = true
              r.grades.map(g => {
                g.active = true
              })
              return r
            })
            this.all = true
          }
        }
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(r => {
          r.active = this.all
          r.grades.map(g => {
            g.active = this.all
          })
          return r
        })
      },
      handleSubmit() {
        let count = 0
        let total = 0
        let caches = []
        let campuses = [] // 选中校区
        let cGrades = [] // 校区选中年级
        let sGrades = [] // 所有选中年级
        let p = this.rating.project

        this.list.map(r => {
          if (r.active) {
            count++
            count += r.grades.length
            cGrades.push(...r.grades)
            sGrades.push(...r.grades)
            campuses.push(r)
            caches.push(r, ...r.grades)
          } else {
            r.grades.map(g => {
              if (g.active) {
                count++
                sGrades.push(g)
                caches.push(g)
              }
            })
          }
          total += r.grades.length
          total++
        })

        if (caches.length < 1) {
          this.$message({ message: '请选择适用范围', type: 'warning' })
        }

        if (count === total) {
          p.rangeTxt = '所有校区'
        } else {
          if (cGrades.length !== sGrades.length) {
            p.rangeTxt = `${sGrades.length}个年级`
          } else {
            p.rangeTxt = campuses
              .map(c => {
                return c.name
              })
              .join('、')
          }
        }
        p.ranges = caches
        this.setRating({ project: p })
        this.routeBack()
      },
      handleSelect(item) {
        item.active = !item.active

        let count = 0
        let total = 0
        this.list = this.list.map(r => {
          if (r.active) {
            count++
          }

          if (item.id === r.id && r.grades) {
            r.grades.map(g => {
              g.active = item.active
            })
            count += r.grades.length
          } else {
            let gCount = 0
            let isGrade = false
            r.grades.map(g => {
              if (g.active) {
                count++
                gCount++
              }
              if (item.id === g.id) {
                isGrade = true
              }
            })

            if (isGrade) {
              if (r.grades && gCount === r.grades.length) {
                r.active = true
                count++
              } else {
                r.active = false
                count--
              }
            }
          }
          total += r.grades ? r.grades.length : 0
          total++
          return r
        })
        this.all = count === total
      }
    }
  }
</script>
