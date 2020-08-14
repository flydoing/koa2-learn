<template>
  <page title="介绍内容"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <div class="editor-item"
         v-if="form && maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="form"
                placeholder="输入内容"
                :height="maxHeight"
                ref="_editor" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
    },
    data() {
      return {
        form: null,
        maxHeight: 0
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        if (this.obj.editor) {
          this.form = JSON.parse(JSON.stringify(this.obj.editor))
        } else {
          this.form = { content: '', medias: [] }
        }
      },
      handleSubmit() {
        this.setCreateObject({ editor: this.form })
        this.routeBack()
      }
    }
  }
</script>
