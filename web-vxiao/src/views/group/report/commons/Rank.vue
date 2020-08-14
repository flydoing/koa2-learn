<template>
  <scroller :height="maxHeight">
    <Item v-for="(item,i) in datas"
          :key="i"
          :hasArrow="false"
          @click="onClick(item,i)"
          class="rank-item">
      <div slot="number">{{item.columns[0]}}</div>
      <div slot="before">
        <img class="avatar smaller"
             v-lazy="{src:url(item.columns[1]),error:Image.ICO_AVATAR}" />
      </div>
      <div slot="main">{{item.columns[2]}}</div>
      <div slot="remark">
        <span class='href-text'>{{item.columns[3]}} {{item.columns.length > 3 ? item.columns[4] : ''}}</span>
      </div>
    </Item>
  </scroller>
</template>

<script>
  export default {
    props: {
      tab: {
        type: Object,
        default: () => {
          return {}
        }
      },
      maxHeight: { type: [Number, String] }
    },
    computed: {
      rankData() {
        return this.tab.table || {}
      },
      datas() {
        return this.rankData.datas || []
      }
    },
    methods: {
      onClick(row) {
        this.$emit('click', row, this.rankData.params)
      }
    }
  }
</script>
