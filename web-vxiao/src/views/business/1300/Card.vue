<template>
  <Card :message="message">
    <CardImages slot="images"
                :images="images"
                v-if="images.length>0"></CardImages>
    <div slot="href"
         class="text-color">
      <span @click="handleResult">报名结果</span>
      &nbsp;|&nbsp;
      <span @click="handleAppraise">能力评估</span>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    computed: {
      images() {
        if (this.m.images.length > 0) {
          return this.m.images.filter(v => {
            return v.status === '2' || v.extensionType === 'qr_code_flag'
          })
        }
        return []
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleResult() {
        this.routePush({
          path: '/vx/group/business/1300/result/index',
          query: {
            msgId: this.message.id
          }
        })
      },
      handleAppraise() {
        this.modifyCreateObjectField('form')
        Api.getTabs(this.message.id).then(res => {
          this.setCreateObject({ tabs: res.datas || [] })
          this.routePush({
            path: '/vx/group/business/1300/appraise/index',
            query: {
              msgId: this.message.id
            }
          })
        })
      }
    }
  }
</script>
