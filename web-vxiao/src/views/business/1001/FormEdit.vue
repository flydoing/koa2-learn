<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="form-edit">
      <item :hasClick="false">
        <div>表单名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <div class="category-title"></div>
      <item v-for="(item,i) in form.options"
            :key="i"
            :item="item"
            @click="handleItem(item)">
        <div v-html="item.name"></div>
        <div slot="remark"
             class="ellipsis"
             v-html="item.description"></div>
      </item>
      <item @click="handleAddItem"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
        <div>新增项目</div>
      </item>
      <div v-if="form.id"
           class="button button-common"
           @click="handleRemove">删除表单</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        form: {
          name: '',
          options: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        approve: 'getCreateObject'
      }),
      title() {
        return this.approve.cache ? '编辑表单' : '新建表单'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this

        let cache = that.approve.cache
        if (that.approve.form) {
          that.form = that.approve.form
        } else if (cache) {
          that.form = { ...cache, options: cache.approveProjects || [] }
        }

        let item = that.approve.formItem
        let opts = that.form.options
        if (Check.isRealArray(opts) && item) {
          let index = 0
          let flag = false
          opts.forEach((o, i) => {
            if (item.id === o.id) {
              index = i
              flag = true
              return false
            }
          })
          if (flag && item.status === 'd') {
            opts.splice(index, 1)
          } else if (flag) {
            opts[index] = item
          } else {
            opts.push(item)
          }
        } else if (item) {
          opts.push(item)
        }
      },
      handleItem(item) {
        this.setCreateObject({ form: this.form, formItem: item })
        this.routePush({ name: 'formItemEdit1001' })
      },
      handleAddItem() {
        if (this.form.options.length > 9) {
          this.$message({ message: '最多可添加10个项目', type: 'warning' })
          return false
        }
        this.setCreateObject({ form: this.form, formItem: null })
        this.routePush({ name: 'formItemEdit1001' })
      },
      handleRemove() {
        Api.commitForm(this.currentGroup.groupId, { id: this.form.id, status: 'd' }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '表单名称不能为空', type: 'warning' })
          return false
        }

        let postData = {
          name: form.name,
          groupId: that.groupId,
          approveProjects: form.options.map(o => {
            let op = {
              name: o.name,
              type: o.type,
              description: o.description,
              length: o.length,
              groupId: that.groupId
            }
            if (o.options) {
              op.options = o.options.map(v => {
                return { content: v.content }
              })
            }
            return op
          })
        }
        form.id && (postData.id = form.id)

        Api.commitForm(that.groupId, postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .handler-edit {
    .he-ico-plus {
      font-size: rem(40);
      color: #9e9e9e;
      margin: rem(5) 0;
    }
    .he-ico-rank {
      font-size: rem(30);
      color: #9e9e9e;
    }
    .vx-item img {
      margin: rem(5) 0;
    }
  }
</style>
