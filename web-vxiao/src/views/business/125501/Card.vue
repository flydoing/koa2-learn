<template>
  <Card :message="message">
    <template slot="avatar">
      <img class="avatar"
           v-lazy="{src:url(message.fromUserAvatar),error:Image.ICO_AVATAR}"
           alt='头像' />
    </template>
    <CardDown slot="down"
              :m="message">
      <template slot="dropItem">
        <el-dropdown-item v-if="isAdmin || isTeacher"
                          @click.native.stop="handleShield">屏蔽</el-dropdown-item>
        <el-dropdown-item v-if="isRemove"
                          @click.native.stop="handleRemove">删除</el-dropdown-item>
      </template>
    </CardDown>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      isRemove() { return this.m.fromUserId === this.userId || this.isAdmin || this.isSuperAdmin || this.isAppAdmin(this.m.type) }
    },
    methods: {
      handleShield() {
        this.$emit('shield')
      },
      handleRemove() {
        const that = this
        that.$confirm('确定删除该消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.modifyMessage({
            ...this.m,
            status: 'd'
          })
          that.$message({ type: 'success', message: '删除成功' })
        })
      }
    }
  }

</script>
