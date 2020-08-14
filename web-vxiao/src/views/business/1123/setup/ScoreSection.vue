<template>
  <page title="分数段"
        hasSubmit
        @submit="commitScoreSection">
    <div class="category-title">设置联考报表的分数段统计</div>
    <item :hasClick="false">
      <div>自定义</div>
      <input type="text"
             placeholder="输入分数"
             v-model="score"
             slot="remark">
    </item>
    <item v-for="(item, i) in sections"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active': item.selected}"></i>
      </div>
      <div v-html="item.value"></div>
    </item>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        score: '',
        sections: [
          {
            value: '5分一段',
            key: 5
          },
          {
            value: '10分一段',
            key: 10
          },
          {
            value: '15分一段',
            key: 15
          },
          {
            value: '20分一段',
            key: 20
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        exam: 'getExam'
      })
    },
    created() {
      let custom = true
      let score = this.exam.setting.sectionScore
      this.sections.map(v => {
        v.selected = v.key === score
        if (v.selected) {
          custom = false
        }
        return v
      })
      if (custom) {
        this.score = score
      }
    },
    methods: {
      ...mapActions(['setExam']),
      handleSelect(item) {
        this.sections = this.sections.map(v => {
          if (v.key === item.key) {
            v.selected = !item.selected
          } else {
            v.selected = false
          }
          return v
        })
      },
      handleSubmit() {
        let score = this.score
        if (Check.isNullString(score)) {
          score = this.sections.filter(v => {
            return v.selected
          })[0].key
        }
        this.setExam({ setting: { ...this.exam.setting, sectionScore: score } })
        this.routeBack()
      }
    }
  }
</script>
