<template>
  <Page title="话题">
    <Paging @click="loadTopics" :hasMore="hasMore">
      <item v-for="(tag,i) in topics" v-if="tag.topic!==''" :key="i" @click="clickTopic(tag)">
        <div slot="main">{{tag.topic}}</div>
      </item>
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
        this.routePush({
          name: 'topicList',
          query: {
            label: tag.topic.replace(/#/g, '')
          }
        })
      }
    }
  }

</script>
