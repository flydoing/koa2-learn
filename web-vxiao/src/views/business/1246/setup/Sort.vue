<template>
  <Page title="应用排序" hasSubmit @submit="submit">
    <div v-for="(app, i) in apps" :key="i" draggable="true" @dragstart="dragStart(i)" @dragend="dragEnd($event)" @drop="drop($event, i)" @dragover="dragOver($event)">
      <Item>
        <div>{{app.appName}}</div>
        <div slot="after">
          <i class="ico ico-drag f20" />
        </div>
      </Item>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        apps: [],
        curIndex: -1
      }
    },
    activated() {
      this.apps = this.getStorage('_cache_apps').filter(app => {
        return !!app.id & app.status === '1'
      })
    },
    methods: {
      dragStart(index) {
        this.curIndex = index
      },
      dragEnd(e) {
        return false
      },
      dragOver(e) {
        e.preventDefault()
        return true
      },
      drop(e, index) {
        let from = this.apps[this.curIndex]
        let to = this.apps[index]
        this.$set(this.apps, this.curIndex, { ...to, sort: from.sort })
        this.$set(this.apps, index, { ...from, sort: to.sort })
        return false
      },
      submit() {
        Api.modifyScreenApp({ schoolScreenApps: this.apps }).then(res => {
          this.$message({ type: 'success', message: '排序成功' })
          this.routeBack()
        })
      }
    }
  }

</script>
