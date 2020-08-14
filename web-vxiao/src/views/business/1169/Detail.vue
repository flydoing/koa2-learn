<template>
  <Page title="活动" @scrollEnd="scrollEnd">
    <template slot="btn">
      <label @click="handleScanning" v-html="scanTxt"></label>
      <label @click="handleFilter">筛选</label>
    </template>
    <div class="main-card">
      <CardColumn v-if="message" :message="message" :pd="true">
        <template slot="content">
          <div class="text-color" v-html="message.fromUserName"></div>
          <div class="main" v-html="message.content"></div>
        </template>
        <template slot="down"></template>
      </CardColumn>
    </div>
    <div class="category-title"></div>
    <template v-if="messages.length>0">
      <CardList :messages="messages"></CardList>
    </template>
    <template v-else>
      <CardTips text="暂无内容" />
    </template>
    <Scanning v-if="messages.length>0" :messages="messages" :show.sync="showScanning"></Scanning>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  import Check from '@/utils/check'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardColumn: resolve => require(['@/views/components/card/CardColumn'], resolve),
      CardList: resolve => require(['@/views/components/card/CardList'], resolve),
      Scanning: resolve => require(['./Scanning'], resolve),
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        message: null,
        showScanning: false,
        ranges: []
      }
    },
    computed: {
      scanTxt() {
        if (this.message) {
          return this.message.status === '6' ? '已结束' : '播放模式'
        }
        return ''
      }
    },
    created() {
      this.msgId = this.routeQuery('msgId')
      MessageApi.getMessageById(this.msgId).then(res => {
        this.message = res.message
      })
      this.loadMessages()
    },
    methods: {
      loadMessages() {
        this.ranges = this.getStorage('_1169_range_cache')
        if (Check.isRealArray(this.ranges)) {
          this.getMessages({
            groupId: this.groupId,
            parentId: this.msgId,
            groupIds: this.ranges.map(v => { return v.groupId }).join(','),
            type: '1171',
            queryType: 'filter',
            currentPage: this.currentPage
          }).then(res => {}).catch(res => {})
        } else {
          this.getMessages({
            groupId: this.groupId,
            parentId: this.msgId,
            type: '1169',
            queryType: 'parentId',
            currentPage: this.currentPage
          }).then(res => {}).catch(res => {})
        }
      },
      handleScanning() {
        if (this.message.status === '6') {
          return false
        }
        if (!Check.isRealArray(this.messages)) {
          this.$message({ message: '请先上传活动内容', type: 'warning' })
          return false
        }
        this.showScanning = true
      },
      handleFilter() {
        this.setStorage('_1169_range_cache', this.ranges)
        this.routePush({ name: 'selectRange1169' })
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~scss/_mixin";

  .main-card .vx-card {
    margin-bottom: 0 !important;
  }

</style>
