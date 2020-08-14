<template>
  <page title="选择参考年级"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item,i) in list"
         :key="i">
      <template v-if="item.datas.length>0">
        <div class="category-title text"
             v-html="item.name"></div>
        <item v-for="(grade,j) in item.datas"
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
      </template>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this

        let caches = that.arrange.form.grades
        let gMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            gMap.set(v.id, v)
          })
        }

        Api.getGrades(that.groupId).then(res => {
          that.list = res.datas.map(v => {
            v.datas = v.datas.filter(g => {
              g.campusName = v.name
              g.campusId = v.id
              g.selected = false
              return Check.isNullObject(gMap.get(g.id))
            })
            return v
          })
        })
      },
      handleSubmit() {
        let grades = []
        this.list.map(v => {
          let gs = v.datas.filter(g => {
            return g.selected
          })
          grades.push(...gs)
        })

        if (!Check.isRealArray(grades)) {
          this.$message({ message: '请选择参考年级', type: 'warning' })
          return false
        }

        this.setArrangeExam({ grades: grades })
        this.routeBack()
      },
      handleSelect(item, i, j) {
        item.selected = !item.selected
      }
    }
  }
</script>
