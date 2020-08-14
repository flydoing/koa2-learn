<template>
  <page title="上课地点">
    <div v-for="(item,i) in list" :key="i">
      <div class="category-title" v-html="item.name"></div>
      <item v-for="(place,j) in item.places" :key="j" @click="handleSelect(place)">
        <div slot="main" v-html="place.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapActions } from 'vuex'

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
    computed: {},
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        const that = this
        GroupApi.getSchoolPlaces(that.currentGroup.parentId).then(res => {
          if (Check.isRealArray(res.places)) {
            let obj = {}
            res.places.map(v => {
              if (obj[v.cid || v.categoryId]) {
                obj[v.cid || v.categoryId].places.push(v)
              } else {
                obj[v.cid || v.categoryId] = {
                  name: v.cname || v.placeCategoryName,
                  places: [v]
                }
              }
            })
            for (let p in obj) {
              that.list.push(obj[p])
            }
          }
        })
      },
      handleSelect(item, gIndex, cIndex) {
        this.setSelection({ place: item })
        this.routeBack()
      }
    }
  }

</script>
