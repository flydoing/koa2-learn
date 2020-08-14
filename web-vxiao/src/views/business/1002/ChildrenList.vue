<template>
  <page title="作业">
    <div class="children-list">
      <item v-if="children.length>0" v-for="(child, c) in children" :key="c" @click="childItemHandle(child)">
        <div slot="main">{{child.name}}</div>
        <div slot="remark" class="ellipsis">{{child.extension === '0' ? '未答' : '已答'}}</div>
      </item>
    </div>
  </page>
</template>
<script>
  export default {
    data() {
      return {
        children: this.getStorage('childrenList', true) || []
      }
    },
    methods: {
      childItemHandle(child) {
        let that = this
        if (child.extension === '0') {
          that.routePush({
            name: 'onlineAnswerDetail1002',
            query: {
              respond: true,
              msgId: that.routeQuery('msgId'),
              childId: child.id
            }
          })
        } else {
          that.routePush({
            name: 'onlineAnswerDetail1002',
            query: {
              appType: this.routeQuery('appType'),
              msgId: that.routeQuery('msgId')
            }
          })
        }
      }
    },
    watch: {
      children(v) {
        this.children = v
      }
    }
  }

</script>
