<template>
  <Page title="小组信息"
        @add="add"
        :hasAdd="true"
        :showTips="teams.length === 0">
    <ItemList v-for="g in teams"
              :key="g.id"
              @click="handle(g)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(g.logo,'thumb'),error:Image.ICO_GROUP}"
           alt='LOGO'>
      <span slot="title">{{g.name}}</span>
      <span slot="remark">{{g.count}}</span>
    </ItemList>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return { teams: [] }
    },
    created() {
      Api.getGroupTeams(this.groupId).then(res => {
        this.teams = res.groups || []
      })
    },
    methods: {
      add() {
        this.routePush({
          path: '/vx/group/user/team/add'
        })
      },
      handle(team) {
        this.routePush({
          path: '/vx/group/user/team/detail',
          query: {
            id: team.id,
            groupId: team.groupId,
            name: team.name,
            logo: team.logo || ''
          }
        })
      }
    }
  }
</script>
