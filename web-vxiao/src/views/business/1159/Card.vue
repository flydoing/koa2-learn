<template>
  <Card :message="message"
        :parentType="1158"
        @click.native="cardClick">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || message.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <div slot="titles"
         class="toUsers"
         v-if="message.toUsers && message.toUsers.length>0">
      <span>对</span>
      <template v-for="(user, u) in message.toUsers">
        <span class="text-color"
              v-if="user.type==='to'"
              :key="u"
              @click.stop="userDetailHandle(user)">@{{user.name}}</span>
      </template>
      <span>说</span>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      },
      showReply: {
        type: Boolean,
        default: true
      },
      showCounter: { type: Boolean, default: true }
    },
    methods: {
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/message/edit',
          query: {
            msgId: this.message.id,
            title: this.message.businessName
          }
        })
      },
      cardClick() {
        this.routePushModel({
          name: 'cardDetail1158',
          params: {
            msgId: this.message.id
          },
          query: {
            type: this.message.type
          }
        })
      },
      userDetailHandle(user) {
        this.routePush({
          name: 'userDetail',
          params: {
            userId: user.userId
          },
          query: {
            title: user.name,
            userId: user.userId,
            groupId: this.message.groupId
          }
        })
      }
    }
  }
</script>
