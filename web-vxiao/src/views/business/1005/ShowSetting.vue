<template>
  <page :title="title">
    <item>
      <div slot="main">独立雷达图</div>
      <div slot="after">
        <i-switch :value="radarSwitched(singleRadarMeta)" @click="handleRadar(singleRadarMeta)"></i-switch>
      </div>
    </item>
    <item>
      <div slot="main">汇总雷达图</div>
      <div slot="after">
        <i-switch :value="radarSwitched(summaryRadarMeta)" @click="handleRadar(summaryRadarMeta)"></i-switch>
      </div>
    </item>
    <div class="category-title text">维度显示</div>
    <item v-for="(dSet,i) in demSettings" :key="i">
      <div slot="main">{{dSet.name}}</div>
      <div slot="after">
        <i-switch :value="isSwitched(dSet)" @click="handleSwitch(dSet)"></i-switch>
      </div>
    </item>
    <div class="category-title text">科目统计维度</div>
    <item v-for="(sSet,i) in subDemSettings" :key="i">
      <div slot="main">{{sSet.name}}</div>
      <div slot="after">
        <i-switch :value="isSwitched(sSet)" @click="handleSwitch(sSet)"></i-switch>
      </div>
    </item>
    <div class="category-title text">科目显示</div>
    <item v-for="(sSet,i) in subSettings" :key="i">
      <div slot="main">{{sSet.name}}</div>
      <div slot="after">
        <i-switch :value="isSwitched(sSet)" @click="handleSwitch(sSet)"></i-switch>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  import Api from './api'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        demSettings: [],
        subDemSettings: [],
        subSettings: [],
        radarMetas: []
      }
    },
    created() {
      let that = this
      Api.loadShowSettingList(this.currentGroup.groupId).then(res => {
        that.demSettings = that.filterData(res.categorys, '1')
        that.subDemSettings = that.filterData(res.categorys, '2')
        that.subSettings = res.subjects.map(s => {
          s.type = '3'
          s.metaData = s.metaDatas ? s.metaDatas[0] : null
          return s
        })
        that.radarMetas = res.metaDatas
      })
    },
    computed: {
      title() {
        return '成长年鉴显示设置'
      },
      singleRadarMeta() {
        return this.radarMeta('m_evaluation_dimension_randar')
      },
      summaryRadarMeta() {
        return this.radarMeta('m_evaluation_summary_randar')
      }
    },
    methods: {
      radarMeta(type) {
        if (Check.isRealArray(this.radarMetas)) {
          let meta = this.radarMetas.filter(v => { return v.metaType === type })[0]
          return { ...meta, userId: this.currentGroup.parentId }
        }
        return { metaType: type, userId: this.currentGroup.parentId, obj: '0' }
      },
      radarSwitched(meta) {
        return meta.obj === '1'
      },
      isSwitched(setting) {
        return setting.metaData ? setting.metaData.obj === '1' : true
      },
      handleRadar(meta) {
        meta.obj = meta.obj === '0' ? '1' : '0'
        GroupApi.updateMetaData([meta]).then(res => {
          this.radarMetas = this.radarMetas.map(v => {
            if (v.metaType === meta.metaType) {
              v = res.metaDatas[0]
            }
            return v
          })
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleSwitch(setting) {
        let meta = null
        let groupId = this.currentGroup.groupId

        if (setting.metaData) {
          meta = setting.metaData
          meta.obj = meta.obj === '0' ? '1' : '0'
        } else {
          meta = {
            key: setting.type,
            obj: '0',
            metaType: 'm_evaluation_dimension_year_book_show',
            userId: setting.id,
            extension: groupId
          }
        }
        GroupApi.updateMetaData([meta]).then(res => {
          this.refreshData(setting, res.metaDatas[0])
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      refreshData(setting, metaData) {
        if (setting.type === '1') {
          this.demSettings = this.demSettings.map(s => {
            setting.id === s.id && (s.metaData = metaData)
            return s
          })
        } else if (setting.type === '2') {
          this.subDemSettings = this.subDemSettings.map(s => {
            setting.id === s.id && (s.metaData = metaData)
            return s
          })
        } else {
          this.subSettings = this.subSettings.map(s => {
            setting.id === s.id && (s.metaData = metaData)
            return s
          })
        }
      },
      filterData(datas, type) {
        let dts = []
        if (Check.isArray(datas)) {
          dts = datas.map(function(c) {
            c.type = type

            if (Check.isArray(c.metaDatas)) {
              c.metaDatas = c.metaDatas.filter(m => {
                return m.key === type
              })
              if (c.metaDatas.length > 0) {
                c.metaData = c.metaDatas[0]
              }
            }
            delete c.metaDatas

            return c
          })
        }
        return JSON.parse(JSON.stringify(dts))
      }
    }
  }

</script>
