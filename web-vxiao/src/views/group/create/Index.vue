<template>
  <Scroller :height="sh"
            style="background:#FFF;">
    <Item :hasClick="false"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索应用"
             v-model="keyword" />
    </Item>
    <div class="app-box">
      <template v-for="(c,i) in searchApps">
        <div class="app-group"
             :class="getCategoryStyle(i)"
             :key="i"
             v-if="c.apps.length > 0">
          <div class="app-title">
            <span class="name">{{c.name}}</span>
          </div>
          <div class="app-list">
            <div class="app-block"
                 v-for="(app,j) in c.apps"
                 :key="j"
                 @click="onApp(app)">
              <img class="avatar"
                   v-if="i <= 5 && app.cardShowLogo"
                   :src="url(app.cardShowLogo) || Image.ICO_AVATAR" />
              <img class="avatar"
                   v-else-if="i <= 5 && !app.cardShowLogo"
                   :src="Image.ICO_AVATAR" />
              <img class="avatar"
                   v-if="i > 5"
                   v-lazy="{src:url(app.cardShowLogo),error:Image.ICO_AVATAR}" />
              <div class="app-name">{{app.name}}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Scroller>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        keyword: ''
      }
    },
    computed: {
      ...mapGetters(['getCreateApps']),
      categorys() {
        return this.getCreateApps(this.groupId)
      },
      searchApps() {
        let search = this.keyword.toLowerCase()
        let arr = this.categorys
        if (!arr) {
          return []
        }
        if (search) {
          arr = []
          this.categorys.forEach(c => {
            let apps = c.apps.filter(app => {
              return (
                String(app.name)
                  .toLowerCase()
                  .indexOf(search) > -1 ||
                String(app.type)
                  .toLowerCase()
                  .indexOf(search) > -1
              )
            })
            if (Check.isRealArray(apps)) {
              arr.push({ ...c, ...{ apps: apps } })
            }
          })
        }
        return arr
      },
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    },
    methods: {
      ...mapActions(['loadGroupApps', 'setCreateObject']),
      ...mapMutations(['setHandleBack']),
      loadApps() {
        if (Check.isNullArray(this.categorys)) {
          this.loadGroupApps(this.groupId)
        }
      },
      getCategoryStyle(index) {
        return `category-c${index}`
      },
      onApp(app) {
        // 导播台特殊入口
        if (app.type === '1280') {
          this.routePushModel({
            path: '/vx/group/business/1280/recording',
            query: {
              appType: app.type,
              groupId: this.currentGroup.groupId
            }
          })
          return
        }
        // 纸笔互动：pc端才有
        if (app.type === '1278') {
          this.$message({ type: 'warning', message: '纸笔互动请使用PC客户端进行操作' })
          return
        }
        this.$emit('close')
        this.setCreateObject({})
        this.setHandleBack('twice') // 区分：点击后退回上一页、新建成功后回到首页(回退两次)
        this.routePushModel({
          path: '/vx/group/business/create/default',
          query: {
            appType: app.type,
            groupId: this.currentGroup.groupId
          }
        })
      }
    },
    mounted() {
      this.loadApps()
    },
    watch: {}
  }
</script>
