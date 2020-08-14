<template>
  <page title="适选班级"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title"
           v-html="item.name"></div>
      <item v-for="(cls,j) in item.classes"
            :key="j"
            :hasArrow="false"
            @click="handleSelect(cls, i, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':cls.selected}"></i>
        </div>
        <div slot="main"
             v-html="cls.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
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
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        const that = this
        let cMap = new Map()
        if (Check.isRealArray(that.selection.classes)) {
          that.selection.classes.map(v => {
            cMap.set(v.groupId, v)
          })
        }

        if (Check.isRealArray(that.selection.grades)) {
          let gradeIds = that.selection.grades
            .map(v => {
              return v.groupId
            })
            .join(',')
          GroupApi.getAdministrativeClasses(gradeIds).then(res => {
            if (Check.isRealArray(res.classes)) {
              let obj = {}
              res.classes.map(v => {
                v.selected = Check.isObject(cMap.get(v.groupId))
                if (obj[v.gradeId]) {
                  obj[v.gradeId].classes.push(v)
                } else {
                  obj[v.gradeId] = {
                    name: v.description,
                    classes: [v]
                  }
                }
              })
              for (let p in obj) {
                that.list.push(obj[p])
              }
            }
          })
        }
      },
      handleSelect(item, gIndex, cIndex) {
        item.selected = !item.selected
        this.$set(this.list[gIndex].classes, cIndex, item)
      },
      handleSubmit() {
        let classes = []
        this.list.map(v => {
          let cs = v.classes.filter(c => {
            return c.selected
          })
          classes.push(...cs)
        })
        if (!Check.isRealArray(classes)) {
          this.$message({ type: 'warning', message: '请选择适选班级' })
          return false
        }
        this.setSelection({ classes: classes })
        this.routeBack()
      }
    }
  }
</script>
