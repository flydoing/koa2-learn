<template>
  <Card :message="message">
    <CardHref slot="category"
              :content="message.categoryName"
              @click="handleHref" />
    <CardHref slot="href"
              :content="btnText"
              @click="handleHrefDetail" />
    <template slot="counter">
      <span>{{counter.label}}{{counter.readCount}}</span>
    </template>
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
      handleHrefDetail() {
        if (this.isTeacher) {
          this.routePushModel({
            name: 'teacherDetail1208',
            query: {
              type: JSON.parse(this.message.msgJson).type,
              msgId: this.message.id
            }
          })
        } else {
          if (this.message.readed === 0) {
            // 还没作答
            this.routePushModel({
              name: 'studentReply1208',
              query: {
                type: JSON.parse(this.message.msgJson).type,
                msgId: this.message.id
              }
            })
          } else {
            // 已经作答
            if (JSON.parse(this.message.msgJson).type === '2') {
              // 线下
              this.routePushModel({
                name: 'teacherDetail1208',
                query: {
                  type: JSON.parse(this.message.msgJson).type,
                  msgId: this.message.id
                }
              })
            } else {
              // 线上
              this.routePushModel({
                name: 'studentReview1208',
                query: {
                  type: JSON.parse(this.message.msgJson).type,
                  msgId: this.message.id,
                  userId: this.userId
                }
              })
            }
          }
        }
      }
    },
    computed: {
      btnText() {
        if (!this.isTeacher) {
          // 学生、家长
          if (this.message.readed) {
            // 已答
            return '查看详情'
          } else {
            // 未答
            return '开始作答'
          }
        } else {
          // 老师
          return '查看详情'
        }
      },
      counter() {
        return {
          readCount: this.message.readCount,
          label: '已答'
        }
      }
    }
  }
</script>
