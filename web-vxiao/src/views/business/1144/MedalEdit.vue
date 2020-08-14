<template>
  <Page :title="title" @submit="handleSubmit" hasSubmit>
    <div class="medal-edit">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark" placeholder="必填" v-model="medal.name" />
      </item>
      <item @click="handleSelectLogo">
        <div slot="main">图标</div>
        <img slot="remark" class="avatar" v-lazy="{src:logo}" alt='LOGO' />
      </item>
      <item :hasClick="false">
        <div slot="main">分值</div>
        <input slot="remark" placeholder="必填" v-model="medal.score" />
      </item>
    </div>
  </Page>
</template>
<script>
import R from '@/views/group/mixin'
import CategoryApi from '@/api/category'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  data() {
    return {
      medal: {
        name: '',
        score: 1,
        logo: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  components: {
    Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
  },
  computed: {
    ...mapGetters({
      classMedal: 'getClassMedal'
    }),
    title() {
      return this.medal.id ? '编辑奖章' : '新建奖章'
    },
    logo() {
      return this.medal.logo ? this.url(this.medal.logo) : ''
    }
  },
  methods: {
    ...mapActions(['setClassMedal']),
    fetchData() {
      let that = this
      let cache = that.classMedal.cache
      if (that.classMedal.medal) {
        that.medal = { ...that.classMedal.medal }
      } else if (cache) {
        that.medal = { ...cache }
      }
    },
    handleSelectLogo() {
      this.setClassMedal({ medal: this.medal })
      this.routePush({ name: 'selectLogo1144' })
    },
    handleSubmit() {
      let that = this
      let dim = that.classMedal.dimension
      let md = this.medal
      if (!Check.isString(md.name)) {
        that.$message({ message: '勋章名称不能为空', type: 'warning' })
        return false
      }
      if (!Check.isString(md.logo)) {
        that.$message({ message: '请选择勋章图标', type: 'warning' })
        return false
      }
      if (isNaN(md.score) || md.score > 20) {
        that.$message({ message: '请输入范围内的分值', type: 'warning' })
        return false
      }

      let category = {
        name: md.name,
        logo: md.logo,
        value: md.score,
        type: '70',
        parentId: dim.id,
        groupId: that.currentGroup.groupId
      }
      md.id && (category.id = md.id)

      CategoryApi.addCategory([category]).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    }
  }
}

</script>
