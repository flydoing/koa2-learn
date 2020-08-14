<template>
  <div class="add-user-block">
    <Item :hasClick="false"
          label="角色">
      <el-radio-group slot="remark"
                      v-model="user.userType">
        <el-radio label="2">老师</el-radio>
        <el-radio label="3">家长</el-radio>
        <el-radio label="4">学生</el-radio>
      </el-radio-group>
    </Item>
    <el-dropdown class="block-element"
                 v-if="user.userType==='3'"
                 trigger="click"
                 @command="handleRole">
      <div class="el-dropdown-link">
        <item label="家长身份"
              :remark="role"></item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(role,i) in roles"
                          :key="i"
                          :command="role">{{role.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 管理员给学生添加家长时，手机号改为选填（配合家长人脸录入） -->
    <Item :hasClick="false"
          label="手机号码"
          v-if="user.userType==='3'">
      <input slot="remark"
             placeholder="选填"
             v-model="user.mobile"
             maxlength="11" />
    </Item>
    <Item :hasClick="false"
          label="手机号码"
          v-else>
      <input slot="remark"
             placeholder="必填"
             v-model="user.mobile"
             maxlength="11" />
    </Item>
    <!-- 老师 -->
    <template v-if="user.userType==='2'">
      <Item label="姓名"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="user.name" />
      </Item>
      <el-popover placement="right-start"
                  width="300"
                  trigger="click">
        <div class="vx-emojis">
          <scroller :height="400">
            <Item v-for="(item,i) in subjects"
                  :key="i"
                  :hasArrow="false"
                  @click="subject(item)">
              <div slot="before">
                <i class="ico ico-select"
                   :class="{'active':checkList[item.id]}"></i>
              </div>
              <div slot="main">{{item.name}}</div>
            </Item>
          </scroller>
        </div>
        <Item slot="reference"
              label="任教科目">
          <div slot="remark"
               class="ellipsis">{{user.metaDatas | filterMetaText}}</div>
        </Item>
      </el-popover>
    </template>
    <!-- 家长 -->
    <template v-else-if="user.userType==='3'">
      <div v-for="(student,j) in user.userRelations"
           :key="j">
        <div class="category-title"
             v-if="user.userRelations.length>1"></div>
        <Item :hasClick="false"
              label="学生姓名">
          <input slot="remark"
                 placeholder="必填"
                 v-model="student.name"
                 @change="change" />
        </Item>
        <Item :hasClick="false"
              label="学生生日">
          <input slot="remark"
                 placeholder="选填"
                 v-model="student.birthday" />
        </Item>
        <Item :hasClick="false"
              label="学生性别">
          <el-radio-group slot="remark"
                          v-model="student.sex">
            <el-radio label="2">女</el-radio>
            <el-radio label="1">男</el-radio>
          </el-radio-group>
        </Item>
      </div>
    </template>
    <!-- 学生 -->
    <template v-else-if="user.userType==='4'">
      <Item :hasClick="false"
            label="学生姓名">
        <input slot="remark"
               placeholder="必填"
               v-model="user.name" />
      </Item>
      <Item :hasClick="false"
            label="学生生日">
        <input slot="remark"
               placeholder="选填"
               v-model="user.birthday" />
      </Item>
      <Item :hasClick="false"
            label="学生性别">
        <el-radio-group slot="remark"
                        v-model="user.sex">
          <el-radio label="2">女</el-radio>
          <el-radio label="1">男</el-radio>
        </el-radio-group>
      </Item>
    </template>
    <div class="text-color has-click pd"
         v-if="user.userType==='3'"
         @click="$emit('new','stduent',user)"
         style="line-height: 30px;">还有孩子在同一个班级?</div>
    <slot></slot>
  </div>
</template>
<script>
  import UserEnum from '@/constant/user'
  import CategoryApi from '@/api/category'
  export default {
    props: {
      user: { type: Object }
    },
    data() {
      return {
        role: '家长',
        roles: [],
        subjects: [],
        checkList: {}
      }
    },
    created() {
      CategoryApi.getCategorys({ type: '172' }).then(res => {
        this.roles = res.categorys
      })
      CategoryApi.getCategorysByType('1').then(res => {
        this.subjects = res.categorys
      })
    },
    methods: {
      subject(s) {
        if (this.checkList[s.id]) {
          this.$delete(this.checkList, s.id)
        } else {
          this.$set(this.checkList, s.id, {
            key: s.id,
            obj: s.name,
            status: '1',
            metaType: 'm_teach_course'
          })
        }
      },
      handleRole(item) {
        this.role = item.name
      },
      change() {
        if (this.user.userType === UserEnum.PARENT.key) {
          let studentName = ''
          this.user.userRelations.some((s, i) => {
            studentName = s.name
            return i === 0
          })
          this.$set(this.user, 'name', `${studentName}${this.role}`)
        }
      }
    },
    filters: {
      filterMetaText(metaDatas) {
        let arr = []
        metaDatas.forEach(meta => {
          arr.push(meta.obj)
        })
        return arr.join('、')
      }
    },
    watch: {
      role(v) {
        if (this.user.userType === UserEnum.PARENT.key) {
          let studentName = ''
          this.user.userRelations.some((s, i) => {
            studentName = s.name
            return i === 0
          })
          this.$set(this.user, 'name', `${studentName}${v}`)
        }
      },
      checkList(v) {
        this.$set(this.user, 'metaDatas', Object.values(v))
      }
    }
  }
</script>
<style>
  .el-radio + .el-radio {
    margin-left: 10px;
  }
</style>
