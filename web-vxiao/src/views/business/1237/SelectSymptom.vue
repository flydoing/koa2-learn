<template>
  <page title="选择症状"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in symptoms"
          :key="i"
          @click="handleSymptom(item, i)"
          :class="{'full-input':item.status=='5'}">
      <template v-if="item.status != '5'">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-if="item.status == '2'"
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
        <template v-if="item.status != '2'"
                  slot="after"></template>
      </template>
      <template v-else>
        <input placeholder="输入症状"
               v-model="item.content" />
        <template slot="after">&nbsp;</template>
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
        temperatures: ['37.5℃', '38℃', '38.5℃', '39℃', '39.5℃', '40℃', '40.5℃', '41℃', '41.5℃', '42℃'],
        tmp: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      }),
      tmpTxt() {
        return this.tmp || '选择体温'
      }
    },
    methods: {
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this
        let cMap = new Map()
        let caches = this.attendance.symptoms
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            cMap.set(v.id, v)
          })
        }

        Api.getSymptomsAndPathogenys().then(res => {
          if (res.data && res.data.sickReasons) {
            that.symptoms = res.data.sickReasons.map(v => {
              let sym = cMap.get(v.id)
              if (sym) {
                if (sym.tmp) {
                  this.tmp = sym.tmp
                }
                return { ...sym, selected: v.status !== '5', content: sym.status !== '2' ? sym.content || '' : '' }
              }
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
      handleSubmit() {
        const that = this
        let syms = that.symptoms.filter(v => {
          return v.selected || !Check.isNullString(v.content)
        })

        if (!Check.isRealArray(syms)) {
          that.$message({ message: '请选择症状', type: 'warning' })
          return false
        }

        syms = syms.map(v => {
          if (v.status === '2') {
            v.content = `${v.name} ${that.tmp}`
            v.tmp = that.tmp
          }
          return v
        })
        that.setAttendance({ symptoms: syms })
        that.routeBack()
      }
    }
  }
</script>
