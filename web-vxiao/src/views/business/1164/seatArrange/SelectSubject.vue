<template>
  <page title="选择参考科目"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
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

        let caches = that.arrange.subjects
        let sMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            sMap.set(v.id, v)
          })
        }

        CategoryApi.getCategorys({
          type: '1',
          isDefault: '1',
          groupId: this.groupId
        }).then(res => {
          that.list = res.categorys.filter(v => {
            v.selected = false
            return Check.isNullObject(sMap.get(v.id))
          })
        })
      },
      handleSubmit() {
        let subjects = this.list.filter(v => {
          return v.selected
        })

        if (!Check.isRealArray(subjects)) {
          this.$message({ message: '请选择参考科目', type: 'warning' })
          return false
        }

        this.setArrangeExam({ subjects: subjects })
        this.routeBack()
      },
      handleSelect(item, i) {
        item.selected = !item.selected
      }
    }
  }
</script>
