<template>
  <Page title="修改记录">
    <div class="modify-record">
      <div v-for="(item, i) in records"
           :key="i">
        <div class="category-title"
             v-if="i !== 0"></div>
        <div class="mr-item">
          <div>{{item.title}}&#12288;<span class="time"
                  v-html="toDateTime(item.createTime)"></span></div>
          <div v-html="converContent(item.content)"></div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script>
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        records: []
      }
    },
    computed: {},
    created() {
      Api.getModifyRecords(this.routeQuery('appType'), this.routeQuery('id')).then(res => {
        this.records = res.crmModifyRecords || []
      })
    },
    methods: {
      toDateTime(datetime) {
        return DateUtils.format(datetime, 'MM-dd hh:mm')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .modify-record {
    .mr-item {
      padding: rem(10);
      .time {
        color: #9f9f9f;
      }
    }
  }
</style>
