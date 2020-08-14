<template>
  <Page title="群设置">
    <Item @click="handle('isChat')"
          :hasClick="isAdmin">
      <div>群聊</div>
      <div slot="after">
        <i-switch :value="currentGroup.isChat"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isChat')" />
      </div>
    </Item>
    <Item @click="handle('isAddressList')"
          :hasClick="isAdmin">
      <div>成员可见通讯录</div>
      <div slot="after">
        <i-switch :value="currentGroup.isAddressList"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isAddressList')" />
      </div>
    </Item>
    <Item @click="handle('isNew')"
          :hasClick="isAdmin">
      <div>成员新建</div>
      <div slot="after">
        <i-switch :value="currentGroup.isNew"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isNew')" />
      </div>
    </Item>
    <Item @click="handle('isStudentNew')"
          :hasClick="isAdmin"
          v-if="isClass">
      <div>学生新建</div>
      <div slot="after">
        <i-switch :value="currentGroup.isStudentNew"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isStudentNew')" />
      </div>
    </Item>
    <Item @click="handle('isReview')"
          :hasClick="isAdmin">
      <div>成员评论</div>
      <div slot="after">
        <i-switch :value="currentGroup.isReview"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isReview')" />
      </div>
    </Item>
    <Item @click="handle('isInvite')"
          :hasClick="isAdmin">
      <div>成员邀请</div>
      <div slot="after">
        <i-switch :value="currentGroup.isInvite"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isInvite')" />
      </div>
    </Item>
    <Item @click="handle('isModifyNickname')"
          :hasClick="isAdmin">
      <div>成员修改昵称</div>
      <div slot="after">
        <i-switch :value="currentGroup.isModifyNickname"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isModifyNickname')" />
      </div>
    </Item>
    <Item @click="handle('isAudit')"
          :hasClick="isAdmin">
      <div>入群免审核</div>
      <div slot="after">
        <i-switch :value="currentGroup.isAudit"
                  :trueValue="1"
                  :falseValue="0"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isAudit')" />
      </div>
    </Item>
    <Item @click="handle('isWithdraw')"
          :hasClick="isAdmin">
      <div>允许自由退出群组</div>
      <div slot="after">
        <i-switch :value="currentGroup.isWithdraw"
                  :trueValue="1"
                  :falseValue="2"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isWithdraw')" />
      </div>
    </Item>
    <Item @click="handle('isShowApp')"
          :hasClick="isAdmin">
      <div>成员可见应用列表</div>
      <div slot="after">
        <i-switch :value="currentGroup.isShowApp"
                  :trueValue="0"
                  :falseValue="1"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('isShowApp')" />
      </div>
    </Item>
    <Item @click="handle('viewType')"
          :hasClick="isAdmin">
      <div>目录显示</div>
      <div slot="after">
        <i-switch :value="showCatelog"
                  :disabled="!isAdmin"
                  @disabled="onDisabled"
                  @click="handle('viewType')" />
      </div>
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    computed: {
      showCatelog() {
        let viewType = this.currentGroup.viewType
        return viewType === '3' || viewType === '4'
      }
    },
    methods: {
      ...mapActions(['modifyGroup']),
      handle(type) {
        if (!this.isAdmin) {
          this.onDisabled()
          return
        }
        if (type === 'isWithdraw') {
          this.$set(this.currentGroup, type, this.currentGroup[type] === 1 ? 2 : 1)
        } else if (type === 'viewType') {
          this.$set(this.currentGroup, type, this.currentGroup[type] === '1' ? '4' : '1')
        } else {
          this.$set(this.currentGroup, type, this.currentGroup[type] === 0 ? 1 : 0)
        }
        Api.addGroup({
          groups: [this.currentGroup]
        }).then(res => {
          if (Check.isRealArray(res.groups)) {
            this.modifyGroup(res.groups[0])
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      },
      onDisabled() {
        this.$message({ type: 'warning', message: '请联系管理员' })
      }
    }
  }
</script>
