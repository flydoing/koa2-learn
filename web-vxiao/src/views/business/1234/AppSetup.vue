<template>
  <Setup appType="'1234'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1234'))"
              slot="others">
      <item label="调代课结果审批">
        <div slot="after">
          <i-switch :value="isSwitched(approveMeta)"
                    @click="handleSwitch(approveMeta)"></i-switch>
        </div>
      </item>
      <item label="允许跨科目代课">
        <div slot="after">
          <i-switch :value="isSwitched(subjectMeta)"
                    @click="handleSwitch(subjectMeta)"></i-switch>
        </div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    created() {},
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      approveMeta() {
        return this.filterMeta('m_coursetable_exchange_control')
      },
      subjectMeta() {
        return this.filterMeta('m_substitute_cross_subject')
      }
    },
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      isSwitched(meta) {
        return meta.obj === '1'
      },
      filterMeta(type) {
        let that = this
        const meta = that.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.groupId
        })[0]
        return (
          meta || {
            metaType: type,
            obj: '0',
            extension: that.groupId,
            userId: that.schoolId
          }
        )
      },
      handleSwitch(meta) {
        this.modifyMetaData({
          ...meta,
          obj: meta.obj === '1' ? '0' : '1'
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
