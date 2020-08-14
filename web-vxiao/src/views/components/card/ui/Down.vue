<template>
  <div class="drop-down"
       @click.stop>
    <el-dropdown trigger="click"
                 placement="bottom">
      <div>
        <span class="card-top-text"
              v-if="isCancelTop">置顶</span>
        <i class="ico ico-down"></i>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <slot name="dropItem">
          <el-dropdown-item v-if="isTop"
                            @click.native.stop="top">置顶</el-dropdown-item>
          <el-dropdown-item v-if="isCancelTop"
                            @click.native.stop="cancel">取消置顶</el-dropdown-item>
          <slot name="remove">
            <el-dropdown-item v-if="isRemove"
                              @click.native.stop="remove">删除</el-dropdown-item>
          </slot>
          <el-dropdown-item v-if="isForward"
                            @click.native.stop="forward">转发</el-dropdown-item>
          <el-dropdown-item v-if="isPortal"
                            @click.native.stop="onPortal">推荐到门户</el-dropdown-item>
          <el-dropdown-item v-if="isVScreen"
                            @click.native.stop="vscreen">推荐到班牌</el-dropdown-item>
          <el-dropdown-item v-if="isForwardPublic"
                            @click.native.stop="onForward">转发至公众号</el-dropdown-item>
          <el-dropdown-item v-if="isAccusation"
                            @click.native.stop="accusation">举报</el-dropdown-item>
          <slot></slot>
        </slot>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
    props: {
      m: { type: [Object] }
    },
    computed: {
      app() {
        return this.getAppByType(this.m.type, this.m.groupId) || {}
      },
      isTop() {
        return this.m.isTop !== 1
      },
      isCancelTop() {
        return !this.isTop
      },
      isRemove() {
        return this.m.fromUserId === this.userId || this.isAdmin || this.isSuperAdmin || this.isAppAdmin(this.m.type)
      },
      isAccusation() {
        return this.m.fromUserId !== this.userId
      },
      isForward() {
        return this.app.isForward !== 0 && this.app.isForward !== undefined
      },
      isForwardPublic() {
        return this.app.relation && this.app.relation.recommend === '3'
      },
      isPortal() {
        return this.m.type === '1068' && this.app.recommend === '2'
      },
      isVScreen() {
        if (this.m.medias) {
          return (
            this.m.type === '1068' &&
            this.app.recommend === '1' &&
            this.m.medias.filter(media => {
              return media.type === 'photo'
            }).length > 0
          )
        }
        return false
      }
    },
    methods: {
      ...mapActions(['modifyMessage']),
      top() {
        this.routePushModel({
          path: '/vx/group/business/settop',
          query: {
            msgId: this.m.id
          }
        })
      },
      cancel() {
        this.modifyMessage({
          id: this.m.id,
          groupId: this.m.groupId,
          isTop: 0
        })
      },
      remove() {
        const that = this
        this.$confirm('确定删除该消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .modifyMessage({
              ...this.m,
              status: 'd'
            })
            .then(res => {
              that.$message({ type: 'success', message: '删除成功' })
            })
        })
      },
      forward() {
        this.setStorage('_cache_forward_message', this.m)
        this.routePushModel({
          path: '/vx/group/business/forward'
        })
      },
      onForward() {
        MessageApi.forwardToWechatSubscription(this.m.groupId, {
          messages: [{ id: this.m.id }]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
        // this.routePushModel({
        //   path: '/vx/group/business/subscription',
        //   query: {
        //     msgId: this.m.id
        //   }
        // })
      },
      onPortal() {},
      vscreen() {},
      accusation() {
        this.routePushModel({
          path: '/vx/group/business/complaints',
          query: {
            msgId: this.m.id
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .card-top {
    &-text {
      font-size: rem(12);
      padding-right: rem(5);
      color: nth($font-color, 7);
    }
  }
</style>
