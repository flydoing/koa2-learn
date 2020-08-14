/**
 * 排课公用处理逻辑
 */
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  data() {
    return {
      steps: [
        {
          name: '选择模式',
          value: 1,
          selected: true,
          active: false
        },
        {
          name: '教学时间',
          value: 2,
          selected: false,
          active: false
        },
        {
          name: '科目信息',
          value: 3,
          selected: false,
          active: false
        },
        {
          name: '班级信息',
          value: 4,
          selected: false,
          active: false
        },
        {
          name: '老师信息',
          value: 5,
          selected: false,
          active: false
        },
        {
          name: '必修任教',
          value: 6,
          selected: false,
          active: false
        },
        {
          name: '课室信息',
          value: 7,
          selected: false,
          active: false
        },
        {
          name: '规则预设',
          value: 8,
          selected: false,
          active: false
        }
      ],
      form: {}
    }
  },
  computed: {
    curStep() {
      let step = this.steps.filter(v => {
        return v.selected
      })[0]
      return step || this.steps[0]
    }
  },
  methods: {},
  watch: {}
}
