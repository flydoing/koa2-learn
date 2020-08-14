<template>
  <Page title="基本信息"
        :loading="loading">
    <Item label="姓名"
          :hasClick="hasAuth"
          :remark="student.name"
          @click="handleName" />
    <template v-if="hasAuth">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleGender">
        <div class="el-dropdown-link">
          <item label="性别"
                :remark="genderTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(g,i) in genders"
                            :key="i"
                            :command="g">{{g.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <Item label="性别"
            :remark="genderTxt"
            :hasClick="false" />
    </template>
    <template v-if="hasAuth">
      <el-popover placement="bottom-end"
                  width="400"
                  trigger="click"
                  v-model="showNation">
        <div class="vx-emojis">
          <scroller :height="300">
            <Item v-for="n in nations"
                  :key="n.id"
                  @click="handleNational(n)">
              <div>{{n.name}}</div>
            </Item>
          </scroller>
        </div>
        <Item slot="reference"
              label="民族"
              :remark="student.national">
        </Item>
      </el-popover>
    </template>
    <template v-else>
      <Item label="民族"
            :remark="student.national"
            :hasClick="false" />
    </template>
    <Item label="学籍号"
          :hasClick="false">
      <template v-if="hasAuth">
        <input slot="remark"
               v-model="student.studentCode"
               placeholder="输入内容"
               @blur="handleInput('studentCode')" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="student.studentCode"></div>
      </template>
    </Item>
    <Item label="身份证"
          :hasClick="false">
      <template v-if="hasAuth">
        <input slot="remark"
               v-model="student.idcard"
               placeholder="18位数身份证号码"
               @blur="handleInput('idcard')" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="student.idcard"></div>
      </template>
    </Item>
    <Item label="生日"
          :hasClick="false">
      <template v-if="hasAuth">
        <div slot="after">
          <el-date-picker v-model="student.birthDay"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          @change="handleConfirm"></el-date-picker>
        </div>
      </template>
      <template v-else>
        <div slot="remark"
             v-html="student.birthDay"></div>
      </template>
    </Item>
    <template v-if="hasAuth">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleWether">
        <div class="el-dropdown-link">
          <item label="是否住校"
                :remark="wetherTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(w,i) in wethers"
                            :key="i"
                            :command="w">{{w.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <Item label="是否住校"
            :remark="wetherTxt"
            :hasClick="false" />
    </template>
  </Page>
</template>
<script>
  import Api from '@/api/user'
  import CategoryApi from '@/api/category'
  import UserMixin from './mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [UserMixin],
    data() {
      return {
        loading: true,
        student: {},
        genders: [
          {
            name: '男',
            value: '1'
          },
          {
            name: '女',
            value: '2'
          }
        ],
        wethers: [
          {
            name: '是',
            value: 1
          },
          {
            name: '否',
            value: 0
          }
        ],
        showNation: false,
        nations: []
      }
    },
    computed: {
      hasAuth() {
        return this.isAdmin || this.userId === this.student.id
      },
      wetherTxt() {
        return this.student.isStay === 1 ? '是' : '否'
      },
      genderTxt() {
        return this.student.sex === '1' ? '男' : '女'
      }
    },
    activated() {
      Api.getUserBaseById(this.routeQuery('userId')).then(res => {
        if (res.user) {
          let user = res.user
          this.student = {
            ...user,
            birthDay: user.birthDay || '',
            studentCode: user.studentCode || '',
            idcard: user.idcard || '',
            national: user.national || ''
          }
        }
        this.loading = false
      })
      CategoryApi.getCategorys({
        type: '89'
      }).then(res => {
        this.nations = res.categorys || []
      })
    },
    methods: {
      commitData(property, value, cback) {
        let user = { ...this.student }
        user[property] = value
        Api.modifyUser(user).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.student = user
          cback && cback()
        })
      },
      handleName() {
        this.$prompt(' ', '修改姓名', {
          inputPlaceholder: '请输入',
          inputValue: this.student.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (!Check.isNullString(value)) {
            this.$message({ message: '姓名不能为空', type: 'warning' })
            return false
          }
          this.commitData('name', value)
        })
      },
      handleGender(g) {
        this.commitData('sex', g.value)
      },
      handleNational(n) {
        this.commitData('national', n.name, () => {
          this.showNation = false
        })
      },
      handleInput(type) {
        if (type === 'idcard') {
          let idcard = this.student.idcard
          if (!Check.isNullString(idcard) && (idcard.length < 18 || idcard.length > 18)) {
            this.$message({ message: '身份证号码长度不正确', type: 'warning' })
            return false
          }
        }
        this.commitData(type, this.student[type])
      },
      handleConfirm(time) {
        this.commitData('birthDay', time)
      },
      handleWether(w) {
        this.commitData('isStay', w.value)
      }
    }
  }
</script>
