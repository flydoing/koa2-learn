<template>
  <page title="选择勋章">
    <div class="pd">
      <MedalList :list="list"
                 :editHandle="medalEdit"
                 mode="simple"></MedalList>
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
      return {
        list: [],
        isRating: parseInt(this.routeQuery('isRating'))
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      MedalList: resolve => require(['@/views/components/medal/MedalList'], resolve)
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        if (that.evaluate.dimension.description === '3') {
          Api.loadRatingMedalData(that.currentGroup.groupId).then(res => {
            that.list = res.categorys
          })
        } else {
          Api.loadSpeedMedalData(that.currentGroup.groupId).then(res => {
            that.list = res.categorys
          })
        }
      },
      medalEdit(dimension, medal, index, pIndex) {
        const that = this

        let dim = that.evaluate.dimension
        let md = {
          ...medal,
          groupId: that.groupId,
          categoryJson: medal.id
        }

        delete md.id
        delete md.value
        that.isClass && (md.userId = that.userId)
        dim.description === '3' ? (md.msgCount = '3') : (md.msgCount = '1')

        Api.commitMedalData({ category: md }).then(res => {
          if (res.code === '1') {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          }
        })
      }
    }
  }
</script>
