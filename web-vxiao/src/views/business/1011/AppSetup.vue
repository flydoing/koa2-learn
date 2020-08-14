<template>
  <Setup appType="'1011'">
    <template v-if="(isEducation || isEnterprise || isSchool) && (isSuperAdmin || isAdmin || isAppAdmin('1011'))"
              slot="others">
      <item>
        <div slot="main">校内公开审核</div>
        <div slot="after">
          <i-switch :value="isSwitched(publicMeta)"
                    @click="handleSwitch(publicMeta)"></i-switch>
        </div>
      </item>
      <item>
        <div slot="main">同步官网审核</div>
        <div slot="after">
          <i-switch :value="isSwitched(synchroMeta)"
                    @click="handleSwitch(synchroMeta)"></i-switch>
        </div>
      </item>
      <item @click="columnSetting">
        <div slot="main">栏目设置</div>
      </item>
      <item @click="wechatSetting">
        <div slot="main">微信设置</div>
      </item>
      <item @click="bannerSetting">
        <div slot="main">焦点图（Banner）设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      publicMeta() {
        return this.filterMeta('m_portal_open_need_approve')
      },
      synchroMeta() {
        return this.filterMeta('m_portal_syn_network_need_approve')
      }
    },
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      isSwitched(meta) {
        return meta ? meta.obj === '1' : false
      },
      filterMeta(type) {
        let that = this
        const metas = that.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.currentGroup.groupId
        })
        return Check.isRealArray(metas) ? metas[0] : { metaType: type }
      },
      handleSwitch(meta) {
        if (meta.id) {
          meta.obj = meta.obj === '1' ? '0' : '1'
        } else {
          meta = {
            ...meta,
            obj: meta.obj && meta.obj === '1' ? '0' : '1',
            extension: this.currentGroup.groupId
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      columnSetting() {
        this.routePush({ name: 'columnSetting1011' })
      },
      wechatSetting() {
        this.routePush({ name: 'wechatSetting1011' })
      },
      bannerSetting() {
        this.routePush({ name: 'bannerSetting1011' })
      }
    }
  }
</script>
