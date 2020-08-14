<template>
  <Page title="报名详情">
    <div class="vx-questionaire">
      <template v-for="(item, i) in (form.questions || [])">
        <Single v-if="item.type === '7'"
                :key="i"
                :question="item"
                :index='i'
                :params="{'hasClick': false}">
          <template slot='title'>
            <div v-html="item.title"></div>
          </template>
          <template slot='link'></template>
        </Single>
        <Mutiple v-else-if="item.type === '8'"
                 :key="i"
                 :question="item"
                 :index='i'
                 :params="{'hasClick': false}">
          <template slot='title'>
            <div v-html="item.title"></div>
          </template>
          <template slot='link'></template>
        </Mutiple>
        <Avatar v-else-if="item.type === '3'"
                :key="i">
          <item :label="item.title"
                :hasClick="false">
            <div slot="remark">
              <img class="avatar big"
                   v-lazy="{src:url(item.answerContent, 'thumb'),error:Image.ICO_USER} "
                   alt='LOGO' />
            </div>
          </item>
        </Avatar>
        <item v-else
              :key="i"
              :hasClick="false"
              :label="item.title"
              :remark="item.answerContent">
        </item>
      </template>
    </div>
    <div slot="bottom"
         v-if="auditType"
         class="btm-operate">
      <div class="button button-common">
        <el-dropdown trigger="click"
                     class="block-element btn-audit"
                     placement="bottom"
                     @command="handleAudit">
          <div>{{auditTxt}}</div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(op, i) in operates"
                              :key="i"
                              :command="op">{{op.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve),
      Single: resolve => require(['@/views/components/question/Single'], resolve),
      Multiple: resolve => require(['@/views/components/question/Multiple'], resolve)
    },
    data() {
      return {
        form: {},
        qtObj: {
          '7': '单选题',
          '8': '多选题'
        },
        operates: [
          {
            name: '通过',
            value: '4'
          },
          {
            name: '不通过',
            value: '5'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      msgId() {
        return this.routeQuery('msgId')
      },
      auditType() {
        return this.routeQuery('type')
      },
      auditTxt() {
        return this.auditType === '3' ? '审核' : '重新审核'
      }
    },
    created() {
      let personNo = this.routeQuery('personNo')
      Api.getCaseDetail(null, this.msgId, personNo).then(res => {
        if (res.form) {
          this.form = res.form
          this.form.questions = res.form.questions.map(v => {
            if (v.type === '7' || v.type === '8') {
              v.title = `【${this.qtObj[v.type]}】${v.title}`
            }
            if (v.options) {
              v.options = v.options.map((o, i) => {
                o.content = o.title
                o.serialNumber = this.getSerialNumber(i)
                return o
              })
            }
            return v
          })
        }
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      getSerialNumber(index) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(index)
      },
      handleAudit(item) {
        let personNo = this.routeQuery('personNo')
        Api.modifyAudit({
          msgId: this.msgId,
          auditStatus: item.value,
          type: this.auditType,
          participants: [{ personNo: personNo }]
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/questionaire';
  .btn-audit.el-dropdown {
    .el-dropdown-selfdefine {
      color: #fff;
    }
  }
  .btm-operate {
    padding: rem(5) 0;
  }
</style>
