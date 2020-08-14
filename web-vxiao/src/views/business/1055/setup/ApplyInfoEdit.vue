<template>
  <page :title="titleText"
        hasSubmit
        @submit="commitBaseInfo">
    <item :hasClick="false"
          class="full-input">
      <input type="text"
             placeholder="名称"
             v-model="infoName">
    </item>
    <item @click="switchClick">
      <div>是否必填</div>
      <div slot="remark">
        <i-switch :value="isSwitched"
                  @click="switchClick"></i-switch>
      </div>
      <span slot="after"></span>
    </item>
    <item @click="InfoTypeHandle">
      <div>输入格式</div>
      <div slot="remark"
           v-text="InfoType"></div>
    </item>
    <div class="list-button"
         v-if="routeQuery('isEdit')">
      <div class="button button-common"
           @click="deleteInfo">删除</div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data() {
      return {
        infoName: '',
        isSwitched: true,
        extension: {}
      }
    },
    computed: {
      ...mapGetters(['getInputType', 'getRadioDetailList', 'getCheckboxDetailList']),
      titleText() {
        return this.routeQuery('isEdit') ? this.routeQuery('title') : '添加'
      },
      InfoType() {
        if (this.extension && this.extension.type) {
          let obj = {}
          let type = this.extension.type
          if (type === 'shortText') {
            obj['name'] = '输入框'
          } else if (type === 'date') {
            obj['name'] = '日期时间'
          } else if (type === 'imageArea') {
            obj['name'] = '图片'
          } else if (type === 'select') {
            obj['name'] = '单选按钮'
          } else {
            obj['name'] = '复选框'
          }
          this.saveInputType(obj)
          return obj['name']
        } else {
          return this.getInputType ? this.getInputType.name : ''
        }
      }
    },
    created() {
      this.infoName = this.routeQuery('title') || ''
      if (this.$route.query.type === 'add') {
        this.infoName = localStorage.getItem('infoName') || ''
      }
      if (this.$route.query.extension) {
        this.extension = JSON.parse(this.$route.query.extension)
        if (this.extension.type === 'select') {
          if (this.getRadioDetailList.length === 0) {
            this.getRadioItemDetailList(this.extension.options)
          }
        } else if (this.extension.type === 'multi_select') {
          if (this.getCheckboxDetailList.length === 0) {
            this.getCheckboxItemDetailList(this.extension.options)
          }
        }
        if (this.extension.required === '1') {
          this.isSwitched = true
        } else {
          this.isSwitched = false
        }
      }
    },
    methods: {
      ...mapActions(['saveInputType', 'getRadioItemDetailList', 'getCheckboxItemDetailList', 'saveInputType']),
      switchClick() {
        this.isSwitched = !this.isSwitched
      },
      // 输入格式选择
      InfoTypeHandle() {
        localStorage.setItem('infoName', this.infoName)
        this.routePush({ name: 'inputTypeChoose1055' })
      },
      deleteInfo() {
        this.modifyBase({
          metaDatas: [
            {
              id: this.routeQuery('id'),
              status: 'd'
            }
          ]
        })
      },
      commitBaseInfo() {
        if (!this.infoName) {
          this.$message({
            type: 'warning',
            message: '名称不能为空'
          })
          return false
        }
        let options = []
        console.log(this.getRadioDetailList, 'this.getRadioDetailList')
        if (this.getInputType.name === '单选按钮') {
          options = this.getRadioDetailList
        } else if (this.getInputType.name === '复选框') {
          options = this.getCheckboxDetailList
        }
        let required = this.isSwitched ? '1' : '0'
        this.modifyBase({
          metaDatas: [
            {
              userId: this.routeQuery('userId'),
              key: this.infoName,
              extension: JSON.stringify({
                required: required,
                type: this.getInputType.value,
                options: options
              })
            }
          ]
        })
      },
      modifyBase(d) {
        Api.modifyBaseInfo(d).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
          this.saveInputType({})
          localStorage.removeItem('infoName')
        })
      }
    }
  }
</script>
