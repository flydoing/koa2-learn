<template>
  <SelectUser title="选择学生" :cache="cache" :users="users" :multiselect="false" @change="handleSelect">
    <template slot="opBtns">
      <label @click="handleEmpty">置空</label>
    </template>
  </SelectUser>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: [],
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        seatTable: 'getSeatTable'
      })
    },
    methods: {
      ...mapActions(['setSeatTable']),
      fetchData() {
        const that = this

        let uMap = new Map()
        let user = this.seatTable.seat.data || {}
        if (that.seatTable.form) {
          that.seatTable.form.list.map(v => {
            if (v.data && user.userId !== v.data.userId) {
              uMap.set(v.data.userId, v.data)
            }
          })
        }

        GroupApi.getGroupStudents(that.currentGroup.groupId).then(res => {
          that.users = res.relations.filter(v => {
            if (user.userId === v.userId) {
              that.cache = [v]
            }
            return !Check.isObject(uMap.get(v.userId))
          })
        })
      },
      handleSelect(u) {
        this.setSeatTable({ user: u })
        this.routeBack()
      },
      handleEmpty() {
        let seat = this.seatTable.seat
        this.setSeatTable({ seat: { ...seat, status: 'd' } })
        this.routeBack()
      }
    }
  }

</script>
