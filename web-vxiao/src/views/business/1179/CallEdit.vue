<template>
  <page :title="title"
        hasSubmit
        closePrompt
        @submit="handleSubmit">
    <item :hasClick="false"
          label="授予时间">
      <div slot="after">
        <el-date-picker v-model="date"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        @change="handleDate"
                        placeholder="必填"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleItem">
      <div class="el-dropdown-link">
        <item label="职称"
              :remark="callTxt">
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in categories"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div v-if="obj.call"
         class="button button-common"
         @click="handleRemove">删除项目</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        date: '',
        category: null,
        categories: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.obj.call ? '编辑职称' : '添加职称'
      },
      callTxt() {
        return this.category ? this.category.name : ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let call = this.obj.call
        if (call) {
          this.category = {
            id: call.categoryId,
            name: call.name
          }
          this.date = DateUtils.format(call.grantDate, DateUtils.YMD)
        }
        CategoryApi.getCategorysByTypes('134').then(res => {
          this.categories = res.categorys || []
        })
      },
      handleItem(item) {
        this.category = item
      },
      handleSubmit() {
        let call = this.obj.call
        if (Check.isNullString(this.date)) {
          this.$message({ message: '授予时间不能为空', type: 'warning' })
          return false
        }
        if (!this.category) {
          this.$message({ message: '请选择职称', type: 'warning' })
          return false
        }
        let data = {
          grantDate: DateUtils.format_0800(this.date),
          categoryId: this.category.id,
          name: this.category.name
        }
        if (call) {
          data.id = call.id
        }
        Api.modifyTeacherInfo({
          users: [
            {
              id: this.obj.userId,
              userJson: JSON.stringify({
                positionalTitles: [data]
              })
            }
          ]
        }).then(res => {
          if (res.users) {
            let json = JSON.parse(res.users[0].userJson)
            this.setCreateObject({ calls: json.positionalTitles })
          }
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        let call = this.obj.call
        this.$confirm('确定删除该职称？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyTeacherInfo({
            users: [
              {
                id: this.obj.userId,
                userJson: JSON.stringify({
                  positionalTitles: [
                    {
                      id: call.id,
                      status: 'd'
                    }
                  ]
                })
              }
            ]
          }).then(res => {
            if (res.users) {
              let json = JSON.parse(res.users[0].userJson)
              this.setCreateObject({ calls: json.positionalTitles })
            }
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
