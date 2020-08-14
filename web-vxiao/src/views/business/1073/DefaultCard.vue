<template>
  <Card :message="message">
    <template v-if="routeQuery('appType')==='1073'" slot="down">
      <el-dropdown trigger="click" placement="bottom" class="drop-down">
        <div>
          <i class="ico ico-down"></i>
        </div>
        <el-dropdown-menu class="drop-menu" slot="dropdown">
          <el-dropdown-item @click.native.stop="removeClassRoomCard">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: Object
      }
    },
    methods: {
      removeClassRoomCard() {
        this.$emit('remove')
      }
    }
  }

</script>
