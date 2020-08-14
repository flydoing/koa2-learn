<template>
  <Setup>
    <div slot="others"
         v-if="isOrg && (isSuperAdmin || isAdmin || isAppAdmin('10041'))">
      <item @click="goodsType"
            label="分类管理">
      </item>
      <item @click="goodsManage"
            label="商品管理">
      </item>
      <!-- <item @click="goodsManage"
            label="订单管理">
      </item>
      <item @click="advertise"
            label="广告推广">
      </item> -->
    </div>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    created() {},
    computed: {},
    methods: {
      goodsType() {
        this.routePush({ name: 'goodsTypes10041' })
      },
      goodsManage() {
        this.routePush({ name: 'goodsManage10041' })
      },
      advertise() {
        this.$message.warning('开发人员正在努力开发中....')
      }
    }
  }
</script>
