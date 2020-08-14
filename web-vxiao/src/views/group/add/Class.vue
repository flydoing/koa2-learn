<template>
  <Page title="创建班级">
    <label slot="btn"
           @click="onNext">下一步</label>
    <Avatar @success="onLogo">
      <Item>
        <div>封面</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(g.logo,'thumb'),error:Image.ICO_GROUP}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item :hasClick="false">
      <div>班级名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="g.name" />
    </Item>
    <el-dropdown class="block-element"
                 trigger="click"
                 placement="bottom-end"
                 @command="onSchool">
      <Item>
        <div>所属</div>
        <div slot="remark">{{school.name}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="s in schools"
                          :key="s.id"
                          :command="s">{{s.name}} {{s.campusName}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <Item>
      <div>入学</div>
      <div slot="remark">
        <el-dropdown @command="onOrgType"
                     style="margin-right:10px">
          <span>{{category.name || '学段'}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="c in types"
                              :key="c.id"
                              :command="c">{{c.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="onYear">
          <span v-html="yearTxt"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="year in years"
                              :key="year"
                              :command="year">{{year}}级</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        g: { type: '2', year: '' },
        schools: [],
        categorys: [], // 学段分类
        years: [],
        school: {},
        category: {}
      }
    },
    computed: {
      types() {
        let arr = []
        if (this.school.schoolType) {
          arr = this.school.schoolType.split('').reverse()
          for (let i = 0, j = 1; i < arr.length; i++) {
            arr[i] = (+arr[i] * j).toString()
            j *= 10
          }
        }
        return this.categorys.filter(c => {
          return arr.indexOf(c.status) > -1
        })
      },
      yearTxt() {
        return this.g.year ? `${this.g.year}级` : '入学年份'
      }
    },
    activated() {
      let max = new Date().getFullYear()
      let min = max - 10
      let years = []
      for (; max >= min; max--) {
        years.push(`${max}`)
      }
      this.years = years
      Api.getJoinSchool().then(res => {
        if (res.schools) {
          this.schools = res.schools
          this.school = res.schools[0]
          this.onSchool(this.school)
        }
      })
      CategoryApi.getCategorysByType(3).then(res => {
        this.categorys = res.categorys || []
      })
    },
    methods: {
      onNext() {
        if (Check.isNullString(this.g.name)) {
          this.$message({ type: 'warning', message: '班级名称不能为空' })
          return
        }
        if (Check.isNullString(this.g.orgType)) {
          this.$message({ type: 'warning', message: '学段不能为空' })
          return
        }
        if (Check.isNullString(this.g.year)) {
          this.$message({ type: 'warning', message: '入学年份不能为空' })
          return
        }
        this.setStorage('_cache_class', this.g)
        this.routePush({
          path: '/vx/group/add/class/user'
        })
      },
      onLogo(file) {
        this.$set(this.g, 'logo', file.id)
      },
      onSchool(school) {
        this.school = school
        this.category = {}
        this.$set(this.g, 'orgType', '')
        this.g.schoolId = school.id
        this.g.campusId = school.campusId
      },
      onYear(year) {
        this.$set(this.g, 'year', year)
      },
      onOrgType(category) {
        this.category = category
        this.$set(this.g, 'orgType', category.status)
      }
    }
  }
</script>
