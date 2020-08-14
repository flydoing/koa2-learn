<template>
  <page title="导出成绩">
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
      <item v-for="(grade,j) in item.groups"
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
    <div class="button button-common"
         @click="handleExport">导出</div>
  </page>
</template>
<script>
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
    computed: {},
    methods: {
      fetchData() {
        const that = this
        Api.getSchoolGrades(this.currentGroup.parentId).then(res => {
          that.list = res.groups.map(v => {
            v.groups = v.groups.map(g => {
              g.selected = false
              return g
            })
            return v
          })
        })
      },
      handleSelect(item, i, j) {
        let count = 0
        let total = 0
        this.list = this.list.map(v => {
          total += v.groups.length
          v.groups = v.groups.map(g => {
            if (item.id === g.id) {
              g.selected = !item.selected
            }
            if (g.selected) {
              count++
            }
            return g
          })
          return v
        })

        this.all = count === total
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(v => {
          v.groups = v.groups.map(g => {
            g.selected = this.all
            return g
          })
          return v
        })
      },
      handleExport() {
        let gradeIds = []
        this.list.filter(v => {
          v.groups.map(g => {
            if (g.selected) {
              gradeIds.push(g.groupId)
            }
          })
        })
        this.openBrowser(`/rest/physical/export/score.json?schoolId=${this.currentGroup.parentId}&gradeIds=${gradeIds.join(',')}`)
      }
    }
  }
</script>
