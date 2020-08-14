<template>
  <Page :title="title"
        closePrompt
        :hasSubmit="editAble"
        @submit="handleSubmit">
    <item label="时间"
          :hasClick="false">
      <template v-if="editAble">
        <el-date-picker slot="remark"
                        v-model="form.date"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="必填"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </template>
      <template v-else>
        <div slot="remark"
             v-html="form.date"></div>
      </template>
    </item>
    <item label="金额"
          :hasClick="false">
      <template v-if="editAble">
        <input slot="remark"
               placeholder="必填"
               v-model="form.amount" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="form.date"></div>
      </template>

      <div slot="after">元</div>
    </item>
    <div class="button button-common"
         v-if="editAble && (form.id || form.serial)"
         @click="handleRemove">删除</div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          date: '',
          amount: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        if (!this.editAble) {
          return '付款时间'
        }
        return this.form.id || this.form.serial ? '编辑付款时间' : '新增付款时间'
      },
      editAble() {
        return this.crm.editAble || false
      }
    },
    created() {
      if (this.crm.pay) {
        this.form = JSON.parse(JSON.stringify(this.crm.pay))
      }
    },
    methods: {
      ...mapActions(['setCrm']),
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.date)) {
          this.$message({ message: '请输入时间', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.amount) || !Check.isNumber(form.amount)) {
          this.$message({ message: '请输入金额（数值）', type: 'warning' })
          return false
        }
        this.setCrm({ pay: this.form })
        this.routeBack()
      },
      handleRemove() {
        this.$confirm('确认删除该付款时间？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setCrm({ pay: { ...this.form, status: 'd' } })
          this.routeBack()
        })
      }
    }
  }
</script>
