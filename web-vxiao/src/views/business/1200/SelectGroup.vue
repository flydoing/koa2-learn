<template>
  <page title="转发到"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item, i) in groups"
          :key="i"
          :hasArrow="false"
          @click="handleGroup(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MixinMessage from '@/views/group/mixinMessage'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        groups: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      })
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      fetchData() {
        const that = this
        Api.getCourseGroup('1047').then(res => {
          if (res.groups) {
            that.groups = res.groups.map(v => {
              v.selected = false
              return v
            })
          }
        })
      },
      handleGroup(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        const that = this

        let gs = that.groups.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(gs)) {
          that.$message({ message: '请选择转发群组', type: 'warning' })
          return false
        }
        let m = {
          groupId: this.groupId,
          extensionType: JSON.stringify({
            questions: this.cacheClassRoom.previewQuetions
          }),
          groupIds: gs.map(v => {
            return v.groupId
          }),
          msgType: 'multiplecreate',
          type: '1047',
          ...this.constructionMessage()
        }

        that.addMessage(m).then(res => {
          that.$message({
            type: 'success',
            message: '操作成功'
          })
          this.saveClassRoomCreate({
            previewQuetions: []
          })
          that.routeBack(-3)
        })
      }
    }
  }
</script>
