<template>
  <Page :title="title"
        :hasSubmit="hasSubmit"
        @submit="handleSubmit">
    <template slot="btn">
      <slot name="btns"></slot>
    </template>
    <template v-if="power">
      <el-dropdown trigger="click"
                   class="block-element"
                   @command="handleRemindSets">
        <Item label="应用提示">
          <div slot="remark">{{remindSets.period | remindSetsPeriod}}</div>
        </Item>
        <el-dropdown-menu slot="dropdown">
          <div class="category-title">没有新建内容的用户收到提示</div>
          <el-dropdown-item v-for="(item,i) in remindSetsOptions"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item @click="handleNew">
        <div>新建权限</div>
      </item>
      <item @click="handleReport">
        <div>报表</div>
      </item>
      <item @click="handleAddReport">
        <div>新增报表</div>
      </item>
      <slot name="split">
        <div class="category-title"
             v-if="$slots.others"></div>
      </slot>
    </template>
    <slot name="others"></slot>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/views/group/app/api'
  export default {
    mixins: [R],
    props: {
      appType: String,
      title: {
        type: String,
        default: '应用设置'
      },
      hasSubmit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        remindSets: {
          period: ''
        },
        remindSetsOptions: [
          {
            name: '不提示',
            period: 0
          },
          {
            name: '每1天',
            period: 1
          },
          {
            name: '每3天',
            period: 3
          },
          {
            name: '每7天',
            period: 7
          },
          {
            name: '每15天',
            period: 15
          },
          {
            name: '每30天',
            period: 30
          }
        ]
      }
    },
    computed: {
      power() {
        return this.isSuperAdmin || this.isAdmin || this.isAppAdmin(this.appType)
      },
      hasTemplate() {
        let value = this.getStorage('_business_show_report_template_setup')
        if (value) {
          return parseFloat(value)
        }
        return false
      }
    },
    filters: {
      remindSetsPeriod(period) {
        let remindPeriod = {
          0: '不提示',
          1: '每1天',
          3: '每3天',
          7: '每7天',
          15: '每15天',
          30: '每30天'
        }
        return remindPeriod[period]
      }
    },
    created() {
      // 拉取应用提示数据
      this.getRemindSets()
    },
    methods: {
      handleRemindSets(command) {
        this.remindSets = command
        Api.modifyRemindSets({
          remindSets: {
            schoolId: this.schoolId,
            appType: this.routeQuery('appType'),
            period: this.remindSets.period
          }
        }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
        })
      },
      getRemindSets() {
        Api.getRemindSets(this.schoolId, this.routeQuery('appType')).then(res => {
          if (res.code === '1') {
            this.remindSets = res.remindSets
          }
        })
      },
      handleNew() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      handleReport() {
        this.routePush({
          path: '/vx/group/business/report/setup',
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType')
          }
        })
      },
      handleAddReport() {
        this.routePush({
          name: 'reportTemplateList',
          query: this.$route.query
        })
      },
      handleSubmit() {
        this.$emit('submit')
      }
    }
  }
</script>
