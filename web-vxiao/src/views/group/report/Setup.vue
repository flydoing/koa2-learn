<template>
  <Page title="报表设置">
    <template v-for="(v,k) in categroys">
      <div :key="k"
           v-if="v.length>0">
        <div class="category-title">{{k}}</div>
        <item v-for="(templet,i) in v"
              :key="i"
              @click="handleEdit(templet)">
          <div slot="main">
            {{templet.name}}
            <span class="f12">{{templet.isPlatform === '1' ? '（系统）' : ''}}</span>
          </div>
          <div slot="remark">
            <i-switch :value.sync="templet.allocatedStatus"
                      trueValue='1'
                      falseValue="d"
                      @click="handleOpen(templet)"></i-switch>
          </div>
        </item>
      </div>
    </template>
    <Item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增</div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import Cammand from '@/constant/cammand'
  export default {
    data() {
      return { templets: [] }
    },
    computed: {
      categroys() {
        let _r = [] // 榜单
        let _b = [] // 报表
        let _t = [] // 图表
        this.templets.forEach(t => {
          if (t.reportType === '1') {
            _r.push(t)
          } else if (t.reportType === '2') {
            _b.push(t)
          } else if (t.reportType === '3') {
            _t.push(t)
          }
        })
        return { 榜单: _r, 报表: _b, 图表: _t }
      }
    },
    created() {
      this.$web.postJsAction({
        type: Cammand.ACTION_TITLE,
        content: '报表设置'
      })
    },
    methods: {
      handleOpen(templet) {
        Api.modifyTemplate({
          templet: {
            id: templet.id,
            allocatedStatus: templet.allocatedStatus,
            groupId: this.routeQuery('groupId')
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      },
      handleEdit(t) {
        let routeName = 'reportTemplateEdit'
        if (t.isPlatform === '1') {
          routeName = 'reportSystemTemplateEdit'
        }
        this.setStorage('_templet', t)
        this.routePush({
          name: routeName,
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType')
          }
        })
      },
      handleAdd() {
        this.routePush({
          name: 'reportTemplateList',
          query: this.$route.query
        })
      }
    },
    mounted() {
      const that = this
      Api.loadTemplates(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
        that.templets = res.templets || []
      })
    }
  }
</script>
<style lang="scss">
  .tmp {
    .step {
      // padding: rem(10);
      border-bottom: $border;
    }
    .box-card {
      margin-top: rem(-1);
      padding-bottom: rem(20);
    }

    .image {
      max-width: rem(668);
    }
    .button {
      min-width: rem(120);
    }
  }
  .el-steps--simple {
    padding: rem(10) 8%;
    font-size: rem(14) !important;
  }
  .el-step.is-simple .el-step__title {
    font-size: rem(14);
  }
  .el-step.is-simple .el-step__arrow::before,
  .el-step.is-simple .el-step__arrow::after {
    height: rem(10);
  }
  .el-step.is-simple .el-step__arrow::before {
    -webkit-transform: rotate(-45deg) translateY(-3px);
    transform: rotate(-45deg) translateY(-3px);
  }
  .el-step.is-simple .el-step__arrow::after {
    -webkit-transform: rotate(45deg) translateY(3px);
    transform: rotate(45deg) translateY(3px);
  }
</style>
