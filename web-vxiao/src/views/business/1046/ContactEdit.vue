<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="canEdit">
    <template v-if="canEdit">
      <Avatar @success="handleAvatar">
        <Item label="头像">
          <div slot="remark">
            <img class="avatar big"
                 v-lazy="{src:url(form.avatar,'thumb'),error:Image.ICO_AVATAR}"
                 alt='LOGO' />
          </div>
        </Item>
      </Avatar>
    </template>
    <template v-else>
      <Item label="头像"
            :hasClick="false">
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(form.avatar,'thumb'),error:Image.ICO_AVATAR}"
               alt='LOGO' />
        </div>
      </Item>
    </template>
    <item :hasClick="false"
          label="姓名">
      <template v-if="canEdit">
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="form.name"></div>
      </template>
    </item>
    <div class="category-title"></div>
    <template v-if="canEdit">
      <el-popover placement="bottom-end"
                  width="400"
                  trigger="click"
                  v-model="showJob">
        <Scroller :height="300">
          <Item v-for="(item, i) in jobs"
                :key="i"
                @click="handleJob(item)"
                :label="item.name">
          </Item>
        </Scroller>
        <Item slot="reference"
              label="职务"
              :remark="form.job">
        </Item>
      </el-popover>
    </template>
    <template v-else>
      <Item :hasClick="false"
            label="职务"
            :remark="form.job">
      </Item>
    </template>
    <item :hasClick="false"
          label="手机号码">
      <template v-if="canEdit">
        <input slot="remark"
               placeholder="必填"
               v-model="form.mobile" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="form.mobile"></div>
      </template>
    </item>
    <item :hasClick="false"
          label="电子邮件">
      <template v-if="canEdit">
        <input slot="remark"
               placeholder="必填"
               v-model="form.email" />
      </template>
      <template v-else>
        <div slot="remark"
             v-html="form.email"></div>
      </template>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          job: '',
          avatar: '',
          mobile: '',
          email: ''
        },
        jobs: [],
        showJob: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        return this.form.id ? `联系人 ` : '新增联系人'
      },
      canEdit() {
        return this.crm.canEdit !== false
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        const that = this
        if (that.crm.contact) {
          this.form = { ...that.crm.contact }
          this.deleteCrmProp('contact')
        }
        CategoryApi.getCategorys({ type: '73' }).then(res => {
          this.jobs = res.categorys || []
        })
      },
      handleAvatar(file) {
        this.form.avatar = file.id
      },
      handleJob(item) {
        this.showJob = false
        this.form.job = item.name
      },
      handleSubmit() {
        const that = this
        let form = that.form
        let params = this.crm.params || {}
        if (Check.isNullString(form.name)) {
          that.$message({ message: '姓名不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.job)) {
          that.$message({ message: '职务不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.mobile)) {
          that.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }
        if (params.callback) {
          params.callback(form, () => {
            this.routeBack()
          })
        } else {
          that.setCrm({ contact: form })
          that.routeBack()
        }
      }
    }
  }
</script>
