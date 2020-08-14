<template>
  <page title="模式详情"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <div v-if="storageModels.status === '1'">
      <item>
        <div slot="main">模式名称</div>
        <div slot="after"
             class="attendClass">
          <input type="text"
                 placeholder="添加模式"
                 v-model="storageModels.styleName">
        </div>
      </item>
      <div class="category-title">设备开关</div>
      <item v-for="(item,i) in patterns"
            :key="i">
        <div slot="main">{{item.name}}</div>
        <div slot="after">
          <i-switch :value="item.isopen === '1'"
                    @click="handlePattern(item)"></i-switch>
        </div>
      </item>
    </div>
    <div v-else>
      <item>
        <div slot="main">新增模式</div>
        <item slot="after">
          <input type="text"
                 placeholder="新增模式"
                 v-model="addModel">
        </item>
      </item>
      <div class="category-title">设备开关</div>
      <item v-for="(item,i) in viotStyleRelations"
            :key="i">
        <div slot="main">{{item.name}}</div>
        <div slot="after">
          <i-switch :value="0"
                    @click="handlePattern(item)"></i-switch>
        </div>
      </item>
    </div>

    <!-- <div class="footerTemp">
      <item>
        <div slot="main">空调</div>
        <div slot="after">
          <i-switch></i-switch>
        </div>
      </item>
      <item>
        <div slot="main">模式</div>
        <div slot="after">制冷</div>
      </item>
      <item>
        <div slot="main">温度</div>
        <div slot="after">
          <div class="temperature">
            <span @click="temperatureAdd">+</span>
            <div>{{ name }}</div>
            <span @click="temperatureLessen">-</span>
          </div>
        </div>
      </item>
    </div> -->
    <div class="list-button">
      <el-button @click="deleteGrage"
                 v-if="this.delete"
                 type="danger"
                 icon="el-icon-delete"
                 size="medium">解绑</el-button>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  export default {
    mixins: [R],
    data() {
      return {
        name: 27,
        delete: false,
        storageModels: {},
        patterns: [],
        viotStyleRelations: [],
        setModel: {},
        addModel: ''
      }
    },
    created() {
      this.feccheData()
    },
    components: {},
    methods: {
      feccheData() {
        this.setModel = this.getStorage('_addModel')
        console.log(this.setModel)
        if (this.setModel.status === '0') {
          // 这是新增不需要传什么数据
          Api.getAddModel().then(res => {
            this.viotStyleRelations = res.viotStyleRelations
          })
          this.delete = false
        } else {
          Api.modelDetails(this.setModel.viotStyle.id).then(res => {
            this.storageModels = res.viotStyle
            this.patterns = res.viotStyle.relations
            // this.status = res.status
          })
          this.delete = true
        }
      },
      // 删除
      deleteGrage() {
        let deleteModel = {
          viotStyle: {
            id: this.storageModels.id,
            status: 'd'
          }
        }
        Api.addViots(deleteModel).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.routeBack()
        })
      },
      temperatureAdd() {
        // 温度增加
        this.name++
      },
      temperatureLessen() {
        // 温度降低
        this.name--
      },
      handlePattern(item) {
        item.isopen = item.isopen === '1' ? '0' : '1'
        this.patterns = this.patterns.map(res => {
          return res
        })
      },
      handleSubmit() {
        // 1是修改加id
        let status = this.setModel.status
        console.log(status)
        let styleName = this.storageModels.styleName
        if (status === '1') {
          if (!Check.isNull(styleName)) {
            let alterModel = {
              viotStyle: {
                styleName: styleName,
                schoolId: this.currentGroup.parentId,
                id: this.setModel.viotStyle.id,
                relations: this.patterns
              }
            }
            Api.addViots(alterModel).then(res => {})
            this.$router.go(-3)
          } else {
            this.$message({ message: '内容不能为空', type: 'warning' })
          }
        } else {
          if (!Check.isNull(this.addModel)) {
            let alterModel = {
              viotStyle: {
                styleName: this.addModel,
                schoolId: this.currentGroup.parentId,
                relations: this.viotStyleRelations
              }
            }
            Api.addViots(alterModel).then(res => {})
            this.$router.go(-3)
          } else {
            this.$message({ message: '内容不能为空', type: 'warning' })
          }
        }
      },
      back() {
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .attendClass {
    color: #9f9f9f;
  }
  .footerTemp div:nth-child(1).vx-item:after {
    height: 0px;
  }
  .footerTemp div:nth-child(2).vx-item:after {
    height: 0px;
  }
  .temperature {
    position: relative;
    width: 80px;
    height: 28px;
    color: #000;
  }
  .temperature span {
    position: absolute;
    top: 7px;
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 10px;
    font-size: 20px;
  }
  .temperature span:nth-child(1) {
    left: 7px;
  }
  .temperature span:nth-child(3) {
    right: 7px;
  }
  .temperature div {
    height: 28px;
    line-height: 28px;
    background: #ccc;
    text-align: center;
    border-radius: 30px;
  }
</style>
