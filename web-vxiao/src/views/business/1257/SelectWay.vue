<template>
  <page title="接龙方式"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item,i) in ways"
         :key="i">
      <item @click="handleSelect(item, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <template v-if="item.options">
          <div slot="remark">
            <label :class="{'text-color':item.type===1}">单选</label> / <label :class="{'text-color':item.type===2}">多选</label>
          </div>
          <div slot="after">
            <i-switch :value="isSwitched(item)"
                      @click="handleSwitch(item, i)"></i-switch>
          </div>
        </template>
        <template v-else
                  slot="after"></template>
      </item>
      <template v-if="item.options">
        <div v-for="(op,i) in item.options"
             :key="i">
          <item :hasClick="false"
                class="full-input">
            <input placeholder="选项内容"
                   v-model="op.content" />
          </item>
        </div>
        <item @click="handleAddOption(item)"
              :hasArrow="false">
          <div slot="before">
            <i class="ico ico-plus"></i>
          </div>
          <div slot="main">添加</div>
        </item>
      </template>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        ways: [
          {
            name: '综合：文本、图片、视频、语音、附件',
            value: '1',
            selected: false
          },
          {
            name: '选择',
            value: '2',
            options: [
              {
                content: '参加'
              },
              {
                content: '不参加'
              }
            ],
            type: 1,
            selected: false
          }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        solitaire: 'getSolitaire'
      })
    },
    methods: {
      ...mapActions(['setSolitaire']),
      fetchData() {
        let cache = this.solitaire.way || {}
        this.ways = this.ways.map(v => {
          if (cache.value === v.value) {
            return cache
          }
          return v
        })
      },
      isSwitched(item) {
        return item.type === 2
      },
      handleSwitch(item, i) {
        this.$set(this.ways[i], 'type', item.type === 1 ? 2 : 1)
      },
      handleAddOption(item) {
        item.options.push({ content: '' })
      },
      handleSelect(item) {
        this.ways = this.ways.map(v => {
          if (v.value === item.value) {
            v.selected = !item.selected
          } else {
            v.selected = false
          }
          return v
        })
      },
      handleSubmit() {
        let way = this.ways.filter(v => {
          return v.selected
        })[0]
        if (!way) {
          this.$message({ message: '请选择接龙方式', type: 'warning' })
          return false
        }
        if (way.value === '2') {
          let opts = way.options.filter(v => {
            return !Check.isNullString(v.content)
          })
          if (opts.length < 2) {
            this.$message({ message: '至少设置两个选项', type: 'warning' })
            return false
          }
          way.options = opts
        }
        this.setSolitaire({ way: way })
        this.routeBack()
      }
    }
  }
</script>
