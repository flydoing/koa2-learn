<template>
  <Page :title="title"
        @add="add"
        hasAdd>
    <item @click="handleSelect(item,index) "
          v-for="(item,index) in DetailList"
          :key="index">
      <div>{{item.content}}</div>
      <div slot="remark"></div>

    </item>
  </Page>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        title: ''
      }
    },
    computed: {
      ...mapGetters(['getRadioDetailList', 'getCheckboxDetailList', 'RadioItemDetailList', 'CheckboxItemDetailList']),
      DetailList() {
        if (this.title === '单选按钮') {
          return this.getRadioDetailList || this.RadioItemDetailList
        } else {
          return this.getCheckboxDetailList || this.CheckboxItemDetailList
        }
      }
    },
    created() {
      this.title = this.$route.query.title
    },
    methods: {
      add() {
        this.routePush({
          name: 'Add1055',
          query: {
            title: this.title,
            type: 'add'
          }
        })
      },
      handleSelect(item, index) {
        this.routePush({
          name: 'Add1055',
          query: {
            title: this.title,
            content: item.name,
            type: 'edit',
            index: index,
            selected: item.selected
          }
        })
      }
    }
  }
</script>
