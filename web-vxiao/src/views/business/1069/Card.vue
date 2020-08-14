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
    <CardHref slot="category"
              :content="message.categoryName"
              @click="handleHref" />
    <CardHref slot="href"
              :content="btnText"
              @click="handleHrefDetail" />
    <template slot="counter">
      <span v-if="counter.showCounter">{{counter.label}}{{counter.readCount}}</span>
      <span v-else></span>
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
            name: 'teacherReview1069',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          if (this.message.readed === 1) {
            this.routePushModel({
              name: 'studentReview1069',
              query: {
                msgId: this.message.id,
                pageType: 'studentReview'
              }
            })
          } else {
            this.routePushModel({
              name: 'studentReply1069',
              query: {
                msgId: this.message.id,
                userName: this.message.fromUserName,
                pageType: 'studentReply'
              }
            })
          }
        }
      },
      removeClassRoomCard() {
        this.$emit('remove', this.message)
      }
    },
    computed: {
      counter() {
        return {
          readCount: this.message.readCount,
          label: '已答',
          showCounter: this.message.readCount > 0
        }
      },
      btnText() {
        return this.isTeacher || this.message.readed === 1 ? '查看答卷' : '开始作答'
      }
    }
  }
</script>
