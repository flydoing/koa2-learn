<template>
  <page title="适用范围"
        @submit="handleSubmit"
        hasSubmit>
    <item label="全选"
          @click="handleAll">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <item v-for="(item,i) in list"
          :key="i"
          :item="item"
          @click="handleSelect(item, i)"
          :hasArrow="false"
          :label="item.name">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
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
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      all() {
        if (Check.isRealArray(this.list)) {
          let ranges = this.list.filter(v => {
            return v.selected
          })
          return this.list.length === ranges.length
        }
        return false
      }
    },
    methods: {
      ...mapActions(['setRating']),
      fectchData() {
        GroupApi.getSchoolCampus(this.currentGroup.parentId).then(res => {
          if (Check.isRealArray(this.rating.ranges)) {
            let rMap = new Map()
            this.rating.ranges.map(v => {
              rMap.set(v.groupId, v)
            })
            this.list = res.groups.map(v => {
              v.selected = Check.isObject(rMap.get(v.groupId))
              return v
            })
          } else {
            this.list = res.groups.map(v => {
              v.selected = true
              return v
            })
          }
        })
      },
      handleSubmit() {
        if (this.all) {
          this.setRating({ ranges: [] })
        } else {
          let ranges = this.list.filter(v => {
            return v.selected
          })
          this.setRating({ ranges: ranges })
        }
        this.routeBack()
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
      }
    }
  }
</script>
