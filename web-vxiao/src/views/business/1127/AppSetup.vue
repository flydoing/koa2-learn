<template>
  <Setup appType="'1127'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1127'))" slot="others">
      <el-dropdown class="block-element" trigger="click" @command="handleWay">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">评分方式</div>
            <div slot="remark" v-html="wayTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu" slot="dropdown">
          <el-dropdown-item class="menu-item" v-for="(way,i) in ways" :key="i" :command="way">{{way.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item>
        <div slot="main">家长可评价结果</div>
        <div slot="after">
          <i-switch :value="isSwitched" @click="handleSwitch"></i-switch>
        </div>
      </item>
      <item @click="evaluateSubject">
        <div slot="main">评价科目及周期</div>
      </item>
      <item @click="evaluateContent">
        <div slot="main">评价内容</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  data() {
    return {
      ways: [{
        name: '表情评分',
        value: '1',
        selected: false
      }, {
        name: '星级评分',
        value: '0',
        selected: false
      }]
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      metaDatas: 'getMetaDatas',
      evaluate: 'getCourseEvaluate'
    }),
    wayMeta() {
      return this.filterMeta('m_course_evaluation_score_method')
    },
    evaluateMeta() {
      return this.filterMeta('m_course_evaluation_parent_approve')
    },
    wayTxt() {
      let way = this.ways.filter(v => { return v.selected })[0]
      return way ? way.name : ''
    },
    isSwitched() {
      return this.evaluateMeta && this.evaluateMeta.obj === '1'
    }
  },
  methods: {
    ...mapActions(['modifyMetaData', 'setCourseEvaluate']),
    fetchData() {
      const that = this
      if (that.wayMeta) {
        that.ways = that.ways.map(v => { return { ...v, selected: v.value === that.wayMeta.obj } })
      }
    },
    filterMeta(type) {
      const that = this
      let meta = that.metaDatas.filter(m => {
        return m.metaType === type && m.extension === that.currentGroup.groupId
      })[0]
      return meta
    },
    handleSwitch() {
      const that = this
      let meta = that.evaluateMeta
      if (meta) {
        meta.obj = meta.obj === '1' ? '0' : '1'
      } else {
        meta = {
          extension: that.currentGroup.groupId,
          obj: '1',
          metaType: 'm_course_evaluation_parent_approve'
        }
      }
      that.modifyMetaData(meta).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
      })
    },
    handleWay(way) {
      const that = this
      let meta = {
        metaType: 'm_course_evaluation_score_method',
        obj: way.value,
        extension: that.currentGroup.groupId
      }
      that.wayMeta && (meta.id = that.wayMeta.id)

      that.modifyMetaData(meta).then(res => {
        that.ways = that.ways.map(v => { return { ...v, selected: v.value === way.value } })
        that.$message({ message: '操作成功', type: 'success' })
      })
    },
    evaluateContent() {
      this.routePush({ name: 'evaluateContent1127' })
    },
    evaluateSubject() {
      this.routePush({ name: 'evaluateSubject1127' })
    }
  }
}

</script>
