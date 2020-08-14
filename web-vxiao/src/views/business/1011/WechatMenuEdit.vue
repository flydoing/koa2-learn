<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="wechat-menu-edit">
      <item className="vx-item-show"
            :hasClick="false">
        <div slot="main"
             class="vx-item-text">菜单名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="menu.name" />
      </item>
      <div class="category-title">二级菜单</div>
      <item v-for="(item,i) in subMenus"
            @click="handleSelect(item, i)"
            :key="i"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.active}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        menu: {
          name: ''
        },
        subMenus: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      }),
      title() {
        return this.active.menu ? '编辑微信同步菜单' : '新建微信同步菜单'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this

        let mMap = new Map()
        if (that.active.menu) {
          that.menu = that.active.menu
          that.menu.subMenus.map(v => {
            mMap.set(v.id, v)
          })
        }
        Api.getWechatSubMenus(that.currentGroup.groupId).then(res => {
          that.subMenus = res.categorys.map(v => {
            mMap.get(v.id) ? (v.active = true) : (v.active = false)
            return v
          })
        })
      },
      handleSelect(item, index) {
        item.active = !item.active
      },
      handleSubmit() {
        const that = this

        let menu = that.menu
        let subMenus = that.subMenus.filter(v => {
          return v.active
        })
        if (Check.isNullString(menu.name)) {
          that.$message({ message: '菜单名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(subMenus)) {
          that.$message({ message: '请选择二级菜单', type: 'warning' })
          return false
        }

        let postData = { name: menu.name, subMenus: subMenus }
        menu.id && (postData.menu = menu)
        Api.commitWechatMenu(that.currentGroup.groupId, postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banner-setting {
    .bs-image {
      width: rem(80);
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
      background: #ebebeb;
    }
  }
</style>
