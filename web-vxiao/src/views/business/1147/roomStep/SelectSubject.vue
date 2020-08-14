<template>
  <page title="科目限定"
        @submit="handleSubmit"
        hasSubmit>
    <item label="不限"
          @click="handleUnlimit"></item>
    <div class="category-title"></div>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)"
          :label="item.name">
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
  import CategoryApi from '@/api/category'

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
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let sMap = new Map()
        if (Check.isRealArray(this.obj.subjects)) {
          this.obj.subjects.map(v => {
            sMap.set(v.id, v)
          })
        }
        CategoryApi.getCategorys({ type: '1', groupId: this.groupId }).then(res => {
          that.list = res.categorys.map(v => {
            v.selected = Check.isObject(sMap.get(v.id))
            return v
          })
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)
      },
      handleSubmit() {
        let subjects = this.list.filter(v => {
          return v.selected
        })
        this.setCreateObject({ subjects: subjects })
        this.routeBack()
      },
      handleUnlimit() {
        this.setCreateObject({ subjects: [] })
        this.routeBack()
      }
    }
  }
</script>
