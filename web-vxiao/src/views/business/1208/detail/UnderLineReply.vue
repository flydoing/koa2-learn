<template>
  <page title="听写详情">
    <div slot="btn">
      <label @click="commitClick">提交</label>
    </div>
    <!-- <DictationEditor id="student-answer" :rows="5" placeholder="请填入听写答案或者拍照上传" :tools="['pic']" v-model="inputStr" @getMedias="fromSimpleImage"
      :noBottom="true" /> -->
    <keep-alive>
      <DictationEditor placeholder="请填入听写答案或者拍照上传"
                       :toolbars="['photo']"
                       :store.sync="replyObj" />
    </keep-alive>
  </page>
</template>
<script>
  import MsgApi from '@/api/message'
  import M from '@/views/business/mixin'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [M, CardMixin],
    data() {
      return {
        replyObj: {
          content: '',
          medias: []
        }
      }
    },
    components: {
      DictationEditor: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    methods: {
      commitClick() {
        let req = {
          content: this.replyObj.content,
          groupId: this.currentGroup.groupId,
          medias: this.replyObj.medias,
          parentId: this.routeQuery('msgId'),
          type: '120801',
          status: '1',
          ...this.commonMessage()
        }
        MsgApi.addMessage(req).then(res => {
          res.messages && this.routeBack()
        })
      }
    }
  }
</script>
