<!-- 报名题目 -->
<template>
  <div class="sign-step">
    <item label="方案名称"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <item label="志愿设置"
          v-if="form.id === undefined">
      <div slot="after">
        <i-switch :value="isSwitched"
                  @click="handleSwitch"></i-switch>
      </div>
    </item>
    <div class="category-title"></div>
    <draggable v-model="form.items">
      <item v-for="(item, i) in form.items"
            :key="i"
            @click="handleItem(item)"
            :label="item.name"
            :hasClick="item.default !== '1'">
        <div slot="before"><i class="ico ico-vs-sort"></i></div>
      </item>
    </draggable>
    <item label="新增"
          :hasArrow="false"
          @click="handleAdd">
      <div slot="before"><i class="ico ico-plus"></i></div>
    </item>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: { Draggable },
    props: {
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        form: {
          name: '',
          set: '1',
          items: [
            {
              name: '姓名',
              default: '1',
              type: { value: '1' }
            },
            {
              name: '手机',
              default: '1',
              type: { value: '2' }
            },
            {
              name: '性别',
              default: '1',
              type: { value: '4' }
            },
            {
              name: '出生日期',
              default: '1',
              type: { value: '10' }
            }
          ],
          removeItems: []
        }
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      isSwitched() {
        let form = this.form || {}
        return form.set === '1'
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let form = this.obj.form || {}
        let sData = form.signData
        if (sData) {
          this.form = JSON.parse(JSON.stringify(sData))
          let item = this.obj.signItem || {}
          if (item.status === 'd') {
            if (Check.isNumber(item.id)) {
              this.form.removeItems.push(item)
            }
            this.form.items = this.form.items.filter(v => {
              return v.id !== item.id
            })
          } else if (item.id) {
            this.form.items = this.form.items.map(v => {
              if (v.id === item.id) {
                return item
              }
              return v
            })
          } else if (!Check.isNullObject(item)) {
            this.form.items.push({ ...item, id: `new${Math.random(1, 999)}` })
          }
          this.saveData()
          this.modifyCreateObjectField('signItem')
        } else {
          this.saveData()
        }
      },
      saveData() {
        let form = this.obj.form || {}
        this.setCreateObject({
          form: {
            ...form,
            signData: this.form
          }
        })
      },
      handleSwitch() {
        let value = this.form.set
        this.form.set = value === '1' ? '0' : '1'
        this.saveData()
        this.$emit('set')
      },
      handleItem(item) {
        this.setCreateObject({ signItem: item })
        this.routePush({ path: '/vx/group/business/1300/signStep/itemEdit' })
      },
      handleAdd() {
        this.routePush({ path: '/vx/group/business/1300/signStep/itemEdit' })
      }
    },
    watch: {
      'form.name'(v) {
        this.saveData()
      },
      timeStamp(val) {
        this.fetchData()
      }
    }
  }
</script>
