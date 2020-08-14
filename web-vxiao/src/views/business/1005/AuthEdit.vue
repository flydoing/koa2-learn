<template>
  <page title="编辑权限设置"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false">
      <div slot="main">每月</div>
      <div slot="after">
        <input placeholder="无限制"
               v-model="monthScore" />
      </div>
    </item>
    <item :hasClick="false">
      <div slot="main">每周</div>
      <div slot="after">
        <input placeholder="无限制"
               v-model="weekScore" />
      </div>
    </item>
    <item :hasClick="false">
      <div slot="main">每日</div>
      <div slot="after">
        <input placeholder="无限制"
               v-model="dayScore" />
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        weekScore: '',
        dayScore: '',
        monthScore: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        let auth = this.evaluate.auth
        if (auth) {
          this.weekScore = auth.weekScore
          this.dayScore = auth.dayScore
          this.monthScore = auth.monthScore
        }
      },
      handleSubmit() {
        const that = this
        let auth = this.evaluate.auth

        let params = {
          evaluationCategoryId: auth.evaluationCategoryId,
          categoryParentId: auth.categoryParentId,
          monthScore: that.monthScore,
          weekScore: that.weekScore,
          dayScore: that.dayScore
        }

        if (auth.batch) {
          Api.commitBatchAuthData(that.currentGroup.groupId, params).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        } else {
          auth.id && (params.id = auth.id)
          Api.commitAuthData(that.currentGroup.groupId, {
            dutyCategoryId: auth.dutyCategoryId,
            ...params
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        }
      }
    }
  }
</script>
