<template>
  <Page title="新建关键事件"
        closePrompt
        hasSubmit
        listenBack
        @back="back"
        @submit="submit">
    <el-popover placement="right-start"
                width="500"
                trigger="click"
                v-model="showUser">
      <div class="vx-emojis">
        <keep-alive>
          <SelectPopoverUser title="成员选择"
                             :users="users"
                             :multiselect="false"
                             @submit="handelUser" />
        </keep-alive>
      </div>
      <Item slot="reference">
        <div>相关人员</div>
        <div slot="remark">{{user.name ? user.name : '必填'}}</div>
      </Item>
    </el-popover>
    <Item :hasClick="false">
      <div>日期</div>
      <div slot="after">
        <el-date-picker v-model="sdate"
                        prefix-icon="x"
                        type="date"
                        placeholder="选择日期"
                        value-format="MM-dd"
                        format="MM-dd"
                        :clearable="false">
        </el-date-picker>
      </div>
    </Item>
    <TextInput placeholder="内容"
               :max="500"
               v-model="content" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'
  export default {
    mixins: [R, MixinMessage],
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve),
      SelectPopoverUser: resolve => require(['@/views/components/group/SelectPopoverUser'], resolve)
    },
    data() {
      return {
        showUser: false,
        sdate: '',
        content: '',
        user: {}
      }
    },
    computed: {
      users() {
        return this.getGroupUsers(this.groupId, '4') || []
      }
    },
    methods: {
      submit() {
        if (Check.isNullObject(this.user)) {
          this.$message({ type: 'warning', message: '相关人不能为空' })
          return
        }
        if (Check.isNullObject(this.sdate)) {
          this.$message({ type: 'warning', message: '事件不能为空' })
          return
        }
        if (Check.isNullString(this.content)) {
          this.$message({ type: 'warning', message: '内容不能为空' })
          return
        }
        this.addMessage(
          this.constructionMessage({
            type: '1190',
            groupId: this.currentGroup.groupId,
            msgJson: JSON.stringify({
              userId: this.user.userId,
              content: this.content,
              sdate: DateUtils.format_0800(this.sdate)
            }),
            content: `{\\@\\${this.user.name}\\${this.user.userId}\\}`,
            notify: [this.userId]
          })
        ).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      },
      handelUser(u) {
        this.showUser = false
        this.user = u[0]
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
