<template>
  <page title="选择班级"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title"
           v-html="item.name"></div>
      <item v-for="(cls,j) in item.groups"
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
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
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
        inspection: 'getInspection'
      })
    },
    methods: {
      ...mapActions(['setInspection']),
      fetchData() {
        const that = this
        let cMap = new Map()
        let caches = that.inspection.classes
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            cMap.set(v.id, v)
          })
        }

        GroupApi.getSchoolClasses(this.currentGroup.parentId).then(res => {
          that.list = res.groups.map(v => {
            v.groups = v.groups.map(g => {
              g.selected = Check.isObject(cMap.get(g.id))
              return g
            })
            return v
          })
        })
      },
      handleSubmit() {
        let classes = []
        this.list.map(v => {
          let cs = v.groups.filter(g => {
            return g.selected
          })
          classes.push(...cs)
        })
        if (classes.length < 1) {
          this.$message({ message: '请选择适用范围', type: 'warning' })
          return false
        }
        this.setInspection({ classes: classes })
        this.routeBack()
      },
      handleSelect(item, index, cIndex) {
        item.selected = !item.selected
        this.$set(this.list[index].groups, cIndex, item)
      }
    }
  }
</script>
