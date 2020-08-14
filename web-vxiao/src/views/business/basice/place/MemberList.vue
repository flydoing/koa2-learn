<template>
  <page title="管理员"
        hasSubmit
        @submit="handleSubmit">
    <Relate :items="us"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      us() {
        return this.users.map(v => {
          return { ...v, avatar: this.url(v.avatar) }
        })
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      fetchData() {
        let place = this.getStorage('_cache_place_', true)
        let admins = this.getStorage('_place_admins_cache')
        if (admins) {
          this.users = [...admins]
        } else if (place) {
          this.users = JSON.parse(JSON.stringify(place.managers || []))
        }
      },
      handleAdd() {
        this.setStorage('_place_admins_cache', this.users)
        this.routePush({ name: 'basicePlaceSelectMember' })
      },
      handleRemove(user, i) {
        this.users.splice(i, 1)
      },
      handleSubmit() {
        let place = this.getStorage('_cache_place_')
        this.setStorage('_cache_place_', { ...place, managers: this.users })
        this.routeBack()
      }
    }
  }
</script>
