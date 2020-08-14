<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item :hasClick="false">
      <div slot="main">维度名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="dimension.name" />
    </item>
    <item @click="handleAuthUser">
      <div slot="main">颁发权限</div>
      <div slot="remark"
           v-html="dimension.remarkTxt"></div>
    </item>
    <div v-if="dimension.id"
         class="button button-common"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        dimension: {
          name: '',
          users: [],
          remarkTxt: ''
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        classMedal: 'getClassMedal'
      }),
      title() {
        return this.dimension.id ? '编辑维度' : '新建维度'
      }
    },
    methods: {
      ...mapActions(['setClassMedal']),
      fectchData() {
        let that = this
        let cache = that.classMedal.cache
        if (that.classMedal.dimension) {
          that.dimension = { ...that.classMedal.dimension }
        } else if (cache) {
          that.dimension = { ...cache }
          Api.loadDimensionUsers(cache.id).then(res => {
            if (Check.isRealArray(res.ratingUsers)) {
              that.dimension = { ...cache, users: res.ratingUsers, remarkTxt: `${res.ratingUsers.length}人` }
            }
          })
        }
      },
      handleAuthUser() {
        this.setClassMedal({ dimension: this.dimension })
        this.routePush({ name: 'selectMember1144' })
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该维度？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            CategoryApi.addCategory([
              {
                id: that.dimension.id,
                groupId: that.currentGroup.groupId,
                status: 'd'
              }
            ]).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this

        let dim = that.dimension
        if (Check.isNullString(dim.name)) {
          that.$message({ message: '维度名称不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(dim.users)) {
          that.$message({ message: '请设置颁发权限', type: 'warning' })
          return false
        }

        let category = {
          groupId: that.currentGroup.groupId,
          name: dim.name,
          type: '70'
        }
        dim.id && (category.id = dim.id)

        CategoryApi.addCategory([category]).then(res => {
          let users = dim.users.map(v => {
            return {
              userId: v.userId,
              name: v.name,
              status: 1,
              avatar: v.avatar,
              categoryId: res.categorys[0].id
            }
          })
          Api.commitDimensionUsers(users).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        })
      }
    }
  }
</script>
