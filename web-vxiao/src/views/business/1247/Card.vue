<template>
  <Card :message="message">
    <img slot="avatar" style="max-width:none !important;" class="avatar" v-lazy="{src:url(message.fromUserAvatar,'thumb'),error:Image.ICO_AVATAR}" alt='头像' />
    <div slot="title" v-html="message.title"></div>
    <CardImages slot="images" :images="images" />
    <CardDown slot="down" :m="message">
      <el-dropdown-item v-if="isSuperAdmin || msg.fromUserId == userId" @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <div slot="counter" class="card-click" style="font-size: 14px;" @click.stop="handleReaded">{{gradeAcount}}个年级</div>
    <div slot="href" class="text-color card-click" @click.stop="hrefDetail(message)">查看详情</div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    computed: {
      images() {
        if (this.message.medias) {
          let imgs = []
          this.message.medias.forEach((v, k) => {
            if (v.type === 'photo' && v.status === '2') {
              this.$set(v, 'thumb', this.url(v.fileId, 'thumb'))
              this.$set(v, 'url', this.url(v.fileId))
              imgs.push(v)
            }
          })
          return imgs
        } else {
          return []
        }
      },
      gradeAcount() {
        return JSON.parse(this.message.msgJson).categoryIds.length
      }
    },
    methods: {
      handleEdit() {

      },
      handleReaded() {
        this.setStorage('grades', JSON.parse(this.message.msgJson).categoryIds)
        this.routePushModel({
          name: 'currentGrades1247'
        })
      },
      hrefDetail(m) {
        this.routePushModel({
          name: 'detail1247',
          params: {
            msgId: m.id
          },
          query: {
            type: m.type
          }
        })
      }
    }
  }

</script>
