<template>
  <page :title="title" :hasClose="false">
    <item v-for="(v,i) in list" :key="i" :v="v" @click="handleSelect(v, i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':v.active}"></i>
      </div>
      <div slot="main" v-html="v.name"></div>
      <div slot="after"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      list: []
    }
  },
  created() {
    this.initData()
  },
  computed: {
    ...mapGetters({
      rating: 'getRating'
    }),
    title() {
      return this.rating.project ? '选择班级' : '选择项目'
    }
  },
  methods: {
    ...mapActions(['setRating']),
    initData() {
      this.list = this.rating.items.map(v => {
        if (this.rating.curItem && this.rating.curItem.id === v.id) {
          v.active = true
        } else {
          v.active = false
        }
        return v
      })
    },
    handleSelect(item, index) {
      this.setRating({ curItem: item })
      this.routeBack()
    }
  },
  watch: {}
}

</script>
<style scoped></style>
