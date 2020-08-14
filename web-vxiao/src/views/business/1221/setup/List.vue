<template>
  <Page title="储物管理">
    <label slot="btn"
           @click="clickBatchCreate">批量添加</label>
    <label slot="btn"
           @click="clickCreate">新增储物柜</label>
    <Tabs theme="theme-1">
      <TabPane label="按柜子管理">
        <div class="category-title text">协助设置</div>
        <Item @click="clickAssist">
          <div>开启协助开门，学生可以让两位同班同学协助开门。</div>
          <div slot="after">
            <i-switch :value.sync="isOpen"
                      trueValue="1"
                      falseValue="2"></i-switch>
          </div>
        </Item>
        <div class="category-title text">
          <span>合计待分配 {{boxAblecount}}/{{boxTotalcount}} 格</span>
        </div>
        <Scroller :height="sh">
          <Item v-for="(b,i) in boxs"
                :key="i"
                @click="clickBox(b)">
            <div>{{b.name}}</div>
            <div slot="after"
                 v-html="itemBoxHtml(b)"></div>
          </Item>
        </Scroller>
      </TabPane>
      <TabPane label="按班级管理">
        <div class="category-title text">协助设置</div>
        <Item @click="clickAssist">
          <div>开启协助开门，学生可以让两位同班同学协助开门。</div>
          <div slot="after">
            <i-switch :value.sync="isOpen"
                      trueValue="1"
                      falseValue="2"></i-switch>
          </div>
        </Item>
        <div class="category-title text">
          <span>合计待分配 {{classAblecount}}/{{classTotalcount}} 格</span>
        </div>
        <Scroller :height="sh">
          <Item v-for="(c,i) in classList"
                :key="i"
                @click="clickClass(c)">
            <div>{{c.gname}}</div>
            <div slot="after">待分配{{c.allotnum}}/{{c.totalnum}}</div>
          </Item>
        </Scroller>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  export default {
    created() {
      // 设置请求头
      if (this.routeQuery('tokenId')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      this.schoolId = this.routeQuery('schoolId')
    },
    components: {
      Tabs,
      TabPane
    },
    computed: {
      scrollHeight() {
        const h = this.innerHeight - 52 - 25 - 45 - 25
        return `${h}px`
      }
    },
    data() {
      return {
        sh: '',
        schoolId: '',
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
    methods: {
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
      clickBox(item) {
        this.routePush({
          name: 'storageDetail',
          query: {
            id: item.id,
            schoolId: this.schoolId,
            title: item.name
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
      clickAllot() {},
      getStorage(currentIndex = 1) {
        const that = this
        Api.loadStorages(this.schoolId, currentIndex).then(res => {
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
        Api.loadClassStorages(this.schoolId, currentIndex).then(res => {
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
    },
    mounted() {
      this.$nextTick(() => {
        this.sh = this.innerHeight - 125 - 40 - 52 - 95
      })
    },
    activated() {
      this.boxs = []
      this.classList = []
      this.getStorage()
      this.getClassStorage()
      this.getAssistSet()
    },
    watch: {
      boxs(t) {
        this.boxs = t
      }
    }
  }
</script>
