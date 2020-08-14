<template>
  <Card :message="message">
    <div slot="content"
         class="card-content">
      <div v-html="toContent(m.title, m.content)"></div>
      <template v-for="(item,i) in journals">
        <div class="journal-item"
             v-if="journals"
             :item="item"
             :key="i"
             @click="handleJournal(item)"
             v-html="toContent(item.title, item.content)"></div>
      </template>
    </div>
    <CardHref slot="href"
              v-if="button"
              :content="button.text"
              @click="button.handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapActions } from 'vuex'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      journals() {
        return this.message.children
      },
      button() {
        let _m = this.message

        let tp = {}
        if (Check.isArray(_m.children)) {
          _m.children.map(c => {
            tp[c.extensionType] = c
          })
        }

        let sTime = ''
        if (Check.isArray(_m.times)) {
          _m.times.map(t => {
            if (t.type === 'start') {
              sTime = t.setTime
            }
          })
        }

        let btn = null
        for (let i = 0; i < 7; i++) {
          let date = new Date(sTime)
          let t = new Date(date.setDate(date.getDate() + i))
          let t1 = new Date(date.setDate(date.getDate() + i))

          if (new Date().getTime() < t.getTime()) {
            continue
          }

          let child = tp[DateUtils.format_0800(t)]
          if (!child && new Date().getTime() < t1.setHours(36) && _m.fromUserId === this.userId) {
            btn = {
              text: `${DateUtils.day2week(t.toString())}日志`,
              time: DateUtils.format_0800(t.toString()),
              handle: this.handleAddJournal
            }
          } else {
            btn = null
          }
        }

        return btn
      }
    },
    methods: {
      ...mapActions(['setJournal']),
      toContent(title, content) {
        return `${title}：${this.converContent(content)}`
      },
      handleAddJournal() {
        this.setJournal({
          weekday: {
            title: this.button.text,
            time: this.button.time
          }
        })
        this.routePushModel({
          name: 'addJournal1034',
          params: {
            msgId: this.message.id
          }
        })
      },
      handleJournal(item) {
        this.routePushModel({
          name: 'journal1034',
          params: {
            msgId: item.id
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .journal-item {
    cursor: pointer;
    &:hover {
      background: #f9f9f9;
    }
  }
</style>
