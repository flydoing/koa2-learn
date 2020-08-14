<template>
  <Page title="新建交接班"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showPost">
      <Scroller :height="300">
        <div v-for="(item, i) in posts"
             :key="i">
          <div class="category-title text"
               v-html="item.name"></div>
          <Item v-for="(cate, j) in item.categorys"
                :key="j"
                @click="handlePost(cate)"
                :label="cate.name">
          </Item>
        </div>
      </Scroller>
      <item slot="reference"
            label="岗位"
            @click="handlePost"
            :remark="postTxt"></item>
    </el-popover>
    <item label="交班人"
          @click="handleOffGoing"
          :remark="offGoingTxt"></item>
    <div class="category-title"></div>
    <item label="接班人"
          @click="handleOnComing"
          :remark="onComingTxt"></item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleSituation">
      <div class="el-dropdown-link">
        <item label="交接情况"
              :remark="situationTxt"></item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item, i) in situations"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="日志内容"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          post: null,
          offGoings: [],
          onComings: [],
          situation: null
        },
        situations: [],
        posts: [],
        showPost: false
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      postTxt() {
        let post = this.form.post || {}
        return post.name || '必填'
      },
      offGoingTxt() {
        let offGoings = this.form.offGoings
        if (offGoings.length > 0) {
          let names = offGoings.map(v => {
            return v.name
          })
          return names.join('、')
        }
        return '选填'
      },
      onComingTxt() {
        let onComings = this.form.onComings
        if (onComings.length > 0) {
          let names = onComings.map(v => {
            return v.name
          })
          return names.join('、')
        }
        return '选填'
      },
      situationTxt() {
        let situation = this.form.situation || {}
        return situation.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.form) {
          this.form = JSON.parse(JSON.stringify(this.obj.form))
          let offGoings = this.getStorage('_business_1148_offGoing_cache')
          this.form.offGoings = offGoings || this.form.offGoings
          let onComings = this.getStorage('_business_1148_onComing_cache')
          this.form.onComings = onComings || this.form.onComings
          this.modifyCreateObjectField('form')
        }
        Api.loadPostList(this.groupId, this.userId).then(res => {
          this.posts = res.campus || []
        })
        CategoryApi.getCategorysByType('115').then(res => {
          this.situations = res.categorys || []
        })
      },
      handleOffGoing() {
        const that = this
        let post = this.form.post
        if (post) {
          let params = {
            appType: '1148',
            property: 'offGoing',
            multiple: true,
            users: this.form.offGoings,
            loadData: cback => {
              Api.getOffGoings(that.groupId, post.id).then(res => {
                cback(res.relations)
              })
            }
          }
          this.setCreateObject({ form: this.form, params: params })
          this.routePush({
            path: '/vx/group/member/select',
            query: {
              title: '交班人'
            }
          })
        } else {
          this.$message({ message: '请选择岗位', type: 'warning' })
        }
      },
      handleOnComing() {
        let params = {
          appType: '1148',
          property: 'onComing',
          multiple: true,
          users: this.form.onComings
        }
        this.setCreateObject({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/member/select',
          query: {
            title: '接班人'
          }
        })
      },
      handleSituation(item) {
        this.form.situation = item
      },
      handlePost(item) {
        this.form.post = item
        this.showPost = false
        Api.getDiary(item.id).then(res => {
          if (res.handOver) {
            this.$set(this.editorMessage, 'content', res.handOver.diary)
          }
        })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.post) {
          that.$message({ message: '岗位不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.offGoings) && !Check.isRealArray(form.onComings)) {
          that.$message({ message: '请选择交班人或接班人', type: 'warning' })
          return false
        }
        if (!form.situation) {
          that.$message({ message: '交接情况不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(editor.content)) {
          that.$message({ message: '交接班日志内容不能为空', type: 'warning' })
          return false
        }

        let users = []
        form.offGoings.forEach(v => {
          users.push({
            type: '0',
            userId: v.userId,
            userName: v.name
          })
        })
        form.onComings.forEach(v => {
          users.push({
            type: '1',
            userId: v.userId,
            userName: v.name
          })
        })
        let postData = that.constructionMessage({
          type: '1148',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            postCategoryId: form.post.id,
            postCategoryName: form.post.name,
            diary: editor.content,
            categoryId: form.situation.id,
            categoryName: form.situation.name
          }),
          medias: editor.medias || [],
          extension: JSON.stringify(users)
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
