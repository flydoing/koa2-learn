<template>
  <page title="新建班级勋章"
        closePrompt>
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item v-for="(group,j) in item.groups"
            :key="j"
            @click="handleGroup(group, i, j)">
        <div slot="main"
             v-html="group.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        all: false
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        classMedal: 'getClassMedal'
      })
    },
    methods: {
      ...mapActions(['setClassMedal']),
      fetchData() {
        const that = this
        GroupApi.getSchoolClasses(this.currentGroup.parentId).then(res => {
          that.list = res.groups
        })
      },
      handleGroup(item) {
        this.setClassMedal({ group: item })
        this.routePush({ name: 'sendMedal1144' })
      }
    }
  }
</script>
