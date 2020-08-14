<template>
  <Setup appType="'1141'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1141'))"
              slot="others">
      <item @click="prizeList">
        <div slot="main">奖品列表</div>
      </item>
      <item @click="handleLimit"
            label="每学期每人兑奖数量限制"
            :remark="limitMeta.obj">
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        limitMeta: {}
      }
    },
    computed: {},
    created() {
      Api.getExchangeLimitMeta(this.schoolId).then(res => {
        if (res.metaDatas) {
          this.limitMeta = res.metaDatas[0]
        }
      })
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      prizeList() {
        this.routePush({ name: 'prizeList1141' })
      },
      convertRecord() {
        this.routePush({ name: 'convertRecord1141' })
      },
      handleLimit() {
        this.$prompt(' ', '每学期每人兑奖数量限制', {
          inputValue: this.limitMeta.obj || '',
          inputPlaceholder: '数量',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (!Check.isNumber(value) || value < 0) {
            this.$message({ message: '请输入大于等于0的整数数值', type: 'warning' })
            return false
          }
          this.modifyMetaData({
            ...this.limitMeta,
            metaType: 'm_prize_exchange_limit_per_season',
            obj: parseInt(value),
            userId: this.schoolId
          }).then(res => {
            this.limitMeta = res.metaDatas[0]
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      }
    }
  }
</script>
