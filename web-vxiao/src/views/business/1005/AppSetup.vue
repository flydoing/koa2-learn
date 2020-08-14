<template>
  <Setup appType="'1005'">
    <template slot="btns">
      <label v-if="!isSchool"
             @click="handlePrint">打印</label>
    </template>
    <template slot="others"
              v-if="showMedalSetting">
      <item @click="medalSetting">
        <div slot="main">勋章设置</div>
      </item>
      <div v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1005'))">
        <item @click="authSetting">
          <div slot="main">职务颁发权限</div>
        </item>
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleModel">
          <div class="el-dropdown-link">
            <item>
              <div slot="main">颁发权限模式</div>
              <div slot="remark"
                   v-html="model.name"></div>
            </item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(md,i) in models"
                              :key="i"
                              :command="md">{{md.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <item @click="showSetting">
          <div slot="main">成长年鉴显示设置</div>
        </item>
        <item>
          <div slot="main">老师可自定义勋章</div>
          <div slot="after">
            <i-switch :value="isSwitched(teacherCustomMeta)"
                      @click="handleSwitch(teacherCustomMeta)"></i-switch>
          </div>
        </item>
        <item>
          <div slot="main">家长可自定义勋章</div>
          <div slot="after">
            <i-switch :value="isSwitched(parentCustomMeta)"
                      @click="handleSwitch(parentCustomMeta)"></i-switch>
          </div>
        </item>
        <item>
          <div slot="main">学生可自评</div>
          <div slot="after">
            <i-switch :value="isSwitched(selfEvaluateMeta)"
                      @click="handleSwitch(selfEvaluateMeta)"></i-switch>
          </div>
        </item>
        <item>
          <div slot="main">学生可互评</div>
          <div slot="after">
            <i-switch :value="isSwitched(mutualEvaluateMeta)"
                      @click="handleSwitch(mutualEvaluateMeta)"></i-switch>
          </div>
        </item>
      </div>
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
    data() {
      return {
        model: {},
        models: [
          {
            name: '职务权限叠加',
            value: 'score_role_sum'
          },
          {
            name: '最高职务权限',
            value: 'score_role_max'
          }
        ]
      }
    },
    created() {
      let mMap = new Map()
      this.models.map(v => {
        mMap.set(v.value, v)
      })
      if (this.modelMeta.obj) {
        this.model = mMap.get(this.modelMeta.obj)
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId'
      }),
      modelMeta() {
        return this.filterData('m_evaluation_score_role')
      },
      parentCustomMeta() {
        return this.filterData('m_parent_self_evaluation')
      },
      teacherCustomMeta() {
        return this.filterData('m_teacher_self_evaluation')
      },
      selfEvaluateMeta() {
        return this.filterData('m_evaluation_student_self_assess')
      },
      mutualEvaluateMeta() {
        return this.filterData('m_evaluation_student_peer_assess')
      },
      showMedalSetting() {
        if (this.isSchool && (this.isSuperAdmin || this.isAdmin || this.isAppAdmin('1005'))) {
          return true
        }
        if (this.isParent && this.parentCustomMeta && this.parentCustomMeta.obj === '1') {
          return true
        }
        if (this.isTeacher && this.teacherCustomMeta && this.teacherCustomMeta.obj === '1') {
          return true
        }
        return false
      }
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      isSwitched(meta) {
        return meta ? meta.obj === '1' : false
      },
      medalSetting() {
        this.routePush({
          name: 'medalSetting1005'
        })
      },
      showSetting() {
        this.routePush({
          name: 'showSetting1005'
        })
      },
      authSetting() {
        this.routePush({
          name: 'authSetting1005'
        })
      },
      handlePrint() {
        this.openBrowser(`/papers/evaluate/print?groupId=${this.currentGroup.groupId}`)
      },
      filterData(type) {
        let that = this
        let groupId = that.currentGroup.groupId
        if (!that.isSchool) {
          let school = that.getSchool(that.currentGroup.parentId)
          groupId = school.groupId
        }
        const metas = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === groupId
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
      },
      handleModel(md) {
        this.modifyMetaData({
          ...this.modelMeta,
          obj: md.value,
          extension: this.groupId
        }).then(res => {
          this.model = md
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
