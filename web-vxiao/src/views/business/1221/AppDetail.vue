<template>
  <AppPage :title="'储物管理'"
           :loading="loading">
    <template slot="btn">
      <label @click="clickBatchCreate">批量添加</label>
      <label @click="clickCreate">新增柜子</label>
    </template>
    <AppCommon :app="curApp" />
    <Scroller :height="sh">
      <div class="item-category"
           v-for="(storageBoxCategory,i) in storageBoxCategories"
           :key="i">
        <div class="category-title text">
          <span>{{storageBoxCategory.name}}</span>
        </div>
        <!-- 储物柜，有按钮 -->
        <div v-if="storageBoxCategory.value === '3'">
          <Item>
            <div>协助设置（开启协助开门，学生可以让两位同班同学协助开门）</div>
            <div slot="after">
              <i-switch :value.sync="isOpen"
                        trueValue="1"
                        falseValue="2"
                        @click="clickAssist"></i-switch>
            </div>
          </Item>
        </div>
        <!-- 储物柜，有按钮 -->
        <Item v-for="(box,i) in storageBoxCategory.storageBoxes"
              :key="i"
              @click="clickBox(box, storageBoxCategory.name, storageBoxCategory.value)">
          <div>{{box.name}}</div>
          <div slot="after"
               v-html="itemBoxHtml(box)"></div>
        </Item>
      </div>
    </Scroller>
  </AppPage>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    computed: {
      scrollHeight() {
        const h = this.innerHeight - 52 - 25 - 45 - 25
        return `${h}px`
      },
      curApp() {
        return this.currentApp || this.app
      }
    },
    data() {
      return {
        storageBoxCategories: [],
        // old
        loading: false,
        sh: '',
        boxAblecount: 0,
        boxTotalcount: 0,
        classAblecount: 0,
        classTotalcount: 0,
        boxs: [],
        classList: [],
        isOpen: 1,
        hasBoxMore: true,
        hasClassMore: true
      }
    },
    created() {},
    mounted() {
      this.$nextTick(() => {
        this.sh = this.innerHeight - 125 - 40 - 52 - 95
      })
    },
    watch: {
      boxs(t) {
        this.boxs = t
      },
      currentApp(v) {
        this.fetchData()
      },
      $route(to, from) {
        if (to.path === '/vx/') {
          this.fetchData()
        }
      }
    },
    methods: {
      fetchData() {
        this.boxs = []
        this.classList = []
        this.getStorage()
        this.getClassStorage()
        this.getAssistSet()
        // new
        this.getStorages()
      },
      getStorages() {
        const that = this
        that.loading = true
        Api.getStorages(this.schoolId).then(res => {
          this.loading = false
          if (res.code === '1') {
            this.storageBoxCategories = res.storageBoxCategories
          } else {
            this.$message.error({ message: res.msg })
          }
        })
      },
      // old
      clickAssist() {
        Api.saveAssistSet(this.schoolId, this.isOpen)
      },
      clickClass(item) {
        this.routePush({
          name: 'classDetail',
          query: {
            groupId: item.groupid || item.groupId,
            schoolId: this.schoolId,
            title: item.gname
          }
        })
      },
      clickBox(item, name, value) {
        this.routePush({
          name: 'storageDetail',
          query: {
            id: item.id,
            schoolId: this.schoolId,
            title: `${name}-${item.name}`,
            value: value,
            groupId: this.groupId
          }
        })
      },
      clickCreate() {
        this.routePush({
          name: 'storageDetail',
          query: {
            schoolId: this.schoolId
          }
        })
      },
      clickBatchCreate() {
        let that = this
        that.$import({
          title: '批量添加储物柜',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/storage_box.xlsx',
          receiptUrl: `/business/storage/box/import?schoolId=${that.schoolId}`,
          callback: (res, file) => {
            that.getStorage()
            that.getClassStorage()
          },
          receiptBack: (res, file) => {
            if (res.commonTable) {
              let lines = []
              res.commonTable.lines.map((l, i) => {
                lines.push(l.slice(0, 3))
              })
              that.setStorage('_import_receipt', {
                headers: res.commonTable.headers,
                lines: lines
              })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: `/business/storage/box/import?schoolId=${that.schoolId}`,
                  fileId: res.fileId
                }
              })
            }
          }
        })
      },
      getStorage(currentIndex = 1) {
        const that = this
        this.loading = true
        Api.loadStorages(this.schoolId, currentIndex).then(res => {
          this.loading = false
          that.hasBoxMore = !Check.isLength(res.boxs, 20)
          if (Check.isRealArray(res.boxs)) {
            that.boxs = [...that.boxs, ...res.boxs]
          }
          that.boxAblecount = res.sumData.ablecount
          that.boxTotalcount = res.sumData.totalcount
        })
      },
      getClassStorage(currentIndex = 1) {
        const that = this
        this.loading = true
        Api.loadClassStorages(this.schoolId, currentIndex).then(res => {
          this.loading = false
          that.hasClassMore = !Check.isLength(res.groupsAllotBoxs, 20)
          that.classList = [...that.classList, ...res.groupsAllotBoxs]
          that.classAblecount = res.sumData.ablecount
          that.classTotalcount = res.sumData.totalcount
        })
      },
      getAssistSet() {
        Api.loadAssistSet(this.schoolId).then(res => {
          this.isOpen = res.isOpen
        })
      },
      itemBoxHtml(item) {
        let p = item.normal === '0' ? '状态正常' : '<span class="text-color error">状态异常</span>'
        return `${item.allotCount}/${item.ableCount}、${p}`
      }
    }
  }
</script>
