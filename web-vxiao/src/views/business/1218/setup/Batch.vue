<template>
  <Page title="批量绑定">
    <label slot="btn" @click="next">下一步</label>
    <Item @click="all=!all">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':all}"></i>
      </div>
      <div>全选</div>
    </Item>
    <div v-for="(v,k) in groups" :key="k">
      <div class="category-title">{{v.key}}</div>
      <Item v-for="g in v.items" :key="g.groupId" @click="handle(g)">
        <div slot="before">
          <i class="ico ico-select" :class="{'active':!!checkList[g.groupId]}"></i>
        </div>
        <div>{{g.name}}</div>
      </Item>
    </div>
  </Page>
</template>
<script>
  import GroupApi from '@/api/group'
  import Api from '../api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        allGroups: [],
        groups: [],
        checkList: {},
        all: false
      }
    },
    created() {
      GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
        this.allGroups = [...res.classes, ...res.groups]
        this.groups.push({ key: '班级', items: res.classes })
        this.groups.push({ key: '部门', items: res.groups })
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
          uploadURI: `${this.$store.state.FILE_URL}/readExcel`,
          templateUrl: `/terminal/vbracelet/exportTemplate/${this.currentGroup.parentId}?classIds=${ids}`,
          callback: (res, file) => {
            if (Check.isRealArray(res.dataGirds) && Check.isRealArray(res.dataGirds[0].data)) {
              let data = res.dataGirds[0].data
              data.shift()
              Api.batchImport({
                dataJson: JSON.stringify(data),
                schoolId: this.currentGroup.parentId
              }).then(res => {
                if (res.errorMsg) {
                  this.$message({
                    type: 'warning',
                    message: res.errorMsg
                  })
                }
              })
            }
          }
        })
      },
      handle(g) {
        this.checkList[g.groupId] ? this.$delete(this.checkList, g.groupId) : this.$set(this.checkList, g.groupId, g)
      }
    },
    watch: {
      all(v) {
        if (v) {
          this.allGroups.forEach(g => {
            this.$set(this.checkList, g.groupId, g)
          })
        } else { this.checkList = {} }
      }
    }
  }

</script>
