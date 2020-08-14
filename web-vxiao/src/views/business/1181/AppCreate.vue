<template>
  <page title="新建范文"
        closePrompt
        hasSubmit
        @submit="essaySubmit"
        @back="back"
        listenBack>
    <item v-if="isCourse"
          @click="selectCategory">
      <div>目录</div>
      <div slot="remark">{{modelEssay.category.name || ''}}</div>
    </item>
    <item :hasClick="false">
      <div>范文名称</div>
      <input type="text"
             placeholder="必填"
             v-model="modelEssay.name"
             slot="remark">
    </item>
    <item :hasClick="false">
      <div>作者</div>
      <input type="text"
             placeholder="选填"
             v-model="modelEssay.author"
             slot="remark">
    </item>
    <item :hasClick="false">
      <div>学校班级</div>
      <input type="text"
             placeholder="选填"
             v-model="modelEssay.schooClass"
             slot="remark">
    </item>
    <item @click="handleKeywork">
      <div>关键字</div>
      <div slot="remark"
           class="ellipsis">{{modelEssay.keywords | showText}}</div>
    </item>
    <TextInput placeholder="范文内容"
               v-model="modelEssay.content"></TextInput>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        modelEssay: {
          category: {},
          name: '',
          author: '',
          schoolClass: '',
          keywords: [],
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        cacheEssay: 'getEssayCreate'
      })
    },
    activated() {
      if (this.cacheEssay.isCache) {
        this.modelEssay = {
          ...this.cacheEssay
        }
      }
    },
    methods: {
      ...mapActions(['saveEssayCreate', 'clearEssayCreate']),
      handleKeywork() {
        this.saveEssayCreate({
          isCache: true,
          ...this.modelEssay
        })
        this.routePush({
          name: 'keywords1181'
        })
      },
      selectCategory() {
        this.saveEssayCreate({
          isCache: true,
          ...this.modelEssay
        })
        this.routePush({
          name: 'catalogue1181'
        })
      },
      essaySubmit() {
        if (Check.isNullString(this.modelEssay.name.trim())) {
          this.$message({
            type: 'warning',
            message: '范文名称不能为空'
          })
          return false
        }
        this.addMessage({
          categoryId: !Check.isNullObject(this.modelEssay.category) ? this.modelEssay.category.id : void 0,
          content: this.modelEssay.content,
          groupId: this.currentGroup.groupId,
          medias: [],
          title: this.modelEssay.name,
          msgJson: JSON.stringify({
            schoolClass: this.modelEssay.schoolClass,
            author: this.modelEssay.author,
            keyWords: this.modelEssay.keywords
          }),
          type: '1181',
          ...this.constructionMessage()
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.clearEssayCreate()
          this.routeBack()
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearEssayCreate()
            this.routeBack()
          })
          .catch(() => {})
      }
    },
    filters: {
      showText(arr) {
        if (Check.isRealArray(arr)) {
          return arr.join('，')
        } else {
          return '选填'
        }
      }
    }
  }
</script>
