<template>
  <page title="选择适用范围"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>
    </item>
    <div v-for="(campus,i) in list"
         :key="i"
         :campus="campus">
      <div class="category-title text"
           v-html="campus.name"></div>
      <div v-for="(grade,j) in campus.grades"
           :key="j"
           :grade="grade">
        <item @click="handleSelect(grade, j)"
              :hasArrow="false">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':grade.active}"></i>
          </div>
          <div slot="main"
               v-html="grade.name"></div>
        </item>
        <item v-for="(cls,k) in grade.classes"
              :key="k"
              :cls="cls"
              :hasArrow="false"
              @click="handleSelect(cls, k)">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':cls.active}"></i>
          </div>
          <div slot="main"
               v-html="cls.name"></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import Api from './api'

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
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      initData() {
        const that = this

        let rMap = new Map()
        let caches = that.rating.honor.ranges
        if (Check.isRealArray(caches)) {
          caches.map(c => {
            rMap.set(c.groupId, c)
          })
        }

        let total = 0
        let count = 0
        that.list = that.list.map(r => {
          r.grades.map(g => {
            let avCount = 0
            g.classes.map(c => {
              if (rMap.get(c.groupId)) {
                c.active = true
                avCount++
              } else {
                c.active = false
              }
            })
            if (avCount === g.classes.length) {
              g.active = true
            } else {
              g.active = false
            }
            count += avCount
            total += g.classes.length
          })
          return r
        })

        that.all = count === total
      },
      fetchData() {
        const that = this
        Api.loadHonorRangeData(that.currentGroup.groupId).then(res => {
          that.list = res.groups
          that.initData()
        })
      },
      handleSubmit() {
        let rs = []
        let total = 0
        this.list.map(function(r) {
          r.grades.map(g => {
            g.classes.map(c => {
              if (c.active === true) {
                rs.push(c)
              }
            })
            total += g.classes.length
          })
        })
        if (rs.length < 1) {
          this.$message({ message: '请选择适用范围', type: 'warning' })
          return false
        }
        this.setRating({ honor: { ...this.rating.honor, ranges: rs, rangeTxt: rs.length === total ? '所有校区' : `共${rs.length}个班` } })
        this.routeBack()
      },
      handleSelect(range, index) {
        range.active = !range.active

        let count = 0
        let total = 0
        this.list = this.list.map(r => {
          r.grades.map(g => {
            if (g.active) {
              count++
            }

            if (range.groupId === g.groupId) {
              g.classes.map(c => {
                c.active = range.active
              })
              count += g.classes.length
            } else {
              let cCount = 0
              let isClass = false
              g.classes.map(c => {
                if (c.active) {
                  count++
                  cCount++
                }
                if (range.id === c.id) {
                  isClass = true
                }
              })

              if (isClass) {
                if (cCount === g.classes.length) {
                  g.active = true
                  count++
                } else {
                  g.active = false
                  count--
                }
              }
            }
            total += g.classes ? g.classes.length : 0
            total++
          })
          return r
        })
        this.all = count === total
      },
      handleAll() {
        this.all = !this.all

        let all = this.all
        this.list = this.list.map(r => {
          r.grades.map(g => {
            g.active = all
            g.classes.map(c => {
              c.active = all
            })
          })
          return r
        })
      }
    }
  }
</script>
