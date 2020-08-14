<template>
  <page :title="title" hasSubmit @submit="commitEidt" v-viewer.static>
    <item class="full-input" :hasClick="false">
      <input type="text" placeholder="菜式名称" v-model="foodName">
    </item>
    <item class="full-input" :hasClick="false" style="padding-right: 10px;">
      <input type="text" placeholder="菜式价格" v-model="price">元
    </item>
    <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <item>
        <div>菜式图片</div>
        <div slot="remark">
          <img :data-source="url(pic)" class="avatar big" v-lazy="{src:url(pic, 'thumb'), error: '//m.vxiao.cn/images/cooding_default.png'}" alt='avatar' />
        </div>
      </item>
    </el-upload>
    <div class="food-description">
      <TextInput v-model="description" :max="50" placeholder="菜品描述（不超过50个字）"></TextInput>
    </div>
    <div class="list-button" v-if="routeQuery('foodName')">
      <div class="button button-common" @click="deleteFood">删除</div>
    </div>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import Api from '../api'
  export default {
    mixins: [G],
    data() {
      return {
        title: '',
        pic: '',
        price: '',
        foodName: '',
        description: ''
        // showImgs: [],
        // showImageViewBox: false
      }
    },
    created() {
      this.title = this.routeQuery('foodName') ? this.routeQuery('foodName') : '新建菜式'
      this.price = this.routeQuery('price') || ''
      this.foodName = this.routeQuery('foodName') || ''
      this.description = this.routeQuery('description') || ''
      this.pic = this.routeQuery('logo') || ''
      // this.routeQuery('logo') && this.showImgs.push({
      //   thumb: this.url(this.routeQuery('logo'), 'thumb'),
      //   url: this.url(this.routeQuery('logo')),
      //   type: 'photo',
      //   id: this.routeQuery('logo')
      // })
    },
    methods: {
      handleAvatarSuccess(res) {
        this.pic = res.file.id
      },
      beforeAvatarUpload(e, event) {
      },
      commitEidt() {
        this.modifyFood({
          foods: [{
            id: this.routeQuery('foodId') || '',
            name: this.foodName,
            price: this.price,
            logo: this.pic,
            groupId: this.currentGroup.groupId,
            description: this.description
          }]
        })
      },
      deleteFood() {
        this.modifyFood({
          foods: [{
            id: this.routeQuery('foodId'),
            status: 'd'
          }]
        })
      },
      modifyFood(d) {
        Api.modifyFoodInfo(d).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        })
      },
      bigPic() {
        // this.showImageViewBox = true
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .food-description {
    textarea {
      display: block;
      width: 100%;
      margin: 0 0 rem(10);
      padding: rem(10);
      border: none;
      border-bottom: rem(1) solid #ededed;
    }
  }

  .el-upload {
    width: 100%;
  }

</style>
