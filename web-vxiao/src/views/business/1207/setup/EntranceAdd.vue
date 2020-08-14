<template>
  <Page :title="this.locationData.name">
    <div v-for="(pattern,p) in addPattern"
         :key="p">
      <div class="category-title">
        <span>{{pattern.name}}</span>
      </div>
      <Item v-for="(patternViots,i) in pattern.viots"
            :key="i"
            @click="editList(patternViots)">
        <div slot="main">{{patternViots.name}}</div>
        <div slot="remark">
          <div>{{patternViots.serialNumber}}</div>
        </div>
      </Item>
      <Item @click="handleAddCard(pattern)">
        <div slot="before">
          <i class="ico ico-plus" />
        </div>
        <div>新增</div>
      </Item>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        addPattern: {},
        locationData: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.locationData = this.getStorage('_deviceInfo')
        Api.getAllfacility(this.locationData.id).then(res => {
          this.addPattern = res.categorys
        })
      },
      handleAddCard(pattern) {
        // 添加类别
        let sort = {
          status: '1',
          viotsList: pattern
        }
        this.setStorage('_deviceInfo', this.locationData)
        this.setStorage('_addSort', sort)
        this.routePush({ name: 'addPattern1207' })
      },
      editList(patternViots) {
        // 编辑
        let sort = {
          status: '0',
          viotsList: patternViots
        }
        this.setStorage('_deviceInfo', this.locationData)
        this.setStorage('_addSort', sort)
        this.routePush({ name: 'addPattern1207' })
      }
    }
  }
</script>
