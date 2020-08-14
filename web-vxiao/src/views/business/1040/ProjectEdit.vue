<template>
  <page title="签到项目"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item,i) in list"
         :key="i">
      <item :hasClick="false">
        <template v-if="item.extension=='1'">
          <div slot="main"
               v-html="item.name"></div>
        </template>
        <template v-else>
          <input placeholder="名称"
                 v-model="item.name" />
          <i slot="after"
             class='ico ico-delete'
             @click="handleRemove(i)"></i>
        </template>
      </item>
    </div>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        meeting: 'getMeeting'
      })
    },
    methods: {
      ...mapActions(['setMeeting']),
      fectchData() {
        let projects = this.meeting.projects
        if (Check.isRealArray(projects)) {
          this.list = JSON.parse(JSON.stringify(projects))
        } else {
          CategoryApi.getCategorys({ type: '193' }).then(res => {
            this.list = res.categorys
          })
        }
      },
      handleRemove(index) {
        this.list.splice(index, 1)
      },
      handleAdd() {
        this.list.push({ name: '' })
      },
      handleSubmit() {
        let emptys = this.list.filter(v => {
          return Check.isNullString(v.name)
        })
        if (Check.isRealArray(emptys)) {
          this.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }
        this.setMeeting({ projects: this.list })
        this.routeBack()
      }
    }
  }
</script>
