<template>
  <page title="总结">
    <item v-for="(data, d) in datas" :key="d" v-if="datas.length>0" @click="summaryItemClick(data)">
      <div slot="before">
        <img slot="avatar" class="avatar small" v-lazy="{src:url(data.avatar,'thumb'),error:Image.ICO_GROUP}" alt='LOGO'>
      </div>
      <div>{{data.userName}}</div>
      <div slot="remark">{{data.count}}个总结</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    data() {
      return {
        datas: []
      }
    },
    created() {
      Api.getSummaryStudentList(this.currentGroup.groupId).then(res => {
        this.datas = res.datas
      })
    },
    methods: {
      summaryItemClick(data) {
        this.routePush({
          name: 'addSummary1189',
          query: {
            userId: data.userId,
            season: data.season,
            isSummarized: data.isSummarized,
            userName: data.userName
          }
        })
      }
    }
  }

</script>
