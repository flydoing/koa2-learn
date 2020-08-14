<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false">
      <input placeholder="分组名称"
             v-model="grouping.name" />
    </item>
    <div class="category-title"></div>
    <item v-for="(item,i) in grouping.schools"
          :key="i"
          :hasClick="false">
      <div slot="main"
           v-html="item.schoolName"></div>
      <i slot="after"
         class='ico ico-delete'
         @click="handleRemoveSchool(item,i)"></i>
    </item>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main">添加学校</div>
    </item>
    <div v-if="grouping.id"
         class="button button-common"
         @click="handleRemove">删除分组</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        grouping: {
          name: '',
          schools: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getSuperviseAppraisal'
      }),
      title() {
        return this.grouping.id ? `编辑分组 ` : '新建分组'
      }
    },
    methods: {
      ...mapActions(['setSuperviseAppraisal']),
      fetchData() {
        let grouping = this.appraisal.grouping
        if (grouping) {
          this.grouping = JSON.parse(JSON.stringify({ ...grouping, schools: grouping.schools || [] }))
        }
      },
      handleAdd() {
        this.setSuperviseAppraisal({ grouping: this.grouping })
        this.routePush({ name: 'selectSchool1170' })
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该分组', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitSchoolGrouping({
              id: that.grouping.id,
              status: 'd',
              eduId: that.currentGroup.parentId
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleRemoveSchool(item, index) {
        this.grouping.schools.splice(index, 1)
      },
      handleSubmit() {
        const that = this
        let grouping = that.grouping

        if (Check.isNullString(grouping.name)) {
          that.$message({ message: '分组名称不能为空', type: 'warning' })
          return false
        }

        let postData = {
          name: grouping.name,
          eduId: that.currentGroup.parentId,
          schools: grouping.schools.map(v => {
            return { schoolId: v.schoolId }
          })
        }
        grouping.id && (postData.id = grouping.id)
        Api.commitSchoolGrouping(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
