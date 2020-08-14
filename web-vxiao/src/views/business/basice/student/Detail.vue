<template>
  <Page title="学生信息">
    <Item :hasClick="false">
      <div>学生姓名</div>
      <div slot="remark">{{student.name}}</div>
    </Item>
    <Item :hasClick="false">
      <div>入学年份</div>
      <div slot="remark">{{student.group.name}}</div>
    </Item>
    <Item :hasClick="false">
      <div>学段</div>
      <div slot="remark">{{student.group.gradeType}}</div>
    </Item>
    <Item :hasClick="false">
      <div>校区</div>
      <div slot="remark">{{student.group.campus}}</div>
    </Item>
    <Item :hasClick="false">
      <div>班级名称</div>
      <div slot="remark">{{student.groupName}}</div>
    </Item>
    <div class="category-title"></div>
    <Item :hasClick="false">
      <div>手机号码</div>
      <div slot="remark">{{student.mobile}}</div>
    </Item>
    <Item :hasClick="false">
      <div>身份证号码</div>
      <div slot="remark">{{student.idCard}}</div>
    </Item>
    <Item :hasClick="false">
      <div>学号</div>
      <div slot="remark">{{student.studentNo}}</div>
    </Item>
    <Item :hasClick="false">
      <div>学籍号</div>
      <div slot="remark">{{student.studentCode}}</div>
    </Item>
    <Item :hasClick="false">
      <div>性别</div>
      <div slot="remark">{{labelSex(student.sex)}}</div>
    </Item>
    <Item :hasClick="false">
      <div>生日</div>
      <div slot="remark">{{student.birthDay | birthDay}}</div>
    </Item>
    <Item :hasClick="false">
      <div>民族</div>
      <div slot="remark">{{student.national}}</div>
    </Item>
    <Item :hasClick="false">
      <div>是否住校</div>
      <div slot="remark">{{student.isStay === '1' ? '住宿' : '不住宿'}}</div>
    </Item>
    <div class="list-button">
      <el-button type="primary"
                 size="medium"
                 @click="onPassword">重置密码</el-button>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import Api from '../api'
  export default {
    mixins: [R],
    data() {
      return {
        student: {}
      }
    },
    created() {
      this.student = this.getStorage('_cache_student') || {}
    },
    methods: {
      onPassword() {
        if (window.location.href.indexOf('pages') > 0) {
          this.$web.postJsAction({
            type: 'resetPassword',
            student: this.student
          })
          return
        }
        if (this.student.openAccount === '2' || Check.isNull(this.student.openAccount)) {
          this.$alert('该学生未开通账号', '重置密码', { confirmButtonText: '确定' })
        } else {
          this.$confirm('确定把该学生账号的密码重置为初始密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let relation = {
              groupId: this.student.groupId,
              user: {
                id: this.student.userId
              }
            }
            Api.resetPassWord(relation).then(res => {
              this.$message({
                type: 'success',
                message: '密码重置成功！'
              })
            })
          })
        }
      }
    },
    filters: {
      birthDay(birthDay) {
        return DateUtils.format(birthDay, DateUtils.YMD)
      }
    }
  }
</script>
