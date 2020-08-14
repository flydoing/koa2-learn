<template>
  <div class="vx-card com-table"
       @click="handle">
    <slot name="logo">
      <div class="com-cell vx-card-logo"
           @click="handleLogo({queryType:'appType'})">
        <slot name="avatar">
          <img class="avatar"
               v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
               alt='头像' />
        </slot>
      </div>
    </slot>
    <div class="com-cell vx-card-main">
      <div class="card-header">
        <div>
          <slot name="name">
            <span class="text-color"
                  @click="handleLogo({queryType:m.type==='1068'?'user':'appType'})">{{m.name}}</span>
          </slot>
          <slot name="point">
            <span class="text-color"
                  v-if="m.name && m.label">▪</span>
          </slot>
          <slot name="label">
            <span class="text-color"
                  @click="userDetail(m.fromUserId)">{{m.label}}</span>
          </slot>
          <slot name="time">
            <span class="text-label f12"
                  v-if="m.time">{{m.time}}</span>
          </slot>
        </div>
        <slot name="down">
          <div class="drop-down"
               v-if="m.isInterface">
            <span class="f12 text-label"
                  @click.stop="handleMore">更多</span><i class="ico ico-right" />
          </div>
          <CardDown :m="message"
                    v-else></CardDown>
        </slot>
      </div>
      <slot name="title"></slot>
      <slot name="titles"></slot>
      <slot name="category">
        <CardHref slot="category"
                  :content="m.categoryName"
                  v-if="isCourse" />
      </slot>
      <slot name="content">
        <CardContent :content="m.content" />
      </slot>
      <slot name="contents"></slot>
      <slot name="audio">
        <CardAudio :audios="m.audios" />
      </slot>
      <slot name="images">
        <CardImages :images="m.images" />
      </slot>
      <slot name="files">
        <CardFiles :files="m.files" />
      </slot>
      <slot name="video">
        <CardVideo :video="m.video" />
      </slot>
      <slot name="href">
        <CardHref :content="m.hrefText"
                  @click="handleHref" />
      </slot>
      <slot></slot>
      <slot name="toolbar">
        <CardCounter @readed="handleReaded"
                     @reply="handleReply"
                     @praise="handlePraise"
                     :counter="m.counter">
          <slot name="counter">
            <i class="ico ico-private"
               v-if="m.isPrivate"></i><span>{{m.counter.label}} {{m.counter.readCount || 0}}</span>
          </slot>
          <template v-if="!showReply"
                    slot="reply"></template>
        </CardCounter>
        <slot name="reply">
          <CardReplyInput :show.sync="showInput"
                          :u="replyUser"
                          :m="message"
                          @reply="modify" />
        </slot>
        <slot name="replys">
          <div class="card-reply-list">
            <CardPraise :praises="m.praises"
                        @user="userDetail" />
            <CardReply v-for="(r,i) in m.replys"
                       :r="r"
                       :index="i"
                       :key="i"
                       @reply="handleReplyInput"
                       @user="userDetail"
                       @remove="handleRemove" />
          </div>
        </slot>
      </slot>
      <slot name="other"></slot>
    </div>
  </div>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from '@/api/message'
  import { mapActions } from 'vuex'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: Object },
      parentType: [String, Number]
    },
    computed: {
      showReply() {
        return this.currentGroup.isReview === 1 || this.isAdmin
      }
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      handle() {
        this.$emit('click', this.message)
      },
      handleRemove(r, i) {
        this.$confirm('确认删除该评论？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.reply({
            reply: { ...r, status: 'd' }
          }).then(res => {
            this.message.replys.splice(i, 1)
            this.modifyChannelMessage(this.message)
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleMore() {
        if (!this.parentType) {
          this.$emit('more', this.message)
        } else {
          this.routePushModel({
            path: `/vx/group/business`,
            query: {
              appType: this.parentType,
              groupId: this.groupId
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-card {
    .vx-card-main {
      .card-images {
        &.single {
          img {
            width: rem(400) !important;
            height: rem(200) !important;
            max-width: rem(400) !important;
            max-height: rem(200) !important;
          }
        }
      }
    }
  }
</style>
