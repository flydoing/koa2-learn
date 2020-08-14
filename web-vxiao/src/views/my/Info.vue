<template>
  <Page class="pd"
        title="我的">
    <Avatar @success="handleLogo">
      <item label="头像">
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(USER.avatar, 'thumb'),error:Image.ICO_USER} "
               alt='LOGO' />
        </div>
      </item>
    </Avatar>
    <Item label="姓名"
          :remark="self.name"
          @click="handleName">
    </item>
    <Item label="手机号码"
          :remark="self.mobile"
          @click="handleMobile">
    </item>
    <Item label="修改密码"
          @click="handlePassword">
    </item>
    <!-- <Item label="多语言"
          @click="handleLanguage">
    </item> -->
    <div class="category-title"></div>
    <Item label="按组织架构折叠"
          @click="onOrg">
      <div slot="after">
        <i-switch :value.sync="orgMetaData.obj"
                  trueValue="1"
                  falseValue="0" />
      </div>
    </item>
    <Item label="群组排序"
          @click="handleSort">
    </item>
  </Page>
</template>
<script>
  import Api from '@/api/user'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        orgMetaData: {}
      }
    },
    computed: {
      ...mapGetters(['getMetaDataByType']),
      ...mapGetters({
        self: 'getUserDetail'
      })
    },
    created() {
      let _t = this.getMetaDataByType('m_user_org_show')
      this.orgMetaData = {
        ...{
          userId: this.USER.id,
          status: 1,
          metaType: 'm_user_org_show',
          obj: '0'
        },
        ..._t
      }
    },
    methods: {
      ...mapActions(['modifyLoginUser', 'modifyMetaData']),
      handleLogo(file) {
        Api.modifyUser({
          id: this.USER.id,
          avatar: file.id,
          status: '1'
        }).then(res => {
          this.modifyLoginUser(res.user)
          this.$message({ type: 'success', message: '修改成功' })
        })
      },
      handlePassword() {
        this.routePush({ path: '/vx/user/password' })
      },
      handleLanguage() {
        this.$message({ type: 'warning', message: '开发中......' })
      },
      handleSort() {
        this.routePush({ path: '/vx/user/sort/list' })
      },
      handleMobile() {
        this.routePush({ path: '/vx/user/mobile' })
      },
      handleName() {
        this.routePush({ path: '/vx/user/changeName', query: { name: this.self.name } })
      },
      onOrg() {
        this.$set(this.orgMetaData, 'obj', this.orgMetaData.obj === '0' ? '1' : '0')
        this.modifyMetaData(this.orgMetaData)
      }
    },
    watch: {
      'orgMetaData.obj'() {
        this.modifyMetaData(this.orgMetaData)
      }
    }
  }
</script>
