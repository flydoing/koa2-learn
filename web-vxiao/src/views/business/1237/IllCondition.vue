<template>
  <page title="症状、诊断（病因）"
        @submit="handleSubmit"
        hasSubmit>
    <div class="category-title text">症状</div>
    <item v-for="(item,i) in symptoms"
          :key="i"
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
        <template slot="after">&nbsp;</template>
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
  import Api from './api'
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
        attendance: 'getAttendance',
        getSchool: 'getSchoolBySchoolId'
      }),
      tmpTxt() {
        return this.tmp || '选择体温'
      }
    },
    methods: {
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this

        let school = that.getSchool(that.currentGroup.parentId)
        Api.getTemplateData(school.groupId).then(res => {
          if (res.category.childs) {
            that.symptoms = res.category.childs.map(v => {
              return { ...v, selected: false, content: '' }
            })
          }
          if (res.category.datas) {
            that.pathogenys = res.category.datas.map(v => {
              return { ...v, selected: false, content: '' }
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
          return v.selected || !Check.isNullString(v.content)
        })
        let pgy = that.pathogenys.filter(v => {
          return v.selected || !Check.isNullString(v.content)
        })[0]
        let oSym = that.symptoms.filter(v => {
          return !Check.isNullString(v.content)
        })[0]

        if (!Check.isRealArray(syms)) {
          that.$message({ message: '请选择症状', type: 'warning' })
          return false
        }

        if (!pgy) {
          that.$message({ message: '请选择病因', type: 'warning' })
          return false
        }

        let state = { ...this.attendance.state }
        let txt = state.type !== '2' ? '带病出勤：' : '病假：'

        let symTxts = []
        syms.forEach((v, i) => {
          if (v.flag === '1') {
            symTxts.push(`${v.name} ${that.tmp}`)
          } else {
            symTxts.push(v.content || v.name)
          }
        })

        if (!Check.isNullString(pgy.content)) {
          state.data = `${txt}${symTxts.join('、')}（${pgy.content}）`
        } else {
          state.data = `${txt}${symTxts.join('、')}（${pgy.name}）`
        }

        state.remark = oSym ? oSym.content : ''
        state.categoryIds = syms
          .map(v => {
            return v.id
          })
          .join(',')
        state.diagnosisCauseId = pgy.id
        state.sickData = symTxts.join('、')
        state.diagnosis = pgy.content || pgy.name
        state.temperature = that.tmp.replace('℃', '')
        state.diagnosisCauseText = pgy.content || pgy.name

        that.setAttendance({ state: state })
        that.routeBack(-2)
      }
    }
  }
</script>
