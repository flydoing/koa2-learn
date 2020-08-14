<template>
  <div class="card-reply-input" :class="{'active':show}">
    <keep-alive>
      <EditorReply v-if="show" :store.sync="form" :placeholder="placeholder" @submit="handleReply" />
    </keep-alive>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import Api from '@/api/message'
  import { mapActions } from 'vuex'
  export default {
    components: {
      EditorReply: resolve => require(['@/components/editor/EditorReply'], resolve)
    },
    props: {
      show: { type: [Boolean], default: false },
      m: {
        type: Object,
        default: () => {
          return {}
        }
      },
      u: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        form: {}
      }
    },
    computed: {
      placeholder() {
        return this.u.userName ? `回复${this.u.userName}：` : '输入内容'
      }
    },
    methods: {
      ...mapActions(['updateMessage']),
      handleReply() {
        if (!Check.isNullString(this.form.content)) {
          Api.reply({
            reply: {
              parentId: this.m.id,
              groupId: this.m.groupId,
              ...this.form,
              ...this.u,
              ...this.commonMessage(),
              medias: null
            }
          }).then(res => {
            this.$set(this.form, 'content', '')
            this.$emit('reply', { ...res.message, ...{ replys: res.replys } })
            this.$emit('update:show', false)
          }).catch(res => {})
        }
        if (Check.isRealArray(this.form.medias)) {
          this.$delete(this.form, 'content')
          Api.reply({
            reply: {
              groupId: this.m.groupId,
              parentId: this.m.id,
              ...this.form,
              ...this.u,
              ...this.commonMessage()
            }
          }).then(res => {
            this.$set(this.form, 'content', '')
            this.$emit('reply', { ...res.message, ...{ replys: res.replys } })
            this.$emit('update:show', false)
          }).catch(res => {})
        }
      }
    },
    watch: {
      show: function(v) {
        this.show = v
      }
    }
  }

</script>
