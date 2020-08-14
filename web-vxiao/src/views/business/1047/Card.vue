<template>
  <Card :message="message">
    <!-- <CardHref slot="titles" :content="message.title" v-if="isCourse" /> -->
    <!-- <div slot="title" v-if="routeQuery('appType')==='1073'">{{message.title}}</div> -->
    <div slot="content">
      <div>{{m.title}}</div>
      <CardContent :content="m.content" />
    </div>
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
    <CardHref slot="href"
              :content="btnText"
              @click="handleHref" />
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
      handleHref() {
        if (this.routeQuery('appType') === '1073') {
          this.$message({
            type: 'warning',
            message: '开发中'
          })
          return false
        }
        if (this.isTeacher || this.isAdmin) {
          this.routePushModel({
            name: 'teacherDetail1047',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          if (this.message.readed === 1) {
            this.routePushModel({
              name: 'studentReview1047',
              query: {
                msgId: this.message.id,
                pageType: 'studentReview'
              }
            })
          } else {
            this.routePushModel({
              name: 'studentCommitAnswer1047',
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
        this.$emit('remove')
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
      m() {
        return this.converMessage(this.message)
      },
      btnText() {
        if (this.isTeacher || this.isAdmin) {
          return '查看答卷'
        } else {
          return this.message.readed === 1 ? '查看答卷' : '开始作答'
        }
      }
    }
  }
</script>
<style></style>
