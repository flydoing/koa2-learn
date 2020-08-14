<template>
  <div class="vx-card-remind"
       v-if="remindList.length > 0">
    <div v-for="(remind,i) in remindList"
         :key="i">
      <Item v-if="i <= 2">
        <div class="create-text"
             @click.stop="handleCreate(remind, i)">{{remind.content}}</div>
        <div slot="after">
          <i class="ico ico-close"
             @click.stop="handleDelete(remind ,i)" />
        </div>
      </Item>
    </div>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/views/group/app/api'
  import * as Storage from '@/utils/storage'
  export default {
    mixins: [R],
    data() {
      return {
        remindList: []
      }
    },
    methods: {
      handleDelete(remind, i) {
        // 删除localstorage
        Storage.local.remove(`REMIND_${this.USER.id}_${remind.groupId}_${remind.msgType}`)
        this.remindList.splice(i, 1)
      },
      handleCreate(remind, i) {
        this.handleDelete(remind, i)
        this.routePushModel({
          path: '/vx/group/business/create/default',
          query: {
            appType: remind.msgType,
            groupId: remind.groupId
          }
        })
      },
      initRemindData() {
        this.remindList = []
        // 触发应用提示
        this.getGroupApps()
        const that = this
        setTimeout(function() {
          that.loadStorageMesasgesRemind()
        }, 100)
      },
      async loadStorageMesasgesRemind() {
        // 应用提示:获取当前群组的remind
        let messages = await Storage.local.likeNot(`REMIND_${this.USER.id}_${this.groupId}`)
        if (messages.length > 3) {
          messages = messages.slice(0, 3)
        }
        if (messages.length > 0) {
          messages.map(m => {
            m = JSON.parse(m)
            this.remindList.push(m)
          })
        }
      },
      getGroupApps() {
        Api.getGroupApps(this.groupId).then(res => {
          if (res.code === '1') {
            // console.log(this.groupId + ':getGroupApps===》')
          }
        })
      }
    },
    watch: {
      groupId(v) {
        if (v) {
          this.initRemindData()
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-card-remind {
    // color: $t-color-green;
    @include fc;
    margin-bottom: rem(10);
    .vx-item {
      min-height: rem(35);
      margin-bottom: rem(10);
    }
    .vx-item-left {
      position: relative;
      width: 80%;
      .create-text {
        width: 100%;
        text-align: center;
      }
    }
    .vx-item-right > div {
      padding-right: 20px;
    }
    .create-green {
      // color: $t-color-green;
      @include fc;
    }
    .vx-card-main {
      .card-images {
        &.single {
          img {
            width: rem(400) !important;
            height: rem(200) !important;
            max-width: rem(400) !important;
            max-height: rem(200) !important;
          }
        }
      }
    }
  }
</style>
