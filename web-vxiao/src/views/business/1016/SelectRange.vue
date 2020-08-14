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
    <div class="category-title text">群组</div>
    <item v-for="(group,i) in groups"
          :key="i"
          @click="handleSelect(group, i)"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':group.active}"></i>
      </div>
      <div slot="main"
           v-html="group.name"></div>
    </item>
    <div v-for="(campus,i) in campuses"
         :key="i">
      <div class="category-title text"
           v-html="campus.name"></div>
      <div v-for="(grade,j) in campus.grades"
           :key="j">
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
              @click="handleSelect(cls, k)"
              :hasArrow="false">
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
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    data() {
      return {
        campuses: [],
        groups: [],
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        notice: 'getNotice'
      })
    },
    methods: {
      ...mapActions(['setNotice']),
      initData() {
        const that = this

        let rMap = new Map()
        let caches = that.notice.ranges
        if (Check.isRealArray(caches)) {
          caches.map(c => {
            rMap.set(c.groupId, c)
          })
        }

        let total = 0
        let count = 0
        that.campuses = that.campuses.map(r => {
          r.grades.map(g => {
            let avCount = 0
            g.classes.map(c => {
              if (!Check.isRealArray(caches)) {
                c.active = true
                avCount++
              } else if (rMap.get(c.groupId)) {
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

        that.groups = that.groups.map(v => {
          if (!Check.isRealArray(caches)) {
            v.active = true
            count++
          } else if (rMap.get(v.groupId)) {
            v.active = true
            count++
          } else {
            v.active = false
          }
          return v
        })

        total += that.groups.length

        that.all = count === total
      },
      fetchData() {
        const that = this
        GroupApi.getSchoolGroupTree(that.currentGroup.parentId).then(res => {
          that.campuses = res.campuses
          that.groups = res.groups
          that.initData()
        })
      },
      handleSubmit() {
        let rs = []
        let total = 0

        this.campuses.map(r => {
          r.grades.map(g => {
            g.classes.map(c => {
              c.active && rs.push(c)
            })
            total += g.classes.length
          })
        })

        this.groups.map(v => {
          v.active && rs.push(v)
        })

        total += this.groups.length

        if (rs.length < 1) {
          this.$message({ message: '请选择适用范围', type: 'warning' })
          return false
        }

        this.setNotice({ ranges: rs.length === total ? [] : rs })
        this.routeBack()
      },
      handleSelect(range, index) {
        range.active = !range.active

        let count = 0
        let total = 0
        this.campuses = this.campuses.map(r => {
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

        this.groups = this.groups.map(v => {
          if (range.groupId === v.groupId) {
            v.active = range.active
          }
          if (v.active) {
            count++
          }
          return v
        })

        total += this.groups.length

        this.all = count === total
      },
      handleAll() {
        this.all = !this.all

        let all = this.all
        this.campuses = this.campuses.map(r => {
          r.grades.map(g => {
            g.active = all
            g.classes.map(c => {
              c.active = all
            })
          })
          return r
        })

        this.groups = this.groups.map(v => {
          v.active = all
          return v
        })
      }
    }
  }
</script>
