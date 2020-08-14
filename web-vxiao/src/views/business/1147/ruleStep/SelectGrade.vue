<template>
  <page title="固定安排选修科目"
        @submit="handleSubmit"
        hasSubmit>
    <item label="全年级"
          @click="handleAll">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)"
          :label="itemTxt(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import Api from '../api'

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
        obj: 'getCreateObject'
      }),
      all() {
        if (Check.isRealArray(this.list)) {
          let items = this.list.filter(v => {
            return v.selected
          })
          return items.length === this.list.length
        }
        return false
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      itemTxt(data) {
        return `${data.campus}${data.name}`
      },
      fetchData() {
        let grades = JSON.parse(JSON.stringify(this.obj.form.modelData.datas))
        this.list = grades.map(v => {
          v.selected = false
          return v
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)
      },
      handleAll() {
        let all = this.all
        this.list = this.list.map(v => {
          v.selected = !all
          return v
        })
      },
      handleSubmit() {
        let form = this.obj.form
        let data = form.ruleData
        let grades = this.list.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(grades)) {
          this.$message({ message: '请选择年级', type: 'warning' })
          return false
        }

        Api.setRuleInfo({
          rule: {
            type: '3',
            scheduleId: form.schedule.id,
            sections: data.rules.map(v => {
              return {
                dayIndex: v.dayIndex,
                sectionIndex: v.sectionIndex
              }
            }),
            datas: grades.map(v => {
              return {
                extension: `${v.campus}${v.name}选修`,
                key: v.groupId,
                obj: v.name
              }
            })
          }
        }).then(res => {
          this.setCreateObject({
            form: {
              ...form,
              ruleData: {
                ...data,
                rules: []
              }
            }
          })
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack(-2)
        })
      }
    }
  }
</script>
