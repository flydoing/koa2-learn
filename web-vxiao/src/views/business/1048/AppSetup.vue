<template>
  <Setup appType="'1048'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1048'))"
              slot="others">
      <item @click="autoCommend">
        <div slot="main">自动表彰</div>
      </item>
      <item @click="customTemplate">
        <div slot="main">自定义表彰模板</div>
      </item>
      <item>
        <div slot="main">批量表彰时卡片独立展示</div>
        <div slot="after">
          <i-switch :value="isSwitched(singleMeta)"
                    @click="handleSwitch(singleMeta)"></i-switch>
        </div>
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
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    created() {},
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      singleMeta() {
        let that = this
        let type = 't_commend_single_user'
        const metas = that.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.groupId
        })
        if (!Check.isRealArray(metas)) {
          return { metaType: type }
        }
        return metas[0]
      }
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      isSwitched(meta) {
        return meta ? meta.obj === '1' : false
      },
      autoCommend() {
        this.routePush({ name: 'autoCommend1048' })
      },
      customTemplate() {
        this.routePush({ name: 'customTemplate1048' })
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
      }
    }
  }
</script>
