<template>
  <Setup appType="'1048'">
    <template v-if="isSuperAdmin || isAdmin || isAppAdmin('1248')"
              slot="others">
      <template v-if="isSchool || isEnterprise">
        <item label="电子签名">
          <div slot="after">
            <i-switch :value="isSwitched"
                      @click="handleSwitch"></i-switch>
          </div>
        </item>
        <item @click="categorySetting">
          <div slot="main">分类设置</div>
        </item>
      </template>
      <template v-else>
        <item @click="handlerSetting">
          <div slot="main">默认审批人设置</div>
        </item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import Api from '@/views/business/1001/api'

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
      Api.getSignatureMeta('1248', this.schoolId).then(res => {
        if (res.metaDatas) {
          this.meta = res.metaDatas[0]
        }
      })
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      categorySetting() {
        this.routePush({ name: 'categorySetting1248' })
      },
      handlerSetting() {
        this.routePush({ name: 'handlerSetting1248' })
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
            key: '1248'
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
