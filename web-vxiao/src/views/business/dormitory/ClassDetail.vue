<template>
  <page title="宿舍"
        ref="_page">
    <div v-for="(item, i) in list"
         :key="i"
         class="each-building">
      <div class="category-title text">{{item.relations[0].floorName}}{{item.name}}</div>
      <item v-for="(user, j) in item.relations"
            :key="j"
            :hasClick="false">
        <div slot="before">
          <img class="avatar small"
               v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="user.name">
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.getClassDormitoryMember(this.groupId).then((res) => {
          this.list = res.dormitoryPlaceList || []
        })
      }
    }
  }
</script>
