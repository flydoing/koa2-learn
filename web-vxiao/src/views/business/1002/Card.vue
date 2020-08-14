<template>
  <Card :message="message">
    <template v-if="routeQuery('appType')==='1073'"
              slot="down">
      <el-dropdown trigger="click"
                   placement="bottom"
                   class="drop-down">
        <div>
          <i class="ico ico-down"></i>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item @click.native.stop="removeClassRoomCard">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else
              slot="down">
      <CardDown :m="message">
        <el-dropdown-item v-if="userId===message.fromUserId"
                          @click.native.stop="homeworkRedo">重做</el-dropdown-item>
      </CardDown>
    </template>
    <span class="text-color"
          slot="name"
          @click="handleLabel">{{m.title || ''}}{{m.name}}</span>
    <CardHref slot="category"
              :content="categoryName"
              @click="handleHref" />
    <CardHref slot="href"
              :content="btnText"
              @click="handleHrefDetail" />
    <template slot="counter">
      <span v-if="counter.showCounter">{{counter.label}} {{counter.readCount}}</span>
      <span v-else></span>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import R from '@/views/group/mixin'
  export default {
    mixins: [CardMixin, R],
    props: {
      message: {
        type: [Object]
      }
    },
    methods: {
      handleLabel() {
        let m = this.message
        if (m.categoryId) {
          this.setStorage('_message_params_cache', {
            type: '1002',
            categoryId: m.categoryId,
            queryType: 'category'
          })
          this.setStorage('_message_list_refresh', true)
          this.routePushModel({
            path: '/vx/group/business/message/list',
            query: {
              title: `${m.categoryName}${m.businessName}`
            }
          })
        } else {
          this.handleLogo({ queryType: 'appType' })
        }
      },
      handleHrefDetail() {
        if (this.message.msgType) {
          // 在线作业
          this.setStorage('homeworkAnswer', JSON.parse(this.message.remark).answer)
          this.setStorage('homeworkContent', {
            content: this.message.content,
            medias: this.message.medias,
            subjectName: this.message.categoryName
          })
          let remark = this.message.remark ? JSON.parse(this.message.remark) : {}
          // 同一个班是否有两个孩子 所有孩子都交作业跳转作业详情，否则跳转孩子列表
          let notAll = false
          remark.hasOwnProperty('users') &&
            remark.users.length > 1 &&
            remark.users.some(u => {
              if (u.extension === '0') {
                notAll = true
              }
            })
          if (notAll) {
            this.setStorage('childrenList', remark.users)
            this.routePushModel({
              name: 'childrenList1002',
              query: {
                msgId: this.message.id,
                appType: this.message.type
              }
            })
          } else {
            if (this.isTeacher) {
              this.routePushModel({
                name: 'onlineAnswerDetail1002',
                query: {
                  msgId: this.message.id,
                  appType: this.message.type,
                  batchBol: this.message.fromUserId === this.userId
                }
              })
            } else {
              this.routePushModel({
                name: 'onlineAnswerDetail1002',
                query: {
                  msgId: this.message.id,
                  appType: this.message.type,
                  respond: this.message.readed === 0 ? true : void 0
                }
              })
            }
          }
        } else {
          // 线下作业
          if (this.message.extensionType) {
            this.routePushModel({
              name: 'gradeTable1002',
              query: {
                msgId: this.message.id
              }
            })
          } else {
            this.routePushModel({
              name: 'studentList1002',
              query: {
                msgId: this.message.id,
                appType: this.message.type
              }
            })
          }
        }
      },
      homeworkRedo() {
        this.routePushModel({
          name: 'redoStudents1002',
          query: {
            msgId: this.message.id
          }
        })
      },
      removeClassRoomCard() {
        this.$emit('remove', this.message)
      }
    },
    computed: {
      btnText() {
        // 如果存在msgType 代表是线上作业，否则线下作业
        // 如果是老师， 显示查看答卷, 如果是学生、家长，提交作业了（extensionType存在）显示查看答卷，否则显示提交作业
        // 如果是老师，不存在msgType 代表线下作业
        // 如果是是线下作业，未发布，显示发布作业成绩 ，否则显示 查看作业成绩
        if (this.isTeacher) {
          // 老师
          if (this.message.msgType) {
            // 线上作业
            return '查看答卷'
          } else if (!this.message.extensionType && this.message.fromUserId === this.userId) {
            return '发布作业成绩'
          } else {
            return this.message.extensionType ? '查看作业成绩' : ''
          }
        } else {
          // 学生、家长
          if (this.message.msgType) {
            // 线上作业 已提交
            return this.message.readed ? '查看答卷' : '提交作业'
          } else if (this.isParent) {
            let json = JSON.parse(this.message.remark || '{}')
            if (json.parentAppraise === 1) {
              return this.message.extensionType ? '查看作业成绩' : '发布作业成绩'
            } else {
              return this.message.extensionType ? '查看作业成绩' : ''
            }
          } else {
            // 线下作业 已发布成绩
            return this.message.extensionType ? '查看作业成绩' : ''
          }
        }
      },
      categoryName() {
        let that = this
        if (that.message) {
          let json = JSON.parse(that.message.remark || '{}')
          return json.categoryName || ''
        }
      },
      counter() {
        return {
          readCount: this.message.readCount || 0,
          label: this.message.msgType ? '已交' : '已阅',
          showCounter: this.message.msgType ? true : this.message.readCount > 0
        }
      }
    }
  }
</script>
