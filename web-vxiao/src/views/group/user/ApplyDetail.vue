<template>
  <Page title="入群申请">
    <Item :hasClick="false">
      <div>身份</div>
      <div slot="remark">{{labelRole(user.userType).label}}</div>
    </Item>
    <template v-if="user.userType==='2' || user.userType==='1'">
      <Item :hasClick="false">
        <div>姓名</div>
        <div slot="remark">{{user.name}}</div>
      </Item>
    </template>
    <template v-else-if="user.userType==='3'">
      <Item :hasClick="false">
        <div>家长姓名</div>
        <div slot="remark">{{user.name}}</div>
      </Item>
      <Item v-for="(u,i) in user.userRelations"
            :hasClick="false"
            :key="i">
        <div>学生姓名</div>
        <div slot="remark">{{u.name}}</div>
      </Item>
    </template>
    <template v-else-if="user.userType==='4'">
      <Item :hasClick="false">
        <div>学生姓名</div>
        <div slot="remark">{{user.name}}</div>
      </Item>
    </template>
    <div class="list-button">
      <el-button type="primary"
                 icon="el-icon-upload"
                 size="medium"
                 @click="onAgree">同意</el-button>
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="onUnAgree">不同意</el-button>
    </div>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  export default {
    data() {
      return {
        user: {}
      }
    },
    created() {
      this.userId = this.routeQuery('userId')
      this.groupId = this.routeQuery('groupId')
      Api.getApplyUser(this.groupId, this.userId).then(res => {
        res.relations.forEach(u => {
          this.user = u
        })
      })
    },
    methods: {
      onAgree() {
        Api.modifyApply({
          relation: {
            userId: this.userId,
            groupId: this.groupId,
            isAudit: 2
          }
        }).then(res => {
          this.routeBack()
        })
      },
      onUnAgree() {
        this.$prompt(' ', '不同意', {
          inputPlaceholder: '原因',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            Api.modifyApply({
              relation: {
                isAudit: 1,
                extension: value,
                userId: this.userId,
                groupId: this.groupId
              }
            }).then(res => {
              this.routeBack()
            })
          })
          .catch(() => {})
      }
    }
  }
</script>
