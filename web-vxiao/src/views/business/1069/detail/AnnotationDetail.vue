<template>
  <page title="批注详情">
    <CardTips text="暂无批注详情" v-if="!hasDetail" />
    <div class="annotation" v-else>
      <div class="annotation-title">{{message.title}}</div>
      <div class="annotation-content" v-html="message.content"></div>
      <CardImages :images="message.images" v-if="message.images.length>0" />
      <CardFiles :files="message.files" v-if="message.files.length>0" />
      <CardLinks :links="message.urls" v-if="message.urls.length>0" />
    </div>
    <div class="list-button" v-if="isDelete">
      <div class="button button-common" @click="deleteAnnotation">删除批注</div>
    </div>
  </page>
</template>
<script>
import PraxisApi from '@/views/business/1047/api'
import CardMixin from '@/views/components/card/mixin'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [CardMixin],
  data() {
    return {
      message: {
        images: [],
        files: [],
        urls: []
      },
      hasDetail: false,
      isDelete: false
    }
  },
  computed: {
    ...mapGetters({
      cacheReading: 'getReading'
    })
  },
  created() {
    if (this.routeQuery('msgId')) {
      PraxisApi.getTeacherDetail(this.routeQuery('msgId')).then(res => {
        if (res.praxis.messages) {
          this.hasDetail = true
          res.praxis.messages.forEach(m => {
            if (m.msgType === this.routeQuery('k')) {
              this.message = this.converMessage(m)
            }
          })
        }
      })
    } else {
      this.hasDetail = true
      this.isDelete = true
      this.message = this.converMessage(this.getStorage('annotation'))
    }
  },
  methods: {
    ...mapActions(['saveReading']),
    deleteAnnotation() {
      let localPostils = JSON.parse(JSON.stringify(this.cacheReading.postils))
      localPostils.splice(this.routeQuery('k'), 1)
      let text = this.delSpanTag(this.cacheReading.content, this.routeQuery('k'))
      this.saveReading({
        content: text,
        postils: localPostils
      })
      this.routeBack()
    },
    delSpanTag(str, k) {
      let arr = str.split('</span>')
      let str1 = arr[k].replace(/<sp(.*)>/, '')
      arr.splice(k, 1, str1)
      if (arr[arr.length - 1] === '') {
        arr.pop()
        arr.forEach((v, i) => {
          if (i !== k) {
            arr[i] = arr[i] + '</span>'
          }
        })
      } else {
        arr.forEach((v, j) => {
          if (j !== k && j !== arr.length - 1) {
            arr[j] = arr[j] + '</span>'
          }
        })
      }
      return arr.join('')
    }
  }
}

</script>
<style lang="scss">
@import '~scss/mixin';

.annotation {
  padding: rem(10);

  &-title {
    font-size: rem(16);
    padding-bottom: rem(10);
    border-bottom: rem(1) solid #ededed;
    margin-bottom: rem(10);
  }
}

</style>
