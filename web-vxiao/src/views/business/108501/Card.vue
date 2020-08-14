<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <template v-if="link.items">
        <div v-for="(item,i) in link.items"
             :key="i"
             :item="item">
          <span>{{item.label}}</span>
          <span class="text-color"
                @click="item.handle">{{item.name}}</span>
        </div>
      </template>
      <div if="!link.isComplete"
           v-html="m.extension"></div>
    </CardContent>
    <CardHref v-if="button"
              :content="button.text"
              @click="button.handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      link() {
        let _m = this.message
        let link = {
          items: [],
          isComplete: false
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson) : null
          if (!Check.isNullObject(json)) {
            if (json.clientName) {
              link.items.push({
                id: json.clientId,
                label: '客户：',
                type: 'client',
                name: json.clientName,
                handle: this.clientHandle
              })
            }
            if (json.agentName) {
              link.items.push({
                id: json.agentId,
                label: '代理商：',
                type: 'agent',
                name: json.agentName,
                handle: this.agentHandle
              })
            }
            if (json.contractName && _m.extension) {
              link.items.push({
                id: json.contractId,
                label: _m.extension,
                type: 'contract',
                name: json.contractName,
                handle: this.contractHandle
              })
              link.isComplete = true
            }
          }
        } catch (e) {}
        return link
      },
      button() {
        return {
          text: '查看详情',
          handle: this.detailHanle
        }
      }
    },
    methods: {
      ...mapActions(['setCrm']),
      clientHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      agentHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      contractHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      detailHanle() {
        let mJson = JSON.parse(this.message.msgJson || '{}')
        this.setCrm({ isCreate: false, isFinish: mJson.isFinish })
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '108501',
            groupId: this.groupId,
            pid: this.message.id
          }
        })
      }
    }
  }
</script>
