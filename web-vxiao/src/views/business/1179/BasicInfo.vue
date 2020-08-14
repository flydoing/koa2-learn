<template>
  <page :title="title">
    <item label="职务"
          :remark="form.job"
          @click="handleJob">
    </item>
    <!-- 职称 -->
    <item label="职称"
          :remark="callTxt"
          @click="handleCall">
    </item>
    <!-- 性别 -->
    <template v-if="isEdit">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleGender">
        <div class="el-dropdown-link">
          <item label="性别"
                :remark="genderTxt">
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in genders"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <item label="性别"
            :hasClick="false"
            :remark="genderTxt">
      </item>
    </template>
    <!-- 身份证 -->
    <item label="身份证"
          :remark="form.idCard"
          :hasClick="isEdit"
          @click="handleIdCard">
    </item>
    <!-- 生日 -->
    <template v-if="isEdit">
      <item :hasClick="false"
            label="生日">
        <div slot="after">
          <el-date-picker v-model="form.birthday"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          @change="handleDate"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
    </template>
    <template v-else>
      <item label="生日"
            :hasClick="false"
            :remark="form.birthday">
      </item>
    </template>
    <!-- 政治面貌 -->
    <template v-if="isEdit">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handlePolitic">
        <div class="el-dropdown-link">
          <item label="政治面貌"
                :remark="politicTxt">
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in politicList"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <item label="政治面貌"
            :hasClick="false"
            :remark="politicTxt">
      </item>
    </template>
    <!-- 婚姻状况 -->
    <template v-if="isEdit">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleMarital">
        <div class="el-dropdown-link">
          <item label="婚姻状况"
                :remark="maritalTxt">
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in maritalList"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <item label="婚姻状况"
            :hasClick="false"
            :remark="maritalTxt">
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import DateUtils from '@/utils/date'
  import CategoryApi from '@/api/category'

  export default {
    mixins: [R],
    data() {
      return {
        form: {
          job: '',
          calls: [],
          gender: '1',
          nation: '',
          idCard: '',
          birthday: '',
          politic: null,
          marital: null
        },
        maritalList: [],
        politicList: [],
        genders: [
          {
            name: '男',
            value: '1'
          },
          {
            name: '女',
            value: '2'
          }
        ]
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
        return this.routeQuery('title') || ''
      },
      genderTxt() {
        return this.form.gender === '1' ? '男' : '女'
      },
      callTxt() {
        let calls = this.form.calls
        return calls.length > 0 ? calls[0].name : ''
      },
      politicTxt() {
        return this.form.politic ? this.form.politic.name : ''
      },
      maritalTxt() {
        return this.form.marital ? this.form.marital.name : ''
      },
      isEdit() {
        return this.obj.isEdit === 1
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let userId = this.routeQuery('userId') || this.userId
        if (this.obj.userId) {
          this.modifyCreateObjectField('userId')
        }
        if (this.obj.calls) {
          this.modifyCreateObjectField('calls')
        }
        Api.getTeacherInfo(userId).then(res => {
          if (res.users) {
            let user = res.users[0]
            let json = user.userJson ? JSON.parse(user.userJson) : null
            this.form = {
              ...this.form,
              gender: user.sex,
              userId: user.id,
              nation: user.national || '',
              job: user.job || '',
              idCard: user.idcard ? `${user.idcard.substring(0, 12)}******` : '',
              birthday: user.birthDay ? DateUtils.format(user.birthDay, DateUtils.YMD) : ''
            }
            if (json) {
              if (json.positionalTitles) {
                this.form.calls = json.positionalTitles
              }
              if (json.maritalFertilitys) {
                this.form.marital = json.maritalFertilitys[0]
              }
              if (json.politicalOutlooks) {
                this.form.politic = json.politicalOutlooks[0]
              }
            }
          }
        })
        CategoryApi.getCategorysByTypes('133').then(res => {
          this.maritalList = res.categorys || []
        })
        CategoryApi.getCategorysByTypes('135').then(res => {
          this.politicList = res.categorys || []
        })
      },
      handleJob() {
        this.setCreateObject({ userId: this.form.userId })
        this.routePush({ name: 'jobList1179' })
      },
      handleCall() {
        this.setCreateObject({ calls: this.form.calls, userId: this.form.userId })
        this.routePush({ name: 'callList1179' })
      },
      handleIdCard() {
        const that = this
        this.$prompt(' ', '身份证', {
          inputPlaceholder: '必填',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
          inputErrorMessage: '请输入正确的身份证号码'
        }).then(({ value }) => {
          Api.modifyTeacherInfo({
            users: [
              {
                id: this.form.userId,
                idcard: value
              }
            ]
          }).then(res => {
            this.form.idCard = value
            that.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleGender(item) {
        Api.modifyTeacherInfo({
          users: [
            {
              id: this.form.userId,
              sex: item.value
            }
          ]
        }).then(res => {
          this.form.gender = item.value
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleDate(date) {
        Api.modifyTeacherInfo({
          users: [
            {
              id: this.form.userId,
              birthDay: DateUtils.format_0800(date)
            }
          ]
        }).then(res => {
          this.form.birthday = date
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handlePolitic(item) {
        let politic = {
          categoryId: item.id,
          name: item.name
        }
        if (this.form.politic) {
          politic.id = this.form.politic.id
        }
        Api.modifyTeacherInfo({
          users: [
            {
              id: this.form.userId,
              userJson: JSON.stringify({
                politicalOutlooks: [politic]
              })
            }
          ]
        }).then(res => {
          if (res.users) {
            let json = JSON.parse(res.users[0].userJson)
            this.form.politic = json.politicalOutlooks[0]
          }
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleMarital(item) {
        let marital = {
          categoryId: item.id,
          name: item.name
        }
        if (this.form.marital) {
          marital.id = this.form.marital.id
        }
        Api.modifyTeacherInfo({
          users: [
            {
              id: this.form.userId,
              userJson: JSON.stringify({
                maritalFertilitys: [marital]
              })
            }
          ]
        }).then(res => {
          if (res.users) {
            let json = JSON.parse(res.users[0].userJson)
            this.form.marital = json.maritalFertilitys[0]
          }
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
