<template>
  <Page title="修改手机号码"
        hasSubmit
        @submit="handleSubmit">
    <Item :hasClick="false">
      <input placeholder="必填"
             type="text"
             v-model="mobile" />
    </Item>
    <item :hasClick="false">
      <div slot="before">
        <input type="text"
               class="code-input"
               placeholder="必填"
               v-model="code">
      </div>
      <div slot="remark"
           :class="codeClass"
           @click="handleCode"
           v-html="codeTxt"></div>
    </item>
  </Page>
</template>
<script>
  import Api from '@/api/user'
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        mobile: '',
        second: 120,
        disabled: false,
        code: ''
      }
    },
    computed: {
      codeTxt() {
        return this.disabled ? `已获取（${this.second}s）` : '获取验证码'
      },
      codeClass() {
        return {
          'text-color': true,
          disabled: this.disabled
        }
      }
    },
    created() {
      this.mobile = this.USER.mobile || ''
    },
    methods: {
      ...mapActions(['modifyLoginUser']),
      handleCode() {
        if (!this.disabled) {
          let timer = setInterval(() => {
            if (this.second === 0) {
              clearInterval(timer)
              this.disabled = false
              this.second = 120
            }
            this.second = this.second - 1
          }, 1000)
          if (!this.mobile) {
            this.$message({ type: 'warning', message: `请输入手机号码` })
            return false
          }
          if (!/^1[34578]\d{9}$/.test(this.mobile)) {
            this.$message({ type: 'warning', message: `手机号码格式不正确` })
            return false
          }
          Api.getCode(this.mobile).then(res => {})
          this.disabled = true
        }
      },
      handleSubmit() {
        if (!this.mobile) {
          this.$message({ type: 'warning', message: `请输入手机号码` })
          return false
        }
        if (!/^1[34578]\d{9}$/.test(this.mobile)) {
          this.$message({ type: 'warning', message: `手机号码格式不正确` })
          return false
        }
        if (!this.code) {
          this.$message({ type: 'warning', message: `请输入验证码` })
          return false
        }
        Api.modifyUser({
          id: this.USER.id,
          mobile: this.mobile,
          status: '1',
          validateCode: this.code
        }).then(res => {
          this.modifyLoginUser(res.user)
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .text-color.disabled {
    color: #999;
  }
</style>
