<template>
  <Page title="绑定设备" @submit="submit" hasSubmit>
    <Item class="full-input" :hasClick="false">
      <input placeholder="输入设备名称" v-model="bookVScreen.name" />
    </Item>
    <Item class="full-input" :hasClick="false">
      <input placeholder="输入序列号" v-model="bookVScreen.vscreenId" />
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        bookVScreen: {
          status: 1,
          name: '',
          vscreenId: ''
        }
      }
    },
    created() {
      this.bookVScreen.schoolId = this.routeQuery('schoolId')
    },
    methods: {
      submit() {
        Api.band({
          bookVScreen: this.bookVScreen
        }).then(res => {
          this.routeBack()
        })
      }
    }
  }

</script>
