<template>
  <Page title="新建小组"
        closePrompt
        hasSubmit
        @submit="submit">
    <Avatar @success="handleLogo">
      <Item>
        <div>头像</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(team.logo,'thumb'),error:Image.ICO_GROUP}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item :hasClick="false">
      <input placeholder="请输入小组名称"
             maxlength="16"
             v-model="team.name" />
    </Item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/api/group'
  import GroupEnum from '@/constant/group'
  export default {
    mixins: [R],
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        team: {
          type: GroupEnum.TEAM,
          status: 1,
          logo: '',
          name: ''
        }
      }
    },
    created() {
      this.team.parentId = this.currentGroup.id
    },
    methods: {
      submit() {
        if (this.team.name === '') {
          this.$message({ type: 'warning', message: '小组名称不能为空' })
          return
        }
        Api.addGroup({
          groups: [this.team]
        }).then(res => {
          this.routeBack()
          this.$message({ type: 'success', message: '新建小组成功' })
        })
      },
      handleLogo(file) {
        this.$set(this.team, 'logo', file.id)
      }
    }
  }
</script>
