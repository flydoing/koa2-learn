<template>
  <Card :message="message">
    <CardHref v-if="!message.remark"
              content="立即评课"
              @click="handleHrefDetail('set')" />
    <CardHref v-if="userId === message.fromUserId || isAdmin"
              content="查看详情"
              @click="handleHrefView" />
    <CardHref v-else-if="message.remark"
              content="查看详情"
              @click="handleHrefDetail('view')" />
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="userId===message.fromUserId"
                        @click.native.stop="publicCourseEidt">编辑</el-dropdown-item>
    </CardDown>
  </Card>
</template>
<script>
import CardMixin from '@/views/components/card/mixin'
export default {
  mixins: [CardMixin],
  props: {
    message: {
      type: [Object]
    }
  },
  methods: {
    // 查看详情：管理员，创建人
    handleHrefView() {
      let parentId = this.message.id
      // 1.创建老师或者管理员，直接进入子消息列表页面
      this.routePushModel({
        name: 'detailIndex1192',
        query: {
          msgId: parentId,
          appType: this.message.type
        }
      })
    },
    // 立即评课/查看详情
    handleHrefDetail(type) {
      let msgJson = JSON.parse(this.message.msgJson)
      let isOpen = msgJson.isPublic // 是否公开内容
      let isRemark = this.message.remark // true -- 表示已评
      let templateId = msgJson.templateId
      let parentId = this.message.id
      if (type === 'set') {
        this.routePushModel({
          name: 'createComment1192',
          query: {
            msgId: this.message.id,
            templateId: templateId
          }
        })
      } else if (type === 'view') {
        // 1.如果是公开评价内容，直接进入子消息列表页面
        if (parseInt(isOpen)) {
          this.routePushModel({
            name: 'detailIndex1192',
            query: {
              msgId: parentId,
              appType: this.message.type
            }
          })
        } else if (isRemark) {
          this.routePushModel({
            name: 'publicCourseCommentDetail1192',
            query: {
              msgId: isRemark,
              appType: this.message.type
            }
          })
        }
      }
      // 1.1如果是公开评价内容，直接进入子消息列表页面,
      // if (parseInt(isOpen)) {
      //   this.routePushModel({
      //     name: 'detailIndex1192',
      //     query: {
      //       msgId: parentId,
      //       appType: this.message.type
      //     }
      //   })
      // } else {
      //   // 1.2否则（不公开评价内容）如果已评价，直接进入评价详情
      //   if (isRemark) {
      //     this.routePushModel({
      //       name: 'publicCourseCommentDetail1192',
      //       query: {
      //         msgId: isRemark,
      //         appType: this.message.type
      //       }
      //     })
      //   } else {
      //     // 1.3如果还未评价，直接进入新建评价界面
      //     this.routePushModel({
      //       name: 'createComment1192',
      //       query: {
      //         msgId: this.message.id,
      //         templateId: templateId
      //       }
      //     })
      //   }
      // }
      // old======
      // if (currentUserId !== crateUserId && currentUserId !== lecturerId) {
      //   // 1.普通老师
      //   // 1.1如果是公开评价内容，直接进入子消息列表页面,
      //   if (parseInt(isOpen)) {
      //     this.routePushModel({
      //       name: 'detailIndex1192',
      //       query: {
      //         msgId: parentId,
      //         appType: this.message.type
      //       }
      //     })
      //   } else {
      //     // 1.2否则（不公开评价内容）如果已评价，直接进入评价详情
      //     if (isRemark) {
      //       this.routePushModel({
      //         name: 'publicCourseCommentDetail1192',
      //         query: {
      //           msgId: isRemark,
      //           appType: this.message.type
      //         }
      //       })
      //     } else {
      //       // 1.3如果还未评价，直接进入新建评价界面
      //       this.routePushModel({
      //         name: 'createComment1192',
      //         query: {
      //           templateId: templateId
      //         }
      //       })
      //     }
      //   }
      // } else {
      //   // 2.创建老师或者主讲老师 直接进入子消息列表页面
      //   this.routePushModel({
      //     name: 'detailIndex1192',
      //     query: {
      //       msgId: parentId,
      //       appType: this.message.type
      //     }
      //   })
      // }
    },
    publicCourseEidt() {
      this.routePushModel({
        name: 'publicCourseEdit1192',
        query: {
          msgId: this.message.id
        }
      })
    }
  }
}
</script>
