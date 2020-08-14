<template>
  <Setup>
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1162'))"
              slot="others">
      <item>
        <div slot="main">允许学生、家长新建</div>
        <div slot="after">
          <i-switch :value="allowSwitched"
                    @click="handleAllowSwitch"></i-switch>
        </div>
      </item>
      <item>
        <div slot="main">自动发布到班牌</div>
        <div slot="after">
          <i-switch :value="autoSwitched"
                    @click="handleAutoSwitch"></i-switch>
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
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      allowMeta() {
        let that = this
        const metas = that.metaDatas.filter((m) => {
          return m.metaType === 'm_app_create_forbidden_roles' && m.extension === that.groupId && m.key === '1162' && m.status === '1'
        })
        return metas[0]
      },
      autoMeta() {
        let that = this
        const metas = that.metaDatas.filter((m) => {
          return m.metaType === 'm_auto_sendmsg_vscreen' && m.extension === that.groupId
        })
        return metas[0]
      },
      allowSwitched() {
        return this.allowMeta ? this.allowMeta.status === '1' : false
      },
      autoSwitched() {
        return this.autoMeta ? this.autoMeta.obj === '1' : false
      }
    },
    components: {
      Setup: (resolve) => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      handleAllowSwitch() {
        let meta = this.allowMeta
        if (meta) {
          meta = { ...meta, status: 'd' }
        } else {
          meta = {
            metaType: 'm_auto_sendmsg_vscreen',
            userId: this.currentGroup.parentId,
            extension: this.groupId,
            key: '1162',
            obj: '3,4',
            status: '1'
          }
        }
        this.modifyMetaData(meta).then((res) => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleAutoSwitch() {
        let meta = this.autoMeta
        if (meta) {
          meta = { ...meta, obj: meta.obj === '1' ? '0' : '1' }
        } else {
          meta = {
            metaType: 'm_auto_sendmsg_vscreen',
            extension: this.groupId,
            obj: '1',
            status: '1'
          }
        }
        this.modifyMetaData(meta).then((res) => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
