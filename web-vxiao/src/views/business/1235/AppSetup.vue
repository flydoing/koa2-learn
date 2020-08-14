<template>
  <Setup>
    <template v-if="isSuperAdmin || isAdmin || isAppAdmin('1235')"
              slot="others">
      <template v-if="isSchool || isEnterprise">
        <item label="电子签名">
          <div slot="after">
            <i-switch :value="isSwitched(signuareMeta)"
                      @click="handleSignuare"></i-switch>
          </div>
        </item>
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleType">
          <div class="el-dropdown-link">
            <item label="老师、成员请假方式">
              <div v-if="type"
                   slot="remark">{{type.name}}</div>
            </item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(type,i) in types"
                              :key="i"
                              :type="type"
                              :command="type">{{type.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <item label="学生请假需要老师审批">
          <div slot="after">
            <i-switch :value="isSwitched(approveMeta)"
                      @click="handleSwitch(approveMeta)"></i-switch>
          </div>
        </item>
        <item @click="typeSetting"
              label="类型设置">
        </item>
      </template>
      <template v-else>
        <item label="可编辑默认处理人（新建消息）">
          <div slot="after">
            <i-switch :value="isSwitched(removeMeta)"
                      @click="handleSwitch(removeMeta)"></i-switch>
          </div>
        </item>
        <item @click="handleExcutor"
              label="默认备案人">
        </item>
        <div class="category-title text">审核规则</div>
        <item v-for="(item, i) in rules"
              :key="i"
              @click="handleItem(item, i)"
              :label="ruleTxt(i)"
              :remark="remarkTxt(item, i)">
        </item>
        <item @click="handleAdd"
              :hasArrow="false"
              label="新规则">
          <div slot="before">
            <i class="ico ico-plus"></i>
          </div>
        </item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api1001 from '@/views/business/1001/api'
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
        removeMeta: null,
        signuareMeta: {
          metaType: 'm_approve_signature'
        }
      }
    },
    created() {
      this.fetchData()
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

        Api1001.getSignatureMeta('1235', this.schoolId).then(res => {
          if (res.metaDatas) {
            this.signuareMeta = res.metaDatas[0]
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
      handleSignuare() {
        let meta = this.signuareMeta
        if (meta.id) {
          meta.obj = meta.obj === '1' ? '0' : '1'
        } else {
          meta = {
            ...meta,
            obj: meta.obj === '1' ? '0' : '1',
            userId: this.schoolId,
            key: '1235'
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.signuareMeta = res.metaDatas[0]
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
