<template>
  <Page :title="box.name">
    <Box :allots="ruleAllots(allots)" @click="clickBox"></Box>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    components: {
      Box: resolve => require(['./Box'], resolve)
    },
    created() {
      this.schoolId = this.routeQuery('schoolId')
      const boxId = this.routeQuery('boxId')
      const that = this
      const loading = that.$loading({
        text: '加载中'
      })
      Api.loadStorageDetail(boxId).then(res => {
        loading.close()
        that.box = res.box
        that.allots = res.allots
      }).catch(res => {
        loading.close()
      })
    },
    data() {
      return {
        allots: [],
        box: {}
      }
    },
    methods: {
      clickBox(b) {
        const that = this
        const loading = that.$loading({
          text: '提交中',
          background: 'rgba(255, 255, 255, .3)'
        })
        Api.saveOrUpdateBox({
          allots: [{
            status: 1,
            ...b,
            ...that.$route.query
          }]
        }).then(res => {
          loading.close()
          if (Check.isRealArray(res.allots)) {
            that.$set(that.allots, b.boxnum - 1, res.allots[0])
            that.$message({
              message: that.isEdit ? '修改成功' : '添加成功',
              type: 'success'
            })
            that.routeBack()
          }
        }).catch(res => loading.close())
      },
      ruleAllots(allots) {
        const that = this
        return allots.map((item, i) => {
          return {
            ...{
              boxnum: i + 1,
              active: !Check.isNull(item.userId),
              boxcode: that.box.boxcode,
              boxName: that.box.name,
              schoolId: this.schoolId
            },
            ...item
          }
        })
      }
    },
    watch: {
      allots(s) {
        this.allots = s
      }
    }
  }

</script>
