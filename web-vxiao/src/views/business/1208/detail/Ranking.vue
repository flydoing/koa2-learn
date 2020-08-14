<template>
  <page :title="title">
    <item v-if="datas.length>0" v-for="(data, d) in datas" :key="d" :hasClick="data.key==='1'" @click="userClick(data)">
      <div slot="before">
        <img class="avatar" v-lazy="{src:url(data.avatar),error:Image.ICO_USER}" alt='头像'>
      </div>
      <div>{{data.name}}</div>
      <div slot=remark>{{data.value}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        datas: [],
        title: ''
      }
    },
    created() {
      Api.loadRanking(this.routeQuery('msgId')).then(res => {
        this.datas = res.praxis.datas
        this.title = res.praxis.title
      }).catch(res => {})
    },
    methods: {
      userClick(info) {
        this.routePush({
          name: 'studentReview1208',
          query: {
            msgId: this.routeQuery('msgId'),
            userId: info.userId
          }
        })
      }
    }
  }

</script>
