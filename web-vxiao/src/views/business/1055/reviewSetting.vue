<template>
  <page title="审核设置"
        hasSubmit
        @submit="editCommit">
    <item :hasClick="false">
      <div>人数上限</div>
      <input slot="remark"
             type="text"
             placeholder="输入人数数量"
             v-model="peopleCount">
    </item>
    <item @click="handleAudit">
      <div slot="main">是否需要审核</div>
      <div slot="after">
        <i-switch :value="question.isAudit"
                  :trueValue="1"
                  :falseValue="0"
                  @click="handleAudit"></i-switch>
      </div>
    </item>
    <item @click="$set(Exclusive,'isExclusive',Exclusive.isExclusive==='1'?'0':'1')">
      <div slot="main">报名成功后自动加入专属群组</div>
      <div slot="after">
        <i-switch :value.sync="Exclusive.isExclusive"
                  trueValue="1"
                  falseValue="0"
                  @click="handleExclusive"></i-switch>
      </div>
    </item>
    <item :hasClick="false"
          v-show="Exclusive.isExclusive === '1'">
      <div>专属群组名称</div>
      <input slot="remark"
             type="text"
             placeholder="必填"
             v-model="Exclusive.exclusiveName">
    </item>
  </page>
</template>
<script>
  // import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        peopleCount: '', // 人数数量
        Exclusive: {
          isExclusive: '0', // 是否加入专属群组
          exclusiveName: '' // 专属群组名称
        },
        datas: [],
        active: false
      }
    },
    computed: {
      ...mapGetters({
        question: 'getQuestion'
      })
    },
    created() {},
    methods: {
      ...mapActions(['saveQuestion']),
      // 是否审核
      handleAudit() {
        this.saveQuestion({
          isAudit: this.question.isAudit === 0 ? 1 : 0
        })
      },
      // 是否加入专属群组
      handleExclusive() {},
      // 提交
      editCommit() {
        let selectedEnrolment = []
        this.datas.forEach(d => {
          d.active && selectedEnrolment.push(d)
        })
        this.saveQuestion({
          enrollTable: {
            ...this.question.enrollTable,
            metaDatas: selectedEnrolment
          }
        })
        this.routeBack()
      }
    }
  }
</script>
