<template>
  <page :title="appraisal.title" @submit="handleSubmit" hasSubmit :hasClose="false">
    <item :hasClick="false">
      <div slot="main">项目名称</div>
      <input slot="remark" placeholder="输入内容" v-model="project.name" />
    </item>
    <template v-if="appraisal.depth == 2">
      <item :hasClick="false">
        <div slot="main">评估分值</div>
        <input slot="remark" placeholder="必填" v-model="project.value" />
        <div slot="after">分</div>
      </item>
      <item :hasClick="false">
        <div slot="main">主评估人权重</div>
        <input slot="remark" placeholder="必填" v-model="project.extension" />
      </item>
      <item :hasClick="false">
        <div slot="main">副评估人权重</div>
        <input slot="remark" placeholder="必填" v-model="project.remark" />
      </item>
      <TextInput placeholder="评估说明" v-model="project.description"></TextInput>
    </template>
    <div v-if="project.id" class="button button-common" @click="handleRemove">删除项目</div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import CategoryApi from '@/api/category'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      project: {
        name: '',
        value: '',
        remark: 0.5,
        extension: 0.5,
        description: ''
      }
    }
  },
  created() {
    this.fectchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSuperviseAppraisal'
    })
  },
  methods: {
    ...mapActions(['setSuperviseAppraisal']),
    fectchData() {
      if (this.appraisal.project) {
        this.project = { ...this.appraisal.project }
      }
    },
    handleRemove() {
      const that = this
      let txt = that.appraisal.depth === 1 ? '确定删除该项目及其下级项目？' : '确定删除该项目？'
      that.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CategoryApi.addCategory([{ id: that.project.id, status: 'd', groupId: that.currentGroup.groupId }]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      })
    },
    handleSubmit() {
      const that = this
      let appraisal = that.appraisal
      let p = that.project

      if (Check.isNullString(p.name)) {
        that.$message({ message: '项目名称不能为空', type: 'warning' })
        return false
      }

      let postData = {
        name: p.name,
        groupId: that.currentGroup.groupId,
        type: '130',
        parentId: 0
      }

      if (appraisal.depth === 2) {
        if (Check.isNullString(p.value)) {
          that.$message({ message: '项目分值不能为空', type: 'warning' })
          return false
        }

        let mWeight = parseFloat(p.extension)
        let oWeight = parseFloat(p.remark)
        if (Check.isNullString(p.extension) || Check.isNullString(p.remark) || (mWeight + oWeight !== 1)) {
          that.$message({ message: '主副评估人权重总和必须等于1', type: 'warning' })
          return false
        }
        postData = { ...postData, ...p, parentId: appraisal.parent.id }
      }

      p.id && (postData.id = p.id)

      CategoryApi.addCategory([postData]).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    }
  }
}

</script>
