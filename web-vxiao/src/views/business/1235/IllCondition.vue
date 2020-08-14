<template>
  <page title="症状、诊断（病因）"
        @submit="handleSubmit"
        hasSubmit>
    <div class="category-title text">症状</div>
    <item v-for="(item,i) in symptoms"
          :key="i"
          :hasArrow="false"
          @click="handleSymptom(item, i)"
          :class="{'full-input':item.value=='9'}">
      <template v-if="item.value != '9'">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-if="item.flag == '1'"
             @click.stop>
          <el-dropdown trigger="click"
                       @command="handleTemperature">
            <div class="el-dropdown-link">
              <span v-html="tmpTxt"></span>
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="(item,i) in temperatures"
                                :key="i"
                                :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <template v-if="item.flag != '1'"
                  slot="after"></template>
      </template>
      <template v-else>
        <input placeholder="输入症状"
               v-model="item.content" />
      </template>
    </item>
    <div class="category-title text">诊断（病因）</div>
    <item v-for="(item,i) in pathogenys"
          :key="i"
          :hasArrow="false"
          @click="handlePathogeny(item, i)"
          :class="{'full-input':item.value=='20'}">
      <template v-if="item.value != '20'">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </template>
      <template v-else>
        <input :placeholder="item.name"
               v-model="item.content" />
      </template>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import AttendanceApi from '@/views/business/1237/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        symptoms: [],
        pathogenys: [],
        temperatures: ['37.5℃', '38℃', '38.5℃', '39℃', '39.5℃', '40℃', '40.5℃', '41℃', '41.5℃', '42℃'],
        tmp: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leave: 'getLeave',
        getSchool: 'getSchoolBySchoolId'
      }),
      tmpTxt() {
        return this.tmp || '选择体温'
      }
    },
    methods: {
      ...mapActions(['setLeave']),
      fetchData() {
        const that = this

        let pgy = {}
        let symMap = new Map()
        let cndn = that.leave.illCondition
        if (Check.isObject(cndn)) {
          pgy = cndn.pathogeny
          that.tmp = cndn.temperature
          cndn.symptoms.map(v => {
            symMap.set(v.id, v)
          })
        }

        let school = that.getSchool(that.currentGroup.parentId)
        AttendanceApi.getTemplateData(school.groupId).then(res => {
          if (res.category.childs) {
            that.symptoms = res.category.childs.map(v => {
              let sym = symMap.get(v.id)
              if (Check.isObject(sym)) {
                v = { ...v, selected: true, content: sym.content || '' }
              } else {
                v = { ...v, selected: false, content: '' }
              }
              return v
            })
          }
          if (res.category.datas) {
            that.pathogenys = res.category.datas.map(v => {
              if (v.id === pgy.id) {
                v = { ...v, selected: true, content: pgy.content || '' }
              } else {
                v = { ...v, selected: false, content: '' }
              }
              return v
            })
          }
        })
      },
      handleTemperature(tmp) {
        this.tmp = tmp
      },
      handleSymptom(item, index) {
        item.selected = !item.selected
        // this.$set(this.symptoms, index, item)
      },
      handlePathogeny(item, index) {
        this.pathogenys = this.pathogenys.map(v => {
          v.selected = v.id === item.id
          return v
        })
      },
      handleSubmit() {
        const that = this
        let syms = that.symptoms.filter(v => {
          return v.selected
        })
        let pgy = that.pathogenys.filter(v => {
          return v.selected || !Check.isNullString(v.content)
        })[0]

        if (!Check.isRealArray(syms)) {
          that.$message({ message: '请选择症状', type: 'warning' })
          return false
        }

        if (!pgy) {
          that.$message({ message: '请选择病因', type: 'warning' })
          return false
        }

        that.setLeave({ illCondition: { symptoms: syms, pathogeny: pgy, temperature: that.tmp } })
        that.routeBack(-2)
      }
    }
  }
</script>
