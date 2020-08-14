<template>
  <page title="场所预约"
        hasSubmit
        closePrompt
        @submit="handleSubmit">
    <div class="add-explain">
      <item class="m-time"
            :hasClick="false">
        <div slot="main">时间</div>
        <div slot="after"
             v-html="dateTxt"></div>
      </item>
      <item class="m-time"
            :hasClick="false">
        <div slot="main">场所</div>
        <div slot="after"
             v-html="placeTxt"></div>
      </item>
      <TextInput placeholder="用途说明"
                 v-model="content"></TextInput>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        content: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        placeReserve: 'getPlaceReserve'
      }),
      placeTxt() {
        return this.placeReserve.place ? this.placeReserve.place.placeName : ''
      },
      dateTxt() {
        return `${this.date} ${this.startTime}~${this.endTime}`
      }
    },
    methods: {
      ...mapActions(['setPlaceReserve']),
      fetchData() {
        let form = this.placeReserve.form
        let ps = form.periods.filter(v => {
          return v.active
        })
        this.date = form.date
        this.startTime = ps[0].start
        this.endTime = ps[ps.length - 1].end
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(this.content)) {
          this.$message({ message: '用途说明不能为空', type: 'warning' })
          return false
        }
        let place = that.placeReserve.place
        let postData = that.constructionMessage({
          type: '121201',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify({
            placeId: place.placeId,
            placeName: place.placeName,
            start: this.startTime,
            end: this.endTime,
            date: DateUtils.format(this.date, 'yyyyMMdd'),
            description: this.content
          })
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setPlaceReserve({ form: null })
          this.$router.go(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .add-explain {
    textarea {
      height: rem(100);
    }
  }
</style>
