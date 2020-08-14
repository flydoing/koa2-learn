<template>
  <page title="新建诵读"
        closePrompt
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <item>
      <div v-if="isCourse">批量目录、类型、背诵、背景音乐</div>
      <div v-else>批量类型、背诵、背景音乐</div>
      <div slot="remark">
        <i-switch :value="isBatch"
                  @click="handleBatch"></i-switch>
      </div>
      <span slot="after"></span>
    </item>
    <div class="category-title text">
      <span class='right href-text'
            @click="handleImport">批量导入</span>
    </div>
    <item v-if="isBatch && types.length>0"
          :hasClick="false">
      <SettingBar v-if="form.batchSet"
                  :set.sync="form.batchSet"
                  :types="types"
                  :switches="switches"
                  @category="handleCategory"
                  @type="handleType"
                  @audio="handleAudio"
                  @switch="handleSwitch"></SettingBar>
    </item>
    <template v-for="(item,i) in form.items">
      <div class="each-section"
           :key="i">
        <item :hasClick="false">
          <div slot="main">名称</div>
          <input slot="remark"
                 type="text"
                 placeholder="必填"
                 v-model="item.title">
        </item>
        <item :hasClick="false">
          <div slot="main">作者</div>
          <input slot="remark"
                 type="text"
                 placeholder="选填"
                 v-model="item.author">
        </item>
        <item v-if="!isBatch && types.length>0"
              :hasClick="false">
          <SettingBar :set.sync="item"
                      :types="types"
                      :switches="switches"
                      :index="i"
                      @category="handleCategory"
                      @type="handleType"
                      @audio="handleAudio"
                      @switch="handleSwitch"></SettingBar>
          <span slot="after"></span>
        </item>
        <TextInput placeholder="诵读内容"
                   v-model="item.content"></TextInput>
      </div>
    </template>
  </page>
</template>
<script>
  import Api from './api'
  import { mapActions, mapGetters } from 'vuex'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      SettingBar: resolve => require(['./ChantSettingBar'], resolve)
    },
    data() {
      return {
        form: {
          batch: '1',
          items: [],
          batchSet: null
        },
        types: [],
        switches: [
          {
            name: '关',
            value: '0'
          },
          {
            name: '开',
            value: '1'
          }
        ],
        categorys: []
      }
    },
    computed: {
      ...mapGetters({
        chant: 'getChant'
      }),
      isBatch() {
        return this.form.batch === '1'
      }
    },
    activated() {
      if (this.chant.form) {
        this.form = JSON.parse(JSON.stringify(this.chant.form))
        let index = this.chant.itemIndex
        if (index !== undefined) {
          if (this.chant.category) {
            this.$set(this.form.items[index], 'category', this.chant.category)
            this.deleteChantProp('category')
          }

          if (this.chant.audio) {
            this.$set(this.form.items[index], 'audio', this.chant.audio)
            this.deleteChantProp('audio')
          }
          this.deleteChantProp('itemIndex')
        } else {
          if (this.chant.category) {
            this.$set(this.form.batchSet, 'category', this.chant.category)
            this.deleteChantProp('category')
          }

          if (this.chant.audio) {
            this.$set(this.form.batchSet, 'audio', this.chant.audio)
            this.deleteChantProp('audio')
          }
        }
      } else {
        this.form.batchSet = {
          switch: this.switches[0],
          category: null,
          audio: null,
          type: null
        }
        this.form.items.push({
          switch: this.switches[0],
          category: null,
          audio: null,
          type: null,
          title: '',
          author: '',
          content: ''
        })
      }
      // 诵读类型
      Api.getChantType(this.groupId, 170).then(res => {
        this.types = res.categorys
      })
      // 目录
      if (this.isCourse) {
        Api.getCetagory(this.groupId, 1, 1).then(res => {
          this.categorys = res.categorys
        })
      }
    },
    methods: {
      ...mapActions(['setChant', 'deleteChantProp']),
      handleCategory(item, index) {
        if (index !== undefined) {
          this.setChant({ form: this.form, itemIndex: index })
        } else {
          this.setChant({ form: this.form })
        }
        this.routePush({ name: 'catalogues1186' })
      },
      handleType(item, data, index) {
        if (index !== undefined) {
          this.$set(this.form.items[index], 'type', data)
        } else {
          this.$set(this.form.batchSet, 'type', data)
        }
      },
      handleAudio(item, index) {
        if (index !== undefined) {
          this.setChant({ form: this.form, itemIndex: index })
        } else {
          this.setChant({ form: this.form })
        }
        this.routePush({ name: 'accompany1186' })
      },
      handleSwitch(item, data, index) {
        if (index !== undefined) {
          this.$set(this.form.items[index], 'switch', data)
        } else {
          this.$set(this.form.batchSet, 'switch', data)
        }
      },
      handleImport() {
        let that = this
        that.$import({
          title: '诵读批量导入',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/chantLotImport.docx',
          callback: (res, file) => {
            if (res && res.code === '1') {
              Api.parseWork(that.routeQuery('groupId'), res.file.id).then(result => {
                if (result.recites) {
                  result.recites.forEach((v, i) => {
                    this.form.items.push({
                      switch: this.switches[0],
                      category: null,
                      audio: null,
                      type: null,
                      title: '',
                      author: '',
                      content: '',
                      ...v
                    })
                  })
                }
              })
            }
          }
        })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        let flag = true
        let datas = []
        form.items.forEach((v, i) => {
          if (flag) {
            let set = that.isBatch ? form.batchSet : v

            if (Check.isNullString(v.title)) {
              that.$message({ type: 'warning', message: '名称不能为空' })
              flag = false
            }

            if (Check.isNullString(v.content)) {
              that.$message({ type: 'warning', message: '内容不能为空' })
              flag = false
            }

            if (that.isCourse && !set.category) {
              that.$message({ type: 'warning', message: '目录不能为空' })
              flag = false
            }

            if (!set.type) {
              that.$message({ type: 'warning', message: '类型不能为空' })
              flag = false
            }

            if (!set.audio) {
              that.$message({ type: 'warning', message: '伴奏不能为空' })
              flag = false
            }

            datas.push({
              catalogues: set.category
                ? [
                    {
                      id: set.category.id,
                      name: set.category.name
                    }
                  ]
                : [],
              media: set.audio,
              reciteTypes: [
                {
                  id: set.type.id,
                  name: set.type.name,
                  value: set.type.value
                }
              ],
              isHideContent: set.switch.value,
              title: v.title,
              author: v.author,
              content: v.content
            })
          }
        })

        if (!flag) {
          return false
        }

        let postData = {
          type: '1186',
          msgJson: JSON.stringify({
            childs: datas
          }),
          groupId: this.groupId,
          ...this.constructionMessage()
        }

        this.addMessage(postData).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.deleteChantProp('form')
          this.routeBack()
        })
      },
      handleBatch() {
        let batch = this.form.batch
        this.form.batch = batch === '1' ? '0' : '1'
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteChantProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .lot-set-bar {
    @include flex;
  }
  .ql-toolbar {
    &.ql-snow {
      border: #ededed solid 1px !important;
      border-top: none !important;
    }
  }

  .ql-container {
    &.ql-snow {
      border: #ededed solid 1px !important;
      border-top: none !important;
    }
  }

  .ql-editor {
    min-height: rem(100);
  }
</style>
