<template>
  <Page title="话题选择">
    <Paging @click="loadTopics" :hasMore="hasMore">
      <Item v-for="(tag,i) in topics" v-if="tag.topic!==''" :key="i" @click="clickTopic(tag)">
        <div slot="main">{{tag.topic}}</div>
      </Item>
    </Paging>
  </Page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        topics: [],
        pageIndex: 1,
        hasMore: true
      }
    },
    created() {
      this.loadTopics(this.pageIndex)
    },
    methods: {
      loadTopics(pageIndex) {
        const that = this
        Api.loadTopics(this.currentGroup.groupId, pageIndex).then(res => {
          this.topics = [...this.topics, ...res.taggings]
          that.hasMore = !Check.isNull(res.page)
          that.pageIndex = res.page
        })
      },
      clickTopic(tag) {
        this.setStorage('_cache_topic_select', tag.topic)
        this.routeBack()
      }
    }
  }

</script>
