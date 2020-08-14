<template>
  <page title="报名信息设置"
        hasAdd
        @add="addInfoHandle">
    <div class="category-title"
         style="text-align:center;">在此编辑报名人信息</div>
    <item v-if="lists.length>0"
          v-for="(mate, m) in lists"
          :hasClick="mate.userId!==0"
          :key="m"
          @click="itemClick(mate)">
      <div>{{mate.key}}</div>
    </item>
    <!-- <item @click="addInfoHandle">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div>添加</div>
    </item> -->
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        lists: []
      }
    },
    created() {
      Api.getApplyInfoList(this.currentGroup.parentId).then(res => {
        this.lists = res.metaDatas
      })
    },
    methods: {
      ...mapActions(['clearRadioDetailList', 'clearCheckboxDetailList', 'saveInputType']),
      itemClick(mate) {
        this.routePush({
          name: 'applyInfoEdit1055',
          query: {
            isEdit: true,
            title: mate.key,
            extension: mate.extension,
            userId: mate.userId,
            id: mate.id
          }
        })
      },
      addInfoHandle() {
        // 添加时清空vuex存储的数据
        this.clearRadioDetailList()
        this.clearCheckboxDetailList()
        this.saveInputType({})
        this.routePush({
          name: 'applyInfoEdit1055',
          query: {
            userId: this.currentGroup.parentId,
            type: 'add'
          }
        })
      }
    }
  }
</script>
