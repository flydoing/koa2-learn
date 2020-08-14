<template>
  <page :title="title"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <div class="create-postils">
      <p class="postils-text">{{routeQuery('text')}}</p>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file']"
                      placeholder="批注内容" />
      </keep-alive>
      <item @click="addLink">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
        <div>添加链接</div>
        <span slot="after"></span>
      </item>
      <div v-if="urls.length>0"
           class="postils-links">
        <CardLinks :links="urls"
                   v-if="urls.length>0"
                   :hasDelete="true"
                   @deleteLink="deleteLink" />
      </div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [CardMixin],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        title: '',
        editorMessage: {},
        urls: []
      }
    },
    computed: {
      ...mapGetters({
        cacheReading: 'getReading'
      })
    },
    created() {
      this.title = this.routeQuery('idnex') ? '批注详情' : '新建批注'
    },
    methods: {
      ...mapActions(['saveReading']),
      handleSubmit() {
        let postilsArr = JSON.parse(JSON.stringify(this.cacheReading.postils))
        postilsArr.push({
          content: this.editorMessage.content,
          groupId: this.currentGroup.groupId,
          medias: [...this.editorMessage.medias, ...this.urls],
          title: this.routeQuery('text'),
          msgType: this.cacheReading.postils.length,
          ...this.constructionMessage()
        })
        this.saveReading({
          postils: postilsArr
        })
        this.routeBack()
      },
      addLink() {
        this.$prompt('请输链接', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            let reg = /^http|https/
            let result = value.match(reg)
            if (!(result !== null && result !== undefined)) {
              this.$message({ type: 'warning', message: '链接格式不正确' })
              return false
            }
            Api.getUrlDetail(value).then(res => {
              if (Check.isNullObject(res.html)) {
                this.$message({ type: 'warning', message: '链接不正确，请重新输入' })
                return false
              }
              !Check.isNullObject(res.html) &&
                this.urls.push({
                  fileId: value,
                  fileName: res.html.title,
                  type: 'url'
                })
            })
          })
          .catch(() => {})
      },
      deleteLink(i) {
        this.urls.splice(i, 1)
        return false
      },
      delSpanTag(str, k) {
        let arr = str.split('</span>')
        let str1 = arr[k].replace(/<sp(.*)>/, '')
        arr.splice(k, 1, str1)
        if (arr[arr.length - 1] === '') {
          arr.pop()
          arr.forEach((v, i) => {
            if (i !== k) {
              arr[i] = arr[i] + '</span>'
            }
          })
        } else {
          arr.forEach((v, j) => {
            if (j !== k && j !== arr.length - 1) {
              arr[j] = arr[j] + '</span>'
            }
          })
        }
        return arr.join('')
      },
      back() {
        let text = this.delSpanTag(this.cacheReading.content, this.cacheReading.postils.length)
        this.saveReading({
          content: text
        })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .create-postils {
    .postils-text {
      padding: rem(10);
      font-size: rem(16);
    }

    .postils-links {
      padding: rem(10);
    }
  }
</style>
