<template>
  <page :title="routeQuery('titleText')"
        :hasClose="false"
        @scrollEnd="scrollEnd">
    <template v-if="datas && datas.length>0">
      <item v-for="(data, d) in datas"
            :key="d"
            @click="applyDetailHandle(data)">
        <div slot="before">
          <img class="avatar small"
               v-lazy="{src:url(data.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="userTxt(data)"></div>
      </item>
    </template>
  </page>
</template>
<script>
  import Api from './api'
  import Str from '@/utils/string'
  export default {
    data() {
      return {
        datas: [],
        hasNextPage: 0,
        currentPage: 1
      }
    },
    created() {
      this.loadApplycant(this.routeQuery('keyword') || '', 1, this.routeQuery('type'))
    },
    methods: {
      userTxt(user) {
        return user.sname ? `${user.name}（${user.sname}）` : user.name
      },
      loadApplycant(name, page, type) {
        page = page || 1
        Api.getApplycantList(this.routeQuery('msgId'), name, page, type).then(res => {
          if (res && res.code === '1') {
            if (res.hasNextPage > 0) {
              this.hasNextPage = res.hasNextPage
              this.currentPage = res.currentPage
            } else {
              this.hasNextPage = 0
            }
            this.datas = res.datas
          }
        })
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadApplycant('', this.currentPage, this.routeQuery('type'))
      },
      applyDetailHandle(data) {
        this.routePush({
          name: 'applyAppDetail',
          query: {
            name: data.name,
            serialNumber: data.value,
            clientId: this.$store.state.CLIENTID,
            refId: Str.uuid(),
            msgId: this.routeQuery('msgId'),
            token: this.$store.state.TOKENID
          }
        })
      }
    }
  }
</script>
