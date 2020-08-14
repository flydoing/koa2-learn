<template>
  <page :title="inspection.title" @submit="handleSubmit" hasSubmit>
    <item :hasClick="false">
      <div slot="main">项目名称</div>
      <input slot="remark" placeholder="输入内容" v-model="project.name" />
    </item>
    <template v-if="inspection.depth == 2">
      <item @click="handleRange">
        <div slot="main">适用范围</div>
        <div slot="remark" v-html="project.rangeTxt"></div>
      </item>
      <item @click="handleInspector">
        <div slot="main">巡检人</div>
        <div slot="remark" v-html="inspectorTxt"></div>
      </item>
    </template>
    <div v-if="project.id" class="button button-common" @click="handleRemove">删除项目</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        project: {
          name: '',
          ranges: [],
          rangeTxt: '',
          inspectors: []
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        inspection: 'getInspection'
      }),
      inspectorTxt() {
        return Check.isRealArray(this.project.inspectors) ? `${this.project.inspectors.length}人` : ''
      }
    },
    methods: {
      ...mapActions(['setInspection']),
      fectchData() {
        const that = this
        let inspection = that.inspection
        let cache = inspection.cache

        if (inspection.project) {
          that.project = { ...inspection.project }
          if (Check.isRealArray(inspection.users)) {
            that.project.inspectors = inspection.users
          }
        } else if (cache) {
          that.project = { ...cache }
          if (inspection.depth === 2) {
            that.project = {
              ...that.project,
              ranges: cache.ranges.map(v => { return { id: v.campusId } }),
              rangeTxt: cache.description,
              inspectors: cache.charges
            }
          }
        }
      },
      handleRange() {
        this.setInspection({ project: this.project })
        this.routePush({ name: 'selectRange1216' })
      },
      handleInspector() {
        this.setInspection({ project: this.project, users: this.project.inspectors })
        this.routePush({ name: 'memberList1216' })
      },
      handleRemove() {
        const that = this
        let depth = that.inspection.depth
        let txt = depth === 1 ? '确定删除该项目及其下级项目？' : '确定删除该项目？'
        that.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.commitProject({
            id: that.project.id,
            status: 'd',
            groupId: that.currentGroup.groupId,
            level: depth
          }).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        })
      },
      handleSubmit() {
        const that = this
        let inspection = that.inspection
        let p = that.project

        if (Check.isNullString(p.name)) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }

        let postData = {
          name: p.name,
          groupId: that.currentGroup.groupId,
          parentId: 0,
          level: inspection.depth
        }

        if (inspection.depth === 2) {
          if (!Check.isRealArray(p.ranges)) {
            that.$message({ message: '请选择适用范围', type: 'warning' })
            return false
          }
          if (!Check.isRealArray(p.inspectors)) {
            that.$message({ message: '请选择巡检人', type: 'warning' })
            return false
          }

          postData = {
            ...postData,
            parentId: inspection.parent.id,
            ranges: p.ranges.map(v => { return { campusId: v.id } }),
            charges: p.inspectors.map(v => {
              return {
                userId: v.userId,
                name: v.name,
                avatar: v.avatar
              }
            }),
            description: p.rangeTxt
          }
        }

        p.id && (postData.id = p.id)

        Api.commitProject(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }

</script>
