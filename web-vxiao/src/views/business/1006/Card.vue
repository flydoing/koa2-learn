<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || message.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <span slot="label"
          class="text-color has-click"
          @click="handleInscription"
          v-html="labelTxt"></span>
    <CardContent slot="content"
                 :content="m.content">
      <div v-html="m.title"></div>
    </CardContent>
    <template slot="counter">
      <span>反馈{{message.readCount}}</span>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    computed: {
      m() {
        let _m = this.converMessage(this.message)
        try {
          let json = JSON.parse(_m.msgJson)
          if (!Check.isNullObject(json) && json.name) {
            _m.title = json.name.concat('<br>').concat(_m.title)
          }
        } catch (e) {}
        return _m || {}
      },
      inscription() {
        if (this.m.msgJson) {
          return JSON.parse(this.m.msgJson).signature
        }
        return false
      },
      labelTxt() {
        if (this.inscription) {
          return this.inscription.groupName
        }
        return this.m.label
      }
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
      handleInscription() {
        let ins = this.inscription
        if (ins) {
          if (ins.groupType === '18') {
            this.routePushModel({
              path: '/vx/group/user/team/detail',
              query: {
                groupId: ins.groupId
              }
            })
          } else {
            this.routePushModel({
              path: '/vx/group/about',
              query: {
                groupId: ins.groupId
              }
            })
          }
        } else {
          this.userDetail()
        }
      }
    }
  }
</script>
