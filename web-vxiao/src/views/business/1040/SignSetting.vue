<template>
  <page title="签到设置"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <item label="会议签到">
      <div slot="after">
        <i-switch :value="isSign"
                  @click="handleSign"></i-switch>
      </div>
    </item>
    <template v-if="isSign">
      <item label="签到地址"
            :remark="addressTxt"
            @click="handleAddress">
      </item>
      <item label="有效范围（自动对比签到地址距离）"
            :hasClick="false">
        <input slot="remark"
               placeholder="不限"
               v-model="setting.range" />
        <div slot="after">米</div>
      </item>
      <item label="外部人员可签到">
        <div slot="after">
          <i-switch :value="isAllowNonuser"
                    @click="handleAllowNonuser"></i-switch>
        </div>
      </item>
      <div class="category-title text">签到项目</div>
      <draggable v-model="setting.projects"
                 :options="{draggable:'.drag'}">
        <item v-for="(item,i) in setting.projects"
              :hasClick="item.extension !== '1'"
              :class="{'drag': item.extension !== '1'}"
              :key="i"
              :label="item.name"
              @click="handleItem(item)">
          <div slot="before"
               v-if="item.extension !== '1'"><i class="ico ico-vs-sort"></i></div>
        </item>
      </draggable>
      <item label="新增"
            @click="handleAdd"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import Draggable from 'vuedraggable'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: { Draggable },
    data() {
      return {
        setting: {
          projects: [],
          sign: '0',
          address: null,
          range: '',
          allowNonuser: '0'
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        meeting: 'getMeeting'
      }),
      isSign() {
        return this.setting.sign === '1'
      },
      isAllowNonuser() {
        return this.setting.allowNonuser === '1'
      },
      addressTxt() {
        let ads = this.setting.address
        return ads ? ads.address : ''
      }
    },
    methods: {
      ...mapActions(['setMeeting', 'deleteMeetingProp']),
      fectchData() {
        let setting = this.meeting.setting
        if (setting) {
          this.setting = JSON.parse(JSON.stringify(setting))
          if (this.meeting.address) {
            this.setting.address = this.meeting.address
            this.deleteMeetingProp('address')
          }
          let item = this.meeting.item
          if (item) {
            if (item.status === 'd') {
              this.setting.projects = this.setting.projects.filter(v => {
                return v.id !== item.id
              })
            } else if (item.id) {
              this.setting.projects.forEach((v, i) => {
                if (v.id === item.id) {
                  this.$set(this.setting.projects, i, item)
                }
              })
            } else {
              this.setting.projects.push({ ...item, id: Math.random(1, 999) })
            }
            this.deleteMeetingProp('item')
          }
        } else {
          CategoryApi.getCategorys({ type: '193' }).then(res => {
            this.setting.projects = res.categorys
          })
          Api.getSchoolLocation(this.currentGroup.parentId).then(res => {
            if (res.schoolLocation) {
              let loc = JSON.parse(res.schoolLocation)
              this.setting.address = {
                point: {
                  lat: loc.latitude,
                  lng: loc.longtitude
                },
                title: loc.place,
                address: loc.place
              }
            }
          })
        }
      },
      handleAdd() {
        this.setMeeting({ setting: this.setting })
        this.routePush({ name: 'signItemEdit1040' })
      },
      handleItem(item) {
        this.setMeeting({ setting: this.setting, item: item })
        this.routePush({ name: 'signItemEdit1040' })
      },
      handleAddress() {
        this.setMeeting({ setting: this.setting, address: this.setting.address })
        this.routePush({ name: 'selectAddress1040' })
      },
      handleSign() {
        let sign = this.setting.sign
        this.setting.sign = sign === '1' ? '0' : '1'
      },
      handleAllowNonuser() {
        let value = this.setting.allowNonuser
        this.setting.allowNonuser = value === '1' ? '0' : '1'
      },
      handleSubmit() {
        if (this.setting.isSign) {
          let emptys = this.setting.projects.filter(v => {
            return Check.isNullString(v.name)
          })
          if (Check.isRealArray(emptys)) {
            this.$message({ message: '项目名称不能为空', type: 'warning' })
            return false
          }
        }
        this.setMeeting({ setting: this.setting })
        this.routeBack()
      }
    }
  }
</script>
