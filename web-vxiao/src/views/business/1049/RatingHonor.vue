<template>
  <page title="班级荣誉">
    <div class="pd">
      <MedalList :list="list" :editHandle="honorEdit" v-on:add="honorAdd" :removeHandle="honorRemove" mode="default"></MedalList>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  data() {
    return { list: [] }
  },
  created() {
    Api.loadHonorList(this.currentGroup.groupId).then(res => {
      this.list = res.categorys.map(v => {
        v.isRemove = false
        return v
      })
    })
  },
  components: {
    MedalList: resolve => require(['@/views/components/medal/MedalList'], resolve)
  },
  computed: {
    ...mapGetters({
      rating: 'getRating'
    })
  },
  methods: {
    ...mapActions(['setRating']),
    dayAndWeekHonors() {
      let dayHonors = []
      let weekHonors = []
      this.list.map(v => {
        if (v.value === '0') {
          dayHonors = v.childs || []
        }
        if (v.value === '1') {
          weekHonors = v.childs || []
        }
      })
      return {
        dayHonors: dayHonors,
        weekHonors: weekHonors
      }
    },
    honorAdd(dimension) {
      let h = this.dayAndWeekHonors()
      this.setRating({ dayHonors: h.dayHonors, weekHonors: h.weekHonors, honor: null, cache: null })
      this.routePush({
        name: 'honorEdit1049',
        query: {
          pId: dimension.id,
          type: dimension.value
        }
      })
    },
    honorRemove(dimension, honor, index, pIndex) {
      let that = this
      Api.commitHonorData({
        id: honor.id,
        status: 'd',
        groupId: that.currentGroup.groupId
      }).then(res => {
        that.list[pIndex].childs.splice(index, 1)
        that.$message({ message: '操作成功', type: 'success' })
      })
    },
    honorEdit(dimension, honor, index, pIndex) {
      let h = this.dayAndWeekHonors()
      this.setRating({ dayHonors: h.dayHonors, weekHonors: h.weekHonors, cache: honor, honor: null })
      this.routePush({
        name: 'honorEdit1049',
        query: {
          pId: dimension.id,
          type: dimension.value
        }
      })
    }
  }
}

</script>
