<template>
  <Setup>
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1158'))"
              slot="others">
      <item>
        <div slot="main">禁止学生、家长新建</div>
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
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
        const metas = that.metaDatas.filter(m => {
          return m.metaType === 'm_app_create_forbidden_roles' && m.extension === that.groupId && m.key === '1158' && m.status === '1'
        })
        return metas[0]
      },
      isSwitched() {
        return this.allowMeta ? this.allowMeta.status === '1' : false
      }
    },
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      handleSwitch() {
        let meta = this.allowMeta
        if (meta) {
          meta.status = 'd'
        } else {
          meta = {
            metaType: 'm_app_create_forbidden_roles',
            userId: this.currentGroup.parentId,
            extension: this.groupId,
            key: '1158',
            obj: '3,4',
            status: '1'
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
