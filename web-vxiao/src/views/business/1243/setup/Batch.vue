<template>
  <Page title="批量绑定">
    <label slot="btn" @click="next">下一步</label>
    <Item v-for="g in groups" :key="g.groupId" @click="handle(g)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':!!checkList[g.id]}"></i>
      </div>
      <div>{{g.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        groups: [],
        checkList: {}
      }
    },
    created() {
      Api.getGroupsVCards(this.currentGroup.groupId).then(res => {
        this.groups = res.groups || []
      })
    },
    methods: {
      next() {
        let _check = Object.keys(this.checkList)
        if (_check.length === 0) {
          this.$message({
            type: 'warning',
            message: '请先选择需要绑定的班群'
          })
          return
        }
        let ids = _check.join(',')
        this.$import({
          title: '批量绑定',
          uploadURI: this.uploadURL,
          templateUrl: `/terminal/answercard/download/excel/template?classIds=${ids}`,
          callback: (res, file) => {
            Api.batchUpload(this.currentGroup.parentId, this.userId, res.file.id).then(res => {
              this.$message({ type: 'success', message: '批量绑定成功' })
              this.routeBack()
            })
          }
        })
      },
      handle(g) {
        this.checkList[g.id] ? this.$delete(this.checkList, g.id) : this.$set(this.checkList, g.id, g)
      }
    }
  }

</script>
