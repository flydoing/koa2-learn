<template>
  <Page title="新增自定义应用" hasSubmit @submit="submit">
    <Avatar @success="handleLogo">
      <Item>
        <div>应用封面</div>
        <div slot="remark">
          <img class="avatar big" v-lazy="{src:url(obj.appLogo,'thumb'),error:Image.ICO_AVATAR}" alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item fullInput :hasClick="false">
      <input placeholder="应用名称" v-model="r.extension" />
    </Item>
    <Item fullInput :hasClick="false">
      <input placeholder="url" v-model="obj.url" />
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        obj: {
          appLogo: '',
          url: ''
        },
        r: {
          userId: '',
          key: '',
          extension: ''
        }
      }
    },
    created() {
      this.r = {
        userId: this.routeQuery('schoolId'),
        key: this.routeQuery('id')
      }
    },
    methods: {
      handleLogo(file) {
        this.$set(this.obj, 'appLogo', file.id)
      },
      submit() {
        this.r.obj = JSON.stringify(this.obj)
        Api.addCustom({ metaData: this.r }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      }
    }
  }

</script>
