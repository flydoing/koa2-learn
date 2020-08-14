<template>
  <Setup appType="1269">
    <!-- <template v-if="isClass && (isSuperAdmin || isAdmin || isAppAdmin('1269'))" slot="others">
      <item @click="itemClick">
        <div>评价模板</div>
      </item>
      <item @click="allowUploadHandle">
        <div>课中习题背景图</div>
        <div slot="remark">
          <i-switch :value="bgMeta[0].obj==='1'" @click="allowUploadHandle"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
    </template> -->
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1269'))"
              slot="others">
      <item @click="bindIpHandle">
        <div>绑定IP地址</div>
      </item>
      <item @click="itemClick">
        <div>评价模板</div>
      </item>
      <item @click="allowUploadHandle(bgMeta[0])">
        <div>课中习题背景图</div>
        <div slot="remark">
          <i-switch :value="bgMeta[0].obj==='1'"
                    @click="allowUploadHandle(bgMeta[0])"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="allowUploadHandle(expainMate[0])">
        <div>课中答题后可见解析</div>
        <div slot="remark">
          <i-switch :value="expainMate[0].obj==='1'"
                    @click="allowUploadHandle(expainMate[0])"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="allowUploadHandle(qualityReport[0])">
        <div>质量报告所有老师可见</div>
        <div slot="remark">
          <i-switch :value="qualityReport[0].obj==='1'"
                    @click="allowUploadHandle(qualityReport[0])"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="allowUploadHandle(challengerMeta[0])">
        <div>允许竞赛模式</div>
        <div slot="remark">
          <i-switch :value="challengerMeta[0].obj==='1'"
                    @click="allowUploadHandle(challengerMeta[0])"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        bgMeta: [{ obj: '0', metaType: 'm_classroom_question_background' }],
        expainMate: [{ obj: '0', metaType: 'm_classroom_show_expain' }],
        challengerMeta: [{ obj: '0', metaType: 'm_classroom_challenger_mode' }],
        qualityReport: [{ obj: '0', metaType: 'm_allow_non_creator_query_quality_report' }]
      }
    },
    created() {
      Api.getClassSetting(
        this.currentGroup.parentId,
        'm_classroom_question_background,m_classroom_show_expain,m_classroom_challenger_mode,m_allow_non_creator_query_quality_report'
      ).then(res => {
        res.metaDatas &&
          res.metaDatas.forEach(meta => {
            if (meta.metaType === 'm_classroom_question_background') {
              this.bgMeta.splice(0, 1, meta)
            } else if (meta.metaType === 'm_classroom_show_expain') {
              this.expainMate.splice(0, 1, meta)
            } else if (meta.metaType === 'm_classroom_challenger_mode') {
              this.challengerMeta.splice(0, 1, meta)
            } else if (meta.metaType === 'm_allow_non_creator_query_quality_report') {
              this.qualityReport.splice(0, 1, meta)
            }
          })
      })
    },
    methods: {
      itemClick() {
        this.routePush({
          name: 'templateList1192',
          query: {
            appType: this.routeQuery('appType')
          }
        })
      },
      bindIpHandle() {
        this.routePush({
          name: 'bindIpAddress1269'
        })
      },
      allowUploadHandle(meta) {
        let obj = meta.obj === '1' ? '0' : '1'
        GroupApi.updateMetaData([
          {
            userId: this.currentGroup.parentId,
            metaType: meta.metaType,
            // extension: this.currentGroup.groupId,
            obj: obj,
            id: meta.id ? meta.id : void 0
          }
        ]).then(res => {
          this.$message({ type: 'success', message: '设置成功' })
          if (res.metaDatas[0].metaType === 'm_classroom_question_background') {
            this.$set(this.bgMeta[0], 'obj', obj)
          } else if (res.metaDatas[0].metaType === 'm_classroom_show_expain') {
            this.$set(this.expainMate[0], 'obj', obj)
          } else if (res.metaDatas[0].metaType === 'm_classroom_challenger_mode') {
            this.$set(this.challengerMeta[0], 'obj', obj)
          } else if (res.metaDatas[0].metaType === 'm_allow_non_creator_query_quality_report') {
            this.$set(this.qualityReport[0], 'obj', obj)
          }
        })
      }
    }
  }
</script>
