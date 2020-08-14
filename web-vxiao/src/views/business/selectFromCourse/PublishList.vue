<template>
  <page :title="titleText"
        @scrollEnd="scrollerEnd">
    <div v-if="messages.length>0"
         v-for="(m, i) in messages"
         :key="i">
      <div class="category-title"></div>
      <Card :message="m">
        <el-dropdown trigger="click"
                     placement="bottom"
                     class="drop-down"
                     slot="down">
          <div>
            <i class="ico ico-down"></i>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item @click.native.stop="pubishNow(m)">立即发布</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </Card>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import CardMixin from '@/views/components/card/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [CardMixin],
    data() {
      return {
        messages: [],
        titleText: '',
        hasNextPage: 0,
        currentPage: 1
      }
    },
    created() {
      this.titleText = this.routeQuery('categoryName')
      this.loadMsg()
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      scrollerEnd() {
        this.hasNextPage > 0 && this.loadMsg()
      },
      loadMsg() {
        Api.loadCards({
          groupId: this.routeQuery('cGroupId'),
          currentPage: this.currentPage,
          categoryId: this.routeQuery('categoryId'),
          extensionType: this.routeQuery('appType')
        }).then((res) => {
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.currentPage = res.currentPage
          } else {
            this.hasNextPage = 0
          }
          let ms = res.messages || []
          this.messages = [...this.messages, ...ms]
        })
      },
      pubishNow(m) {
        Api.Publish({
          message: {
            id: m.id,
            groupId: this.currentGroup.groupId,
            ...this.constructionMessage()
          }
        }).then((res) => {
          this.modifyChannelMessage(res.messages[0])
          this.$message({ type: 'success', message: '成功' })
          this.routeBack(-4)
        })
      }
    }
  }
</script>
