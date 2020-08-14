<template>
  <Setup>
    <template v-if="(isSuperAdmin || isAdmin || isAppAdmin('1235')) && (isSchool || isOrdinary)"
              slot="others">
      <!-- new -->
      <item @click="handleGoAgreement()"
            label="协议账号">
      </item>
      <item @click="handleGoServer('227')"
            label="直播服务器">
      </item>
      <item @click="handleGoServer('228')"
            label="录播服务器">
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        types: [
          {
            name: '按时间',
            value: 1
          },
          {
            name: '按课时',
            value: 2
          }
        ],
        type: null,
        rules: [],
        executors: [],
        removeMeta: null
      }
    },
    created() {
      // this.fetchData()
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        leave: 'getLeave'
      }),
      typeMeta() {
        return this.filterMeta('m_leave_time_type')
      },
      approveMeta() {
        return this.filterMeta('m_student_leave_isapprove')
      }
    },
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      handleGoAgreement() {
        this.routePush({
          path: '/vx/group/business/1279/agreement',
          query: { groupId: this.groupId }
        })
      },
      handleGoServer(type) {
        // 录播228,直播227
        this.routePush({
          path: '/vx/group/business/1279/server',
          query: { type: type, groupId: this.groupId }
        })
      },
      ...mapActions(['modifyMetaData', 'setLeave', 'deleteLeaveProp']),
      isSwitched(meta) {
        return meta ? meta.obj === '1' : false
      },
      ruleTxt(index) {
        return `规则${index + 1}`
      },
      remarkTxt(item, index) {
        if (item.remark) {
          let len = this.rules.length
          return `大于${this.rules[len - 2].value}天`
        }
        return `上限${item.value}天`
      },
      filterMeta(type) {
        let that = this
        const metas = that.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.currentGroup.groupId
        })
        return Check.isRealArray(metas) ? metas[0] : { metaType: type }
      },
      fetchData() {
        const that = this
        if (that.leave.executors) {
          this.deleteLeaveProp('executors')
        }
        if (that.leave.dayCount) {
          this.deleteLeaveProp('dayCount')
        }
        if (that.leave.rule) {
          this.deleteLeaveProp('rule')
        }
        if (that.typeMeta && that.typeMeta.obj === '1') {
          that.type = that.types[1]
        } else {
          that.type = that.types[0]
        }

        that.removeMeta = {
          metaType: 'm_teacher_leave_allow_delete_default_person',
          obj: 1,
          userId: that.currentGroup.parentId
        }

        Api.getSettingData(that.groupId).then(res => {
          that.rules = res.datas || []
          that.executors = res.persons || []
          if (res.metaDatas) {
            that.removeMeta = res.metaDatas[0]
          }
        })
      },
      handleType(type) {
        let meta = {
          ...this.typeMeta,
          obj: type.value === 1 ? '0' : '1',
          extension: this.currentGroup.groupId
        }
        this.modifyMetaData(meta).then(res => {
          this.type = type
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleSwitch(meta) {
        if (meta.id) {
          meta.obj = meta.obj === '1' ? '0' : '1'
        } else {
          meta = {
            ...meta,
            obj: meta.obj && meta.obj === '1' ? '0' : '1',
            extension: this.groupId
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleAdd() {
        this.routePush({ name: 'ruleEdit1235' })
      },
      handleItem(item, i) {
        let query = {}
        let len = this.rules.length
        if (item.remark) {
          query = { title: `大于${this.rules[len - 2].value}天` }
        }
        this.setLeave({ rule: item })
        this.routePush({ name: 'ruleEdit1235', query: query })
      },
      handleExcutor() {
        this.setLeave({ executors: this.executors })
        this.routePush({ name: 'executorEdit1235' })
      },
      typeSetting() {
        this.routePush({ name: 'typeSetting1235' })
      }
    }
  }
</script>
