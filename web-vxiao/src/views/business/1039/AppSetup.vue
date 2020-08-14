<template>
  <Setup>
    <template slot="others"
              v-if="isSuperAdmin || isAdmin || isAppAdmin('1039')">
      <template v-if="isSchool || isEnterprise">
        <item>
          <div slot="main">是否开启工时评估</div>
          <div slot="after">
            <i-switch :value="isSwitched"
                      @click="handleSwitch"></i-switch>
          </div>
        </item>
        <item @click="typeSetting">
          <div slot="main">类型设置</div>
        </item>
      </template>
      <template v-else>
        <item @click="defaultHandler">
          <div slot="main">默认负责人</div>
        </item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId'
      }),
      assessMeta() {
        return this.filterData('m_workorder_man_haur')
      },
      isSwitched() {
        let meta = this.assessMeta
        return meta ? meta.obj === '1' : false
      }
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      defaultHandler() {
        this.routePush({
          name: 'defaultHandlers1039'
        })
      },
      typeSetting() {
        this.routePush({
          name: 'typeSetting1039'
        })
      },
      filterData(type) {
        let that = this
        const metas = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.groupId
        })
        if (!Check.isRealArray(metas)) {
          return { metaType: type }
        }
        return metas[0]
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
      }
    }
  }
</script>
