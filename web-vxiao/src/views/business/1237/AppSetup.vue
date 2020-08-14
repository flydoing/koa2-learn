<template>
  <Setup appType="'1237'">
    <template v-if="isOrg && (isSuperAdmin || isAdmin || isAppAdmin('1237'))"
              slot="others">
      <item @click="timeSetting"
            label='考勤时间'>
      </item>
      <item @click="overtimeSetting"
            label='加班设置'>
      </item>
      <item @click="wifiSetting"
            label='WIFI考勤'>
      </item>
      <item @click="pathogenySetting"
            label='病因设置'>
      </item>
      <item @click="diseaseReport"
            label="疾控上报">
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    created() {},
    methods: {
      timeSetting() {
        this.routePush({ name: 'timeSetting1237' })
      },
      overtimeSetting() {
        this.routePush({ name: 'overtimeSetting1237' })
      },
      pathogenySetting() {
        this.routePush({ name: 'pathogenySetting1237' })
      },
      diseaseReport() {
        this.routePush({ name: 'diseaseReport1237' })
      },
      wifiSetting() {
        this.routePush({ name: 'wifiSetting1237' })
      }
    }
  }
</script>
