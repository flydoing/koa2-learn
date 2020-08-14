<template>
  <page title="新建访客"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="visitor-create">
      <item @click="handleMember">
        <div slot="main">被访人</div>
        <div slot="remark"
             v-html="memberTxt"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">来访人</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item :hasClick="false">
        <div slot="main">预约时间</div>
        <div slot="after">
          <el-date-picker v-model="form.date"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleReason">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">事由</div>
            <div slot="remark"
                 v-html="reasonTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(reason,i) in reasons"
                            :key="i"
                            :command="reason">{{reason.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item :hasClick="false">
        <div slot="main">身份证</div>
        <input slot="remark"
               type="text"
               placeholder="选填"
               v-model="form.idcard" />
      </item>
      <item :hasClick="false">
        <div slot="main">手机号</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="form.mobile" />
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          member: null,
          date: '',
          reason: null,
          idcard: '',
          mobile: ''
        },
        reasons: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        visitor: 'getVisitor'
      }),
      memberTxt() {
        return this.form.member ? this.form.member.name : ''
      },
      reasonTxt() {
        return this.form.reason ? this.form.reason.name : ''
      }
    },
    methods: {
      ...mapActions(['setVisitor', 'deleteVisitorProp']),
      fetchData() {
        const that = this
        if (that.visitor.form) {
          that.form = { ...that.visitor.form }
          if (that.visitor.member) {
            that.form.member = that.visitor.member
            that.deleteVisitorProp('member')
          }
        } else {
          this.form.member = this.groupUsers.filter(v => {
            return v.userId === this.userId
          })[0]
        }
        CategoryApi.getCategorys({ type: '112' }).then(res => {
          that.reasons = res.categorys
        })
      },
      handleMember() {
        this.setVisitor({ form: this.form, member: this.form.member })
        this.routePush({ name: 'selectMember1142' })
      },
      handleReason(item) {
        this.form.reason = item
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(form.name)) {
          that.$message({ message: '来访人不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.date)) {
          that.$message({ message: '预约时间不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullObject(form.reason)) {
          that.$message({ message: '请选择事由', type: 'warning' })
          return false
        }

        if (Check.isNullObject(form.mobile)) {
          that.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }

        let mJson = { name: form.name, mobile: form.mobile }
        if (!Check.isNullString(form.idcard)) {
          mJson.idcard = form.idcard
        }

        let u = form.member
        let postData = that.constructionMessage({
          type: '1142',
          groupId: that.groupId,
          categoryId: form.reason.id,
          isPrivate: 1,
          msgType: '3',
          extensionType: form.date,
          msgJson: JSON.stringify(mJson),
          toUsers: [
            {
              name: u.name,
              userId: u.userId,
              type: 'to',
              userType: u.userType,
              avatar: u.avatar
            }
          ]
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteVisitorProp('form')
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteVisitorProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
