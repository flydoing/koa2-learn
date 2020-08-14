<template>
  <Setup appType="'1001'">
    <template v-if="isSuperAdmin || isAdmin || isAppAdmin('1001')"
              slot="others">
      <template v-if="isSchool || isEnterprise">
        <item label="电子签名">
          <div slot="after">
            <i-switch :value="isSwitched"
                      @click="handleSwitch"></i-switch>
          </div>
        </item>
        <item @click="formSetting">
          <div slot="main">表单设置</div>
        </item>
      </template>
      <template v-else>
        <item @click="handlerSetting">
          <div slot="main">表单默认处理人设置</div>
        </item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        meta: {
          metaType: 'm_approve_signature'
        }
      }
    },
    computed: {
      isSwitched() {
        return this.meta.obj === '1'
      }
    },
    created() {
      Api.getSignatureMeta('1001', this.schoolId).then(res => {
        if (res.metaDatas) {
          this.meta = res.metaDatas[0]
        }
      })
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      handlerSetting() {
        this.routePush({ name: 'handlerSetting1001' })
      },
      formSetting() {
        this.routePush({ name: 'formSetting1001' })
      },
      handleSwitch() {
        let meta = this.meta
        if (meta.id) {
          meta.obj = meta.obj === '1' ? '0' : '1'
        } else {
          meta = {
            ...meta,
            obj: meta.obj === '1' ? '0' : '1',
            userId: this.schoolId,
            key: '1001'
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.meta = res.metaDatas[0]
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
