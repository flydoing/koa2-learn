<template>
  <Card :message="message"
        @click="handleTemplate(message)">
    <template slot="avatar">
      <img class="avatar"
           v-lazy="{src:url(message.businessLogo),error:Image.ICO_AVATAR}"
           alt='头像' />
    </template>
    <template slot="name">
      <span class="text-color">{{message.businessName}}</span>
    </template>
    <div slot="title"
         v-if="message.title"
         v-html="message.title"></div>
    <template slot="down">
      <CardDown :m="message"
                v-if="message.fromUserId === userId">
        <template slot="dropItem">
          <el-dropdown-item @click.native.stop="handleRemove">删除</el-dropdown-item>
        </template>
      </CardDown>
    </template>
    <template slot="toolbar"></template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      },
      index: {
        type: [Number]
      }
    },
    methods: {
      handleRemove() {
        this.$emit('remove', this.message, this.index)
      },
      handleTemplate(message) {
        this.$emit('click', message)
      }
    }
  }
</script>
