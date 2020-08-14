<template>
  <Page title="入群申请"
        :loading="loading"
        :showTips="applys.length == 0">
    <ItemList v-for="(apply,i) in applys"
              :key="i"
              @click="onApply(apply)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(apply.fromUserAvatar,'thumb'),error:Image.ICO_AVATAR}"
           alt='LOGO'>
      <span slot="title"><span>{{apply.fromUserName}}：{{apply.title}}</span></span>
      <span slot="main">{{apply.content}}</span>
      <span slot="remark">{{apply.extension}}</span>
    </ItemList>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import R from '../mixin'
  export default {
    mixins: [R],
    data() {
      return {
        loading: true,
        applys: []
      }
    },
    created() {
      Api.getApplys(this.groupId).then(res => {
        this.loading = false
        this.applys = res.messages || []
      })
    },
    methods: {
      onApply(apply) {
        this.routePush({
          path: '/vx/group/user/apply/detail',
          query: {
            groupId: apply.groupId,
            userId: apply.fromUserId
          }
        })
      }
    }
  }
</script>
