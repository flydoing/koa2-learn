<template>
  <Page :title="title"
        closePrompt
        listenBack
        @back="handleBack"
        hasSubmit
        @submit="submit">
    <div class="create-type"
         v-if="isClass">
      <div :class="{'active': isDefault}"
           @click="changeCreateType(1)">直接新建</div>
      <div :class="{'active': !isDefault}"
           @click="changeCreateType(2)">从课程中选取</div>
    </div>
    <div class="category-title"
         v-if="isClass"></div>
    <item v-if="isCourse"
          @click="handleCatalogue">
      <div>目录</div>
      <div slot="remark"
           v-if="curCatalogue">{{curCatalogue.name}}</div>
    </item>
    <template v-if="isDefault">
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
      </keep-alive>
    </template>
    <div class="course-list"
         v-else>
      <template v-for="(group, i) in allCourse">
        <item v-if="allCourse.length>0"
              :key="i"
              @click="groupClick(group)">
          <div slot="before"><img class="group-avatar"
                 v-lazy="{src:url(group.logo)}"
                 alt='群封面'></div>
          <div>{{group.name}}</div>
        </item>
      </template>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    props: { app: Object },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        content: '',
        medias: [],
        curCatalogue: null,
        isDefault: true,
        allCourse: []
      }
    },
    computed: {
      ...mapGetters({
        myGroups: 'getGroups'
      }),
      title() {
        if (this.app) {
          return `新建${this.app.name}`
        } else {
          return '新建'
        }
      }
    },
    activated() {
      this.curCatalogue = this.getStorage('resourcesCatorye', true) || null
    },
    methods: {
      submit() {
        let that = this
        if (that.isCourse && !that.curCatalogue) {
          that.$message({ type: 'warning', message: '目录不能为空' })
          return false
        }
        if (Check.isNullString(this.editorMessage.content) && !Check.isRealArray(this.editorMessage.medias)) {
          that.$message({ message: '分享内容不能为空', type: 'warning' })
          return false
        }
        that
          .addMessage(
            that.constructionMessage({
              type: that.app.type,
              groupId: that.currentGroup.groupId,
              categoryId: that.isCourse ? that.curCatalogue.id : void 0,
              categoryName: that.isCourse ? that.curCatalogue.name : void 0,
              ...this.editorMessage
            })
          )
          .then(res => {
            this.content = ''
            this.$message({ message: '操作成功', type: 'success' })
            this.getStorage('resourcesCatorye')
            this.editorMessage = {}
            this.routeBack()
          })
      },
      handleBack() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getStorage('resourcesCatorye')
          this.routeBack()
        })
      },
      handleCatalogue() {
        this.routePush({
          name: 'resourcesCatalog'
        })
      },
      changeCreateType(i) {
        if (i === 1) {
          this.isDefault = true
        } else {
          this.isDefault = false
          this.allCourse = this.myGroups.filter(v => {
            return v.type === '23'
          })
        }
      },
      groupClick(group) {
        let range = null
        switch (this.app.type) {
          case '1151':
            range = 14
            break
          case '1043':
            range = 17
            break
          case '1072':
            range = 9
            break
          case '1156':
            range = 16
            break
        }
        this.routePushModel({
          name: 'courseSelectCatalog',
          query: {
            cGroupId: group.groupId,
            range: range,
            text: group.name,
            appType: this.app.type
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .create-type {
    @include flex;

    div {
      flex: 1;
      text-align: center;
      height: rem(40);
      line-height: rem(40);
      cursor: pointer;
      background-color: #f1f1f1;

      &:hover,
      &.active {
        color: nth($background,3);
        background-color: #fff;
      }
    }
  }

  .course-list {
    .group-avatar {
      padding: rem(5) 0;
      width: rem(100);
      height: rem(60);
    }
  }
</style>
