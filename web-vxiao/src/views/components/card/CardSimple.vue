<template>
  <div class="com-table vx-card vx-card-simple">
    <div class="vx-card-main">
      <div class="card-header">
        <slot name="title">
          <div v-html="m.title"
               class="ch-title"></div>
        </slot>
        <slot name="down">
          <CardDown :m="message"></CardDown>
        </slot>
      </div>
      <div class="card-title">
        <slot name="label">
          <span class="text-color has-click"
                @click="handleLogo({queryType:'appType'})">{{m.name}}</span>
        </slot>
        <slot name="time">
          <span class="text-label f12">{{m.time}}</span>
        </slot>
      </div>
      <slot></slot>
      <slot name="images">
        <CardImages :images="m.images"
                    :single="true"
                    v-if="m.images.length>0"></CardImages>
      </slot>
      <slot name="files">
        <CardFiles :files="m.files" />
      </slot>
      <slot name="video">
        <CardVideo :video="m.video" />
      </slot>
      <slot name="content">
        <div class="card-content">
          <label v-html="message.content"></label>
        </div>
      </slot>
      <slot name="other"></slot>
      <slot name="detail">
        <div class="card-entry has-click"
             @click="$emit('detail')">
          <div class="text-color">阅读全文</div>
          <i class="ico ico-right" />
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      m() {
        let _m = this.converMessage(this.message)
        _m.label = this.message.businessName
        if (_m.images.length > 0) {
          let cover = _m.images.filter(v => {
            return v.status === '2'
          })[0]
          if (cover) {
            _m.images = [cover]
          } else {
            _m.images = [_m.images[0]]
          }
        }
        return _m
      }
    }
  }
</script>
<style lang="scss">
  .vx-card-simple {
    .vx-card-main {
      padding-bottom: 0 !important;
      padding-left: nth($padding, 3) !important;
      .card-header {
        .ch-title {
          @include fh(90%);
        }
      }
      .card-content {
        label {
          @include lh(2);
        }
      }
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
    .card-entry {
      @include flex;
      @include ai;
      @include jc(space-between);
      margin-top: nth($padding, 1);
      border-top: $border;
      line-height: rem(40);
      overflow: hidden;
    }
  }
</style>
