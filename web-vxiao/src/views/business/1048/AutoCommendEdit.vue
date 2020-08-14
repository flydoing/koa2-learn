<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="autoCommend-edit">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="cmdn.name" />
      </item>
      <item @click="handleRule">
        <div slot="main">颁发规则</div>
        <div slot="remark"
             v-html="ruleTxt"></div>
      </item>
      <div class="cmd-desc">
        <TextInput placeholder="颁奖词"
                   v-model="cmdn.description"></TextInput>
      </div>
      <item @click="handleTemplate">
        <div slot="main">模板</div>
        <img slot="remark"
             class="cmd-temp"
             v-lazy="{src:logo}"
             alt='LOGO' />
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    created() {
      this.fetchData()
    },
    data() {
      return {
        cmdn: {
          name: '',
          description: '',
          rule: null,
          template: null
        }
      }
    },
    components: {},
    computed: {
      ...mapGetters({
        commend: 'getCommend'
      }),
      title() {
        return this.commend.cmdn ? '编辑自动表彰' : '新建自动表彰'
      },
      logo() {
        return this.cmdn.template ? this.url(this.cmdn.template.logo) : ''
      },
      ruleTxt() {
        let cd = this.cmdn.rule ? this.cmdn.rule.condition : {}
        let txt = ''
        switch (cd.extension) {
          case 'week':
            txt = `一周${cd.value}分`
            break
          case 'month':
            txt = `一月${cd.value}分`
            break
          case 'season':
            txt = `一学期${cd.value}分`
            break
          default:
            break
        }
        return txt
      }
    },
    methods: {
      ...mapActions(['setCommend']),
      fetchData() {
        const that = this
        let cache = that.commend.cache
        if (that.commend.cmdn) {
          that.cmdn = that.commend.cmdn
        } else if (cache) {
          that.cmdn = {
            id: cache.id,
            name: cache.name,
            description: cache.description,
            template: { id: cache.model, logo: cache.logo },
            rule: {
              condition: { value: cache.score, extension: cache.autoType },
              medals: cache.metaDatas.map(m => {
                return { id: parseInt(m.key), name: m.obj }
              })
            }
          }
        }
      },
      handleRule() {
        this.setCommend({ cmdn: this.cmdn })
        this.routePush({ name: 'selectRule1048' })
      },
      handleTemplate() {
        this.setCommend({ cmdn: this.cmdn })
        this.routePush({ name: 'selectTemplate1048', query: { isAuto: 1 } })
      },
      handleSubmit() {
        const that = this

        let cmdn = that.cmdn
        if (Check.isNullString(cmdn.name)) {
          that.$message({ message: '表彰名称不能为空', type: 'warning' })
          return false
        }
        if (!cmdn.rule || !Check.isRealArray(cmdn.rule.medals)) {
          that.$message({ message: '请选择颁发规则', type: 'warning' })
          return false
        }
        if (Check.isNullString(cmdn.description)) {
          that.$message({ message: '颁奖词不能为空', type: 'warning' })
          return false
        }
        if (!cmdn.template) {
          that.$message({ message: '请选择表彰模板', type: 'warning' })
          return false
        }

        let postData = {
          groupId: that.currentGroup.groupId,
          name: cmdn.name,
          model: cmdn.template.id,
          autoType: cmdn.rule.condition.extension,
          score: cmdn.rule.condition.value,
          description: cmdn.description,
          metaDatas: cmdn.rule.medals.map(m => {
            return {
              key: m.id,
              obj: m.name
            }
          })
        }
        cmdn.id && (postData.id = cmdn.id)

        Api.commitAutoCommend(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .autoCommend-edit {
    .cmd-desc {
      border-bottom: rem(1) solid #ebebeb;
      textarea {
        height: rem(100);
      }
    }
    .cmd-temp {
      width: rem(80);
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
    }
  }
</style>
