<template>
  <page title="额外权限" @submit="handleSubmit" hasSubmit>
    <div class="category-title text">班主任额外增加每月颁发分数</div>
    <item v-for="(item, i) in list" :key="i" :hasClick="false">
      <div slot="main" v-html="item.name"></div>
      <div slot="after">
        <input placeholder="无限制" v-model="item.score" />
      </div>
    </item>
    <div class="button button-common" @click="handleEmpty">清空</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

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
      fetchData() {
        Api.getExtraAuthList(this.currentGroup.parentId).then(res => {
          if (res.extras) {
            this.list = res.extras
          }
        })
      },
      commitData(datas, callback) {
        Api.saveExtraScore(datas).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          callback && callback()
        })
      },
      handleEmpty() {
        let datas = this.list.map(v => {
          return { ...v, score: 0, schoolId: this.currentGroup.parentId }
        })
        this.commitData(datas, () => {
          this.list = datas
        })
      },
      handleSubmit() {
        let datas = this.list.map(v => {
          return { ...v, schoolId: this.currentGroup.parentId }
        })
        this.commitData(datas)
      }
    }
  }

</script>
