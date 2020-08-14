<template>
  <Page title="详情">
    <div class="feedback-list">
      <template v-if="isTeacher">
        <item @click="handleFeedback">
          <div slot="before"><img class="avatar"
                 v-lazy="{src:url(group.avatar || ''),error:Image.ICO_USER}"
                 alt='头像' /></div>
          <div slot="main"
               v-html="group.name"></div>
          <div slot="remark">已反馈{{group.count || 0}}人</div>
        </item>
        <div class="category-title"></div>
      </template>
      <item v-for="(item,i) in records"
            :key="i"
            @click="handleFeedback(item)"
            :hasClick="item.haveFeedback === '1'">
        <div slot="before"><img class="avatar"
               v-lazy="{src:url(item.avatar || ''),error:Image.ICO_USER}"
               alt='头像' /></div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="remarkTxt(item)"></div>
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        group: null,
        records: []
      }
    },
    computed: {},
    created() {
      this.msgId = this.routeQuery('msgId')
      Api.getFeedbackRecords(this.msgId).then(res => {
        if (res.summary) {
          this.group = res.summary
          this.records = res.summary.records
        }
      })
    },
    methods: {
      ...mapActions(['setHomeVisit']),
      remarkTxt(item) {
        return item.haveFeedback === '1' ? '已反馈' : '待反馈'
      },
      handleFeedback(item) {
        this.setHomeVisit({ record: item || this.group })
        this.routePush({ name: 'feedback1260', query: { msgId: this.msgId } })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .feedback-list {
    .vx-item img {
      margin: rem(5) 0;
    }
  }
</style>
