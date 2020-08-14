<template>
  <page title="应用设置">
    <item v-if="lists.length>0" v-for="(item, i) in lists" :key="i" @click="itemClick(item)">
      <div>{{item.name}}</div>
      <div slot="remark" :class="{'error': item.value==='0'}" v-html="statusText(item)"></div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        lists: []
      }
    },
    created() {
      Api.getClassroomIplist(this.currentGroup.parentId).then(res => {
        this.lists = res.datas
      })
    },
    methods: {
      itemClick(group) {
        this.routePush({
          name: 'editIpAddress1073',
          query: {
            status: group.status,
            value: group.value,
            groupId: group.groupId
          }
        })
      },
      statusText(item) {
        return item.status === '0' ? '异常' : item.value ? item.value : '未绑定'
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .error {
    color: red;
  }

</style>
