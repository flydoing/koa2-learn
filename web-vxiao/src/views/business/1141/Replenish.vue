<template>
  <page title="补货"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasClick="false">
      <div slot="main"
           v-html="item.name"></div>
      <input slot="remark"
             placeholder="数量"
             v-model="item.count" />
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'

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
      typeTxt() {
        let type = this.types.filter(v => {
          return v.selected
        })[0]
        return type ? type.name : ''
      }
    },
    methods: {
      fectchData() {
        let that = this
        Api.getPrizeList(that.currentGroup.groupId).then(res => {
          that.list = res.prizes.map(v => {
            return { count: '', id: v.id, name: v.name }
          })
        })
      },
      handleSubmit() {
        const that = this

        let prizes = this.list.filter(v => {
          return !Check.isNullString(v.count)
        })
        if (!Check.isRealArray(prizes)) {
          that.$message({ message: '请输入补货数量', type: 'warning' })
          return false
        }

        let postData = prizes.map(v => {
          return { id: v.id, count: v.count }
        })
        Api.commitPrizeCount(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
