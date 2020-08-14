<template>
  <page title="新建公开课"
        closePrompt
        hasSubmit
        @submit="publicCourseSubmit"
        listenBack
        @back="back">
    <div class="public-course-create">
      <item @click="selectTeacher">
        <div>主讲老师</div>
        <span slot="remark"
              class="ellipsis">{{createMain.teacher.name}}</span>
      </item>
      <item @click="selectSubject">
        <div>科目</div>
        <span slot="remark"
              class="ellipsis">{{createMain.subject.name}}</span>
      </item>
      <item :hasClick="false">
        <div>课题</div>
        <input type="text"
               placeholder="必填"
               v-model="createMain.task"
               slot="remark">
      </item>
      <el-dropdown trigger="click"
                   @command="handleGrade">
        <item>
          <div>级别</div>
          <span slot="remark">{{createMain.curGrade.text || '必填'}}</span>
        </item>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(grade,i) in createMain.gardes"
                            :key="i"
                            :grade="grade"
                            :command="grade">{{grade.text}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click"
                   @command="handleClassType">
        <item>
          <div>课型</div>
          <span slot="remark">{{createMain.curClassType.name || '选填'}}</span>
        </item>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(classType,i) in createMain.classTypes">
            <el-dropdown-item v-if="createMain.classTypes.length>0"
                              :key="i"
                              :command="classType">{{classType.name}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <item :hasClick="false"
            class="timer">
        <div>时间</div>
        <div slot="remark"
             style="padding-right: 0;">
          <el-date-picker v-model="createMain.timer"
                          align="right"
                          type="date"
                          placeholder="选择日期"
                          :clearable="false"
                          prefix-icon="xxx"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-dropdown trigger="click"
                       @command="handleClassSerial">
            <item>
              <div>{{createMain.curClassSerial.name || '节数'}}</div>
            </item>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(classSerial,i) in createMain.classSerials"
                                :key="i"
                                :command="classSerial">{{classSerial.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </item>
      <item :hasClick="false">
        <div>地点</div>
        <input type="text"
               placeholder="必填"
               v-model="createMain.address"
               slot="remark">
      </item>
      <item :hasClick="false">
        <div>接待对象</div>
        <input type="text"
               placeholder="选填"
               v-model="createMain.reception"
               slot="remark">
      </item>
      <item @click="handleSwitch('isOpen')">
        <div>评价内容公开</div>
        <div slot="remark">
          <i-switch :value="createMain.isOpen"
                    @click="handleSwitch('isOpen')"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="handleSwitch('isAnonymity')">
        <div>评价人匿名</div>
        <div slot="remark">
          <i-switch :value="createMain.isAnonymity"
                    @click="handleSwitch('isAnonymity')"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="selectTemplate">
        <div>评价模板</div>
        <span slot="remark">{{createMain.template.title || '选择'}}</span>
      </item>
      <TextInput placeholder="简介"
                 v-model="createMain.content"></TextInput>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import DateUtil from '@/utils/date'
  import MsgApi from '@/api/message'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        createMain: {
          teacher: {
            name: ''
          },
          subject: {
            name: ''
          },
          task: '',
          curClassType: {},
          curGrade: {},
          curClassSerial: {},
          gardes: [
            {
              text: '校级',
              type: 1
            },
            {
              text: '区级',
              type: 2
            },
            {
              text: '市级',
              type: 3
            },
            {
              text: '省级',
              type: 4
            },
            {
              text: '国家级',
              type: 5
            }
          ],
          classTypes: [],
          timer: '',
          classSerials: [],
          address: '',
          reception: '',
          isOpen: true,
          isAnonymity: false,
          template: {},
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        cacheMain: 'getPublicCourseCreateMain'
      })
    },
    activated() {
      if (this.cacheMain.isEdit) {
        this.createMain = JSON.parse(JSON.stringify(this.cacheMain))
      } else if (this.routeQuery('msgId')) {
        // 卡片下拉编辑
        MsgApi.getMessageById(this.routeQuery('msgId')).then(res => {
          let curContent = JSON.parse(res.message.msgJson)
          this.createMain.teacher.name = curContent.userName
          this.createMain.teacher.userId = curContent.userId
          this.createMain.subject.name = curContent.subjectName
          this.createMain.subject.id = curContent.subjectId
          this.createMain.task = curContent.title
          this.createMain.curGrade.text = curContent.scale
          this.createMain.curClassType.value = curContent.classType
          this.createMain.curClassType.name = curContent.classTypeName
          this.createMain.timer = curContent.description.split(' ')[0]
          this.createMain.curClassSerial.name = curContent.description.split(' ')[1]
          this.createMain.curClassSerial.start = curContent.openDate.split(' ')[1].slice(0, 5)
          this.createMain.address = curContent.address
          this.createMain.reception = curContent.guest
          this.createMain.isOpen = Number(curContent.isPublic) === 1 ? true : 0
          this.createMain.isAnonymity = curContent.isAnonymous === '0' ? 0 : true
          this.createMain.template.id = curContent.templateId
          this.createMain.template.title = curContent.templateName
          this.createMain.content = curContent.content
        })
      }
      if (!this.cacheMain.isEdit) {
        Api.getCreateTimer(this.currentGroup.groupId).then(res => {
          res.times.forEach(t => {
            t.text = t.name
          })
          this.createMain.classSerials = [...res.times]
        })
        CategoryApi.getCategorysByType('196').then(res => {
          this.createMain.classTypes = [...res.categorys]
        })
      }
    },
    methods: {
      ...mapActions(['savePublicCourseCreateMain', 'clearPublicCourseCreateMain']),
      handleGrade(grade) {
        this.createMain.curGrade = grade
      },
      handleClassType(classType) {
        this.createMain.curClassType = classType
      },
      handleClassSerial(classSerial) {
        this.createMain.curClassSerial = classSerial
      },
      handleSwitch(key) {
        this.createMain[key] = !this.createMain[key]
      },
      selectTeacher() {
        this.saveCache()
        this.routePush({
          name: 'teacherList1192'
        })
      },
      selectSubject() {
        this.saveCache()
        this.routePush({
          name: 'publicCourseSubject1192'
        })
      },
      selectTemplate() {
        if (this.routeQuery('msgId')) {
          return false
        }
        this.saveCache()
        this.routePush({
          name: 'publicCourseTemplates1192'
        })
      },
      saveCache() {
        this.savePublicCourseCreateMain({
          ...this.createMain,
          isEdit: true
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearPublicCourseCreateMain()
            this.routeBack()
          })
          .catch(() => {})
      },
      publicCourseSubmit() {
        if (!this.createMain.teacher.name) {
          this.errtips('主讲老师不能为空')
          return false
        }
        if (!this.createMain.subject.name) {
          this.errtips('科目不能为空')
          return false
        }
        if (!this.createMain.task) {
          this.errtips('课题内容不能为空')
          return false
        }
        if (!this.createMain.curGrade.text) {
          this.errtips('级别不能为空')
          return false
        }
        if (!this.createMain.timer) {
          this.errtips('请选择日期')
          return false
        }
        if (!this.createMain.curClassSerial.name) {
          this.errtips('请选择节数')
          return false
        }
        if (!this.createMain.address) {
          this.errtips('地点不能为空')
          return false
        }
        if (!this.createMain.template.id) {
          this.errtips('评价模板不能为空')
          return false
        }
        let reqBody = {
          groupId: this.currentGroup.groupId,
          medias: [],
          msgJson: JSON.stringify({
            address: this.createMain.address,
            classType: this.createMain.curClassType.value,
            classTypeName: this.createMain.curClassType.name,
            content: this.createMain.content,
            description: `${this.createMain.timer} ${this.createMain.curClassSerial.name}`,
            guest: this.createMain.reception,
            isAnonymous: this.createMain.isAnonymity ? '1' : '0',
            isPublic: this.createMain.isOpen ? 1 : 0,
            openDate: DateUtil.format_0800(new Date(`${this.createMain.timer} ${this.createMain.curClassSerial.start}`)),
            scale: this.createMain.curGrade.text,
            subjectId: this.createMain.subject.id,
            subjectName: this.createMain.subject.name,
            templateId: this.createMain.template.id,
            templateName: this.createMain.template.title,
            title: this.createMain.task,
            userId: this.createMain.teacher.userId,
            userName: this.createMain.teacher.name
          }),
          type: '1192',
          ...this.constructionMessage()
        }
        if (this.routeQuery('msgId')) {
          this.modifyMessage({
            ...reqBody,
            id: this.routeQuery('msgId')
          }).then(res => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.clearPublicCourseCreateMain()
            this.routeBack()
          })
        } else {
          this.addMessage(reqBody).then(res => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.clearPublicCourseCreateMain()
            this.routeBack()
          })
        }
      },
      errtips(str) {
        this.$message({
          type: 'warning',
          message: str
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .public-course-create {
    .timer {
      .el-dropdown {
        display: inline-block !important;
      }
      .vx-item-right {
        input {
          padding-left: rem(0) !important;
          padding-right: rem(0) !important;
          min-width: rem(100) !important;
          width: rem(220) !important;
        }
      }
    }
    .el-dropdown {
      display: block;
    }
  }
</style>
