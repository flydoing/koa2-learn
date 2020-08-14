<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="form-edit">
      <item :hasClick="false"
            class="full-input">
        <input placeholder="项目名称"
               v-model="item.name" />
      </item>
      <div class="category-title"></div>
      <item v-for="(type,i) in types"
            :key="i"
            @click="handleSelect(type, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':type.active}"></i>
        </div>
        <div slot="main">{{type.name}}</div>
        <div slot="after"></div>
      </item>
      <item :hasClick="false"
            class="full-input"
            v-for="(item, i) in options"
            :key="i">
        <input :placeholder="opTxt(i)"
               v-model="item.content" />
      </item>
      <item @click="handleAddOption"
            :hasArrow="false"
            label="添加">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
      <div v-if="item.id"
           class="button button-common"
           @click="handleRemove">删除项目</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        item: {
          name: '',
          description: '',
          type: ''
        },
        types: [],
        options: [{ content: '' }, { content: '' }, { content: '' }]
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
        return this.approve.formItem ? '编辑项目' : '新建项目'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      opTxt(index) {
        return `选项${index + 1}`
      },
      fetchData() {
        const that = this

        let it = this.approve.formItem
        CategoryApi.getCategorysByType('156').then(res => {
          that.types = res.categorys.map(v => {
            if (it && it.type === v.extension) {
              v.active = true
            } else {
              v.active = false
            }
            return v
          })
        })
        if (it) {
          this.item = it
          let opts = it.options || []
          if (opts.length < 3) {
            for (let i = 0; i < 3 - it.options.length; i++) {
              opts.push({ content: '' })
            }
          }
          this.options = opts
        }
      },
      handleSelect(type, index) {
        this.types = this.types.map(v => {
          type.extension === v.extension ? (v.active = true) : (v.active = false)
          return v
        })
      },
      handleAddOption() {
        this.options.push({ content: '' })
      },
      handleRemove() {
        this.setCreateObject({ formItem: { ...this.item, status: 'd' } })
        this.routeBack()
      },
      handleSubmit() {
        const that = this

        let item = that.item
        if (Check.isNullString(item.name)) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }

        let type = that.types.filter(v => {
          return v.active
        })[0]
        if (!type) {
          that.$message({ message: '请选择项目类型', type: 'warning' })
          return false
        }
        let opts = this.options.filter(v => {
          return !Check.isNullString(v.content)
        })
        if (type.extension === '6' && !Check.isRealArray(opts)) {
          that.$message({ message: '选项内容不能为空', type: 'warning' })
          return false
        }

        let it = {
          id: item.id || Math.random(1, 9999),
          type: type.extension,
          name: item.name,
          description: type.name,
          length: type.value
        }
        if (type.extension === '6') {
          it.options = opts
        }

        that.setCreateObject({ formItem: it })
        this.routeBack()
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
