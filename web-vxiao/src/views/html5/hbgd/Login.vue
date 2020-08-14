<template>
  <div class="login-page">
    <div class="header">
      <div class="header-box">
        <a class="header-logo">
          <img class="header-logo-img"
               src="http://www.hrtn.com.cn/img/logo.png">
          <div class="header-logo-text">智慧教育云平台</div>
        </a>
      </div>
    </div>
    <div class="main"
         :style="h">
      <div class='describe'>
        <p>{{line.content}}</p>
        <p>{{line.author}}</p>
      </div>
      <div class="login">
        <div class="login-bar">
          <div class="code_bar code"
               :class="{'active':barType==='CODE'}"
               @click="barClick('CODE')">扫码登录</div>
          <div class="code_bar account"
               :class="{'active':barType==='ACCOUNT'}"
               @click="barClick('ACCOUNT')">账户登录</div>
        </div>
        <div class="login_code_panel panel"
             :class="{'active':barType==='CODE'}">
          <img v-lazy="{src:code.url}">
          <div>
            <span>{{code.remark}}</span>
            <span>{{code.describe}}</span>
          </div>
        </div>
        <div class="login_panel panel"
             :class="{'active':barType==='ACCOUNT'}">
          <div class="login_input">
            <form autocomplete="off">
              <div class="account">
                <input name="account"
                       placeholder="帐号"
                       v-model.trim="account"
                       @keyup="onKeyup"
                       @keyup.13="onLogin()" />
              </div>
              <div class="password">
                <input name="password"
                       type="password"
                       placeholder="密码"
                       v-model.trim="password"
                       @keyup="onKeyup"
                       @keyup.13="onLogin()"
                       @focus="onFocus" />
              </div>
            </form>
          </div>
          <div class='validate-message'>{{errorMessage}}</div>
          <div class="login_button button"
               @click="onLogin()">登录</div>
          <div class="login_help">
            <div class="login_jz">记住密码</div>
            <div class="login_wj">忘记密码？</div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div>Copyright 2018 © 湖北省广播电视信息网络股份有限公司</div>
      <div class="footer-mobile">
        <div><span>全省服务热线：</span><span>96516</span></div>
      </div>
    </footer>
  </div>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import * as Storage from '@/utils/storage'
  export default {
    computed: {
      h() {
        return { height: `${this.innerHeight}px` }
      },
      line() {
        return this.lines[this.random]
      }
    },
    created() {
      const that = this
      this.timer = setInterval(() => {
        that.random = Math.floor(Math.random() * (that.lines.length - 0) + 0)
      }, 5000)
    },
    methods: {
      onLogin(url, accessToken, code) {
        if (Check.isNullString(this.account)) {
          this.errorMessage = '* 帐号不能为空'
          return null
        }
        if (Check.isNullString(this.password)) {
          this.errorMessage = '* 密码不能为空'
          return null
        }
        Api.login(this.account, this.password, url, accessToken, code)
          .then(res => {
            if (res.code === '27') {
              this.errorMessage = `*${res.msg}`
            } else if (res.code === '1') {
              let url = `${window.location.protocol}//${window.location.host}/`
              // 跳转到修改密码页面
              if (res.userData.accountStatus === 'u') {
                Storage.session.set('_account', this.account)
                Storage.session.set('_pwd', this.password)
                window.location.href = `${url}/changepwd.html?d=${new Date().getTime()}`
                return null
              }
              let uInfo = res.userData.userInfo
              let uid = uInfo.id
              let tokenId = res.userData.tokenId
              let bService = res.userData.businessServer
              let cService = res.userData.channelServer
              let fService = res.userData.fileServer
              let oService = res.userData.oService
              let pService = res.userData.painterWebSocketServer
              let protocol = bService.protocol ? bService.protocol.toLocaleLowerCase() : 'http'
              // 数据存储
              Storage.session.set('uid', uid)
              // 设置token
              Storage.session.set(`${uid}_tokenId`, tokenId)
              Storage.local.removeLike(uInfo.type === '0' ? `_${uid}_` : uid)
              Storage.local.set('_account', this.account)
              Storage.local.set(`${uid}_clientId`, `web${uid}`)
              cService && Storage.local.set(`${uid}_mqtt_url`, `ws://${cService.uri}/mqtt`)
              bService && Storage.local.set(`${uid}_business_url`, `${protocol}://${bService.uri}`)
              fService && Storage.local.set(`${uid}_file_url`, `${protocol}://${fService.uri}`)
              pService && Storage.local.set(`${uid}_painter_url`, `ws://${pService.uri}/`)
              oService && Storage.local.set(`${uid}_online_services`, JSON.stringify(oService))
              protocol && Storage.local.set(`${uid}_protocol_`, protocol)
              Storage.local.set(`title`, '湖北广电-智慧教育云')
              Storage.local.set(`${uid}_userInfo`, JSON.stringify(uInfo))
              Storage.local.set('CM_TOURIST_INDEX', false)
              clearInterval(this.timer) // 清除定时
              window.location.href = `${window.location.protocol}//${window.location.host}/index.html?d=${new Date().getTime()}`
            }
          })
          .then(res => {})
      },
      onKeyup() {
        this.errorMessage = ''
      },
      onFocus() {
        this.password = ''
        this.errorMessage = ''
      },
      barClick(type) {
        this.barType = type
        if (type === 'CODE') {
          this.loadCode()
        }
      },
      loadCode(userId) {
        if (this.barType !== 'CODE') {
          return null
        }
        let url = '/base/aas/qrcode'
        if (this.code.url && this.code.url !== '') {
          url = `${url}?id=${this.code.id}`
        }
        if (userId) {
          url = `${url}&userId=${userId}`
        }
        Api.loadCode(url).then(res => {
          if (res.user && Check.isNull(res.accessToken)) {
            this.loadCode(res.user.id)
            this.code.url = `/commons/file/${res.user.avatar}`
            this.code.remark = '扫码成功'
            this.code.describe = '请在手机上确认登录'
          } else if (!Check.isNull(res.accessToken)) {
            this.onLogin('/base/aas/auth/token', res.accessToken, this.code.id)
          } else if (res.qrcode) {
            this.code.url = `/commons/file/${res.qrcode}`
            this.code.id = res.qrcode
            this.code.describe = '使用V校App扫码登录'
            this.loadCode()
          } else {
            this.loadCode()
          }
        })
      }
    },
    mounted() {
      Storage.session.clear()
    },
    data() {
      return {
        timer: null,
        code: {},
        account: '',
        password: '',
        errorMessage: '',
        random: 0,
        barType: 'ACCOUNT',
        lines: [
          { content: '教育，是用一颗树去摇动另一棵树。' },
          { content: '教育，是用一颗心去唤醒另一颗心。' },
          { content: '教育，根植于爱。' },
          { content: '教育，应该给孩子以梦想。' },
          { content: '子十过，不如奖其一功。', author: '——颜元（清代教育家）' },
          { content: '成若天性，习惯如自然。', author: '——孔子' },
          { content: '育不是灌输，而是点燃心灵的火焰。', author: '——苏格拉底' },
          { content: '双亲来说，家庭教育首先是自我教育。?', author: '——克鲁普斯卡娅' },
          { content: '处是创造之地，天天是创造之时，人人是创造之人。', author: '——陶行知' },
          { content: '教育者，养成人性之事业也。', author: '——蔡元培' },
          { content: '比宇宙更辽阔的是什么？是想象力。', author: '——爱因斯坦' },
          { content: '所有智力方面的工作都要依赖于兴趣。', author: '——皮亚士（瑞士教育家）' },
          {
            content: '让学生体验到一种自己在亲身参与掌握知识的情感，乃是唤起少年特有的对知识的兴趣的重要条件。',
            author: '——苏霍姆林斯基（前苏联教育家）'
          },
          { content: '来的文盲不再是不识字的人，而是没有学会怎样学习的人。', author: '——埃德加·富尔（联合国教科文组织国际教育发展委员会前主席）' },
          { content: '先生的责任不在教，而在教学，教学生学。', author: '——陶行知' },
          { content: '思维由惊奇和问题开始。', author: '——亚里士多德' },
          { content: '教育即生活，生活即教育。', author: '——杨文' },
          { content: '有一颗好奇心最重要。', author: '——詹姆斯·沃森（DNA之父、诺贝尔奖获得者）' },
          {
            content: '生而好学为上，熏染而学次之，督促而学以次之，最下者虽督促不学。然而生而好学与督促不学的人究竟是少数，大多数得到相当熏染、督促就学习。',
            author: '——陶行知'
          },
          { content: '宽可以容人，唯厚可以载物。', author: '——薛宣（明代）' },
          { content: '到了图书馆，就像牛进了菜园，拼命地吃！', author: '——毛泽东（1918年任北大图书馆助理员）' },
          { content: '发明千千万，起点是一问。智者问得巧，愚者问得笨。', author: '——陶行知' },
          { content: '历史学的目的是为了人类的自知。', author: '——英国著名学者柯林武德 ' },
          { content: '兴趣是最好的老师。', author: '——帕拉图' },
          { content: '之者不如好之者，好之者不如乐之者。', author: '——孔子' },
          { content: '有比成功更能增加满足的感觉，也没有比成功更能鼓起进一步成功的努力。', author: '——盖兹（心理学家）' },
          { content: '时要让孩子知道，我们爱他们，大家喜欢他们，是因为他们的品德，与他们的成绩单没有任何关系。', author: '—第威夫人（美国）' },
          { content: '授之以鱼，足解一日之饥；授之以渔，足食终身之鱼。', author: '—中国谚语' },
          { content: '天下大事，必作于细；天下难事，必成于易。', author: '—中国谚语' },
          { content: '种下行动就会收获习惯，种下习惯就会收获品格，种下品格就会收获命运。', author: '——威廉·詹姆斯（哲学家）' },
          { content: '生在世，第一是读书，第二是多读书，第三是有系统地有选择地读书。', author: '——张大千' },
          { content: '德能正其身，才能称其职，笔能成其文，言能明其志。', author: '——对教师的要求' },
          { content: '水不激不跃，人不激不奋。', author: '——冯梦龙（明代）' },
          { content: '校长对学校的领导，首先是教育思想的领导。', author: '—苏霍姆林斯基（前苏联教育家）' },
          { content: '优秀就是优秀的习惯。', author: '—亚里士多德' },
          { content: '礼、义、廉、耻，国之四维，四维不张，国乃灭亡。', author: '——致德育工作' },
          { content: '千教万教，教人求真；千学万学，学做真人。', author: '——陶行知' },
          { content: '教师即研究者（teacher?as?reseacher）。', author: '—— 斯腾浩斯（1970年代）' },
          { content: '果把错误关在门外，真理也将关在门外。', author: '——泰戈尔' },
          { content: '称为英雄的，并非以思想或强力称雄的人；而只是靠心灵而伟大的人。', author: '——罗曼·罗兰' },
          { content: '功的教师之所以成功，是因为他把课教活了。', author: '——吕叔湘' },
          { content: '教室是教学的实验室。', author: '——杜威（美国著名教育家）' },
          { content: '成功的教学所需要的不是强制，而是激发兴趣。', author: '——列夫·托尔斯泰' },
          { content: '教人未见意趣，必不乐学。', author: '——朱熹（宋代）' },
          { content: '最精湛的教学艺术，遵循的最高准则就是让学生自己提出问题。', author: '——布鲁巴克（美国）' },
          { content: '儿童学习任何事情的最合适的时机是当他们兴致高、心里想做的时候。” –-洛克（英国）' },
          { content: '一个人的发展取决于和他直接或间接进行交往的其他一切人的发展。', author: '——马克思' },
          { content: '教育是农业，不是工业。', author: '——叶圣陶' },
          { content: '也许是一个恕字能让人一生受用。', author: '——孔子曾对子贡说' },
          { content: '求知是人的本性。', author: '——亚里斯多德' },
          { content: '学习如春起之苗，不见其增，日有所长。' },
          { content: '大声喧哗反而难以入耳。', author: '——艾默生（美国）' },
          { content: '若非拱手让人，任何人无法剥夺我们的自尊。', author: '——圣雄甘地（Gandhi）' },
          { content: '学日益，为道日损，损之又损，以至于无为，无为而无不为。', author: '——老子' },
          { content: '一个案例就是一个实际情境的描述，在这个情境中包含有一个或多个疑难问题，同时也可能包含有解决这些问题的方法。', author: '—郑金洲' },
          { content: '天空中没有鸟的痕迹，但我已飞过。', author: '——泰戈尔' },
          { content: '一个教师能走多远，她的学生就能走多远。', author: '——窦桂梅（清华附小校长）' },
          {
            content: '果每一个孩子都学会了赏识自己，都找到了自己是一个好学生的感觉，都有了自信和创造的尊严，那么，他们将获得终身享用不尽的真正财富。',
            author: '——窦桂梅（清华附小校长）'
          },
          { content: '把简单的事情做好就是不简单。', author: '——张瑞敏（海尔）' },
          { content: '类本质中最殷切的要求是：渴望被肯定。', author: '——詹姆士（哲学家）' },
          { content: '人人有才，人无全才，扬长避短，人人成才。', author: '——吕型伟（教育家）' },
          { content: '贵有恒，何必三更眠五更起；最无益，莫过一日曝十日寒。', author: '—毛泽东（湖南长沙第一师范读书时书联）' },
          { content: '一所学校绝对不能藏龙卧虎，是龙就让它腾，是虎就让它跃。', author: '—刘彭芝（人大附中校长）' },
          { content: '吟诵就是心、眼、口、耳并用的一种学习方法。', author: '——叶圣陶' },
          { content: '人的学习活动不仅仅靠大脑皮层结构，而且是在情感和潜意识的共同参与下进行的。', author: '——洛扎诺夫（保加利亚心理学家）' },
          { content: '对一个真正的教育家而言，没有什么事是不可能的。', author: '——克里希纳穆提（印度）' },
          { content: '堂宁要‘乱’，不要‘死’，‘乱’是暂时的，‘活’是必然的。', author: '——山东昌乐二中' },
          { content: '正的对话，是从一个开放心灵到另一个开放心灵之话语。马丁·布伯（德国）' },
          { content: '学习任何东西的最好途径是自己发现。', author: '—波利亚' },
          { content: '评价最重要的意图不是为了证明，而是为了改进。', author: '——斯塔费尔比姆（美国）' },
          { content: '从家庭开始出现那天起，从父亲和母亲开始热爱孩子的那天开始，教育就存在了。', author: '——凯姆佩尔（法国）' },
          { content: '爱是理解的别名。', author: '——泰戈尔' },
          { content: '界上最可怕的两个词，一个叫认真，一个叫执着。认真的人改变自己，执着的人改变命运。' },
          { content: '生则遇忧患横逆之时当以忍待其静，则遇荣利争夺之境当以退让守其雌。', author: '——曾国藩' },
          { content: '生平最受用的两句话，一是责任心，二是趣味。', author: '——梁启超' },
          { content: '说孩子是未来世界的主人翁，我们处处看见他们在作现在这个世界的主人翁。', author: '——梁实秋' },
          { content: '育是什么，往简单方面说，只需一句话，就是养成良好的习惯。', author: '——叶圣陶' },
          {
            content: '十多岁高龄还能熟练地背诵圆周率小数点后一百位以内的数。有人向他请教记忆诀窍，他的回答是：重复！重复！再重复！',
            author: '——茅以升'
          },
          { content: '当仁，不让于师。', author: '——孔子《论语·卫灵公》' },
          { content: '人以言者，其感不深；动人以行者，其应必速。', author: '——李贽' },
          {
            content: '从我手里经过的学生成千上万，奇怪的是，留给我印象最深的并不是无可挑剔的模范生，而是别具特点，与众不同的孩子。',
            author: '——苏霍姆林斯基'
          },
          { content: '最有价值的知识是关于方法的知识。', author: '——达尔文' },
          { content: '的先生不是教书，不是教学生，乃是教学生学。', author: '——陶行知' },
          { content: '习任何知识的最佳途径是由自己去发现，因为这种发现理解最深、也最容易掌握其中的规律、性质和联系。', author: '——波莉亚' },
          { content: '有首先看到学生优点的地方，学生才能产生上进心。', author: '——苏霍姆林斯基' },
          { content: '的教鞭下有瓦特，你的冷眼里有牛顿，你的讥笑中有爱迪生。', author: '——陶行知' },
          { content: '培养人就是培养他对前途的希望。', author: '——马卡连柯' },
          { content: '人类本质中最殷切的需求是渴望被肯定。', author: '——威廉·詹姆士（美国心理学家）' },
          { content: '教师不替学生说学生自己能说的话，不替学生做学生自己能做的事，学生能讲明白的知识尽可能让学生讲。', author: '——魏书生' },
          { content: '如果良好的习惯是一种道德资本，那么，在同样的程度上，坏习惯就是道德上的无法偿清的债务了。', author: '——乌申斯基' },
          { content: '没有爱，就没有教育。', author: '——苏霍姆林斯基' },
          { content: '尊重儿童，不要急于对他作出或好或坏的评判。', author: '——卢梭' },
          { content: '只有爱才是最好的教师，它远远超过责任感。", "uthor": "——爱因斯坦' },
          { content: '错误在所难免，宽恕就是神圣。', author: '——波普' },
          { content: '一个人发挥最大能力的方法，是赞赏和鼓励。' },
          { content: '教师的职责已经越来越少地传递知识，而越来越多地是激励思考。' },
          {
            content: '“生本教育”的核心理念，就是高度尊重学生，全面依靠学生，把以往教学中主要依靠教师的教，转变为主要依靠学生的学。',
            author: '——郭思乐'
          },
          { content: '施教之功，贵在引路，妙在开窍。”' },
          { content: '的老师上课会叙述，一般的老师上课会讲解，良好的老师会提问，优秀老师重在启发，杰出的老师让课堂开放。', author: '——杜郎口中学' },
          { content: '培养人，就是培养他对前途的希望。' },
          { content: '阅读是为了活着。', author: '——福楼拜（法国）' },
          { content: '教育就是教人变，教人变好就是好教育，教人变坏就是坏教育，活教育教人变活，死教育教人变死。', author: '——陶行知' },
          { content: '教育的最高目的，就是要帮助学生学会与整个世界和谐相处。', author: '——布鲁纳（教育家）' }
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login-page {
    .header {
      background: rgba(255, 255, 255, 0.9);
      height: rem(75);
      position: fixed;
      top: 0;
      z-index: 999;
      width: 100%;
      @include ct;
      &-box {
        width: 60%;
        cursor: pointer;
        @include ct;
      }
      &-logo,
      &-nav {
        flex-grow: 1;
        width: 50%;
      }
      &-logo {
        @include flex;
        @include ai(center);
        @include jc(flex-start);
        cursor: pointer;
        &-text {
          margin-left: rem(20);
          @include fs(20);
        }
      }
      &-nav {
        @include flex;
        @include ai(center);
        @include jc(flex-end);
        a {
          display: block;
          height: rem(75);
          padding: 0 rem(15);
          line-height: rem(75);
          @include fs(16);
          font-family: Arial, 'Hiragino Sans GB', md-hsgb, 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif;
          &:hover {
            background: nth($background, 2);
          }
        }
      }
      a {
        color: #333 !important;
      }
    }
    .main {
      background: url(/static/banner.jpg) no-repeat center/cover;
      @include ct;
      .describe {
        @include fs($font-big);
        color: nth($font-color, 4);
        width: rem(300);
        line-height: 1.5;
        text-indent: 2em;
        text-shadow: 0 1px 1px rgba(32, 32, 32, 1);
        p:last-child {
          text-align: right;
        }
      }
      .login {
        width: rem(300);
        margin-left: rem(125);
        background: rgba(255, 255, 255, 0.9);
        @include borderRadius(nth($radius, 2));
        overflow: hidden;
        &-bar {
          width: 100%;
          display: table;
          line-height: rem(50);
          margin-bottom: rem(10);
        }
        .code_bar {
          display: table-cell;
          text-align: center;
          cursor: pointer;
          &.active {
            @include fc;
          }
          &:hover {
            background: nth($background, 2);
          }
        }
        .panel {
          display: none;
          position: relative;
          &.active {
            display: block;
          }
        }

        .login_input {
          width: rem(250);
          height: rem(90);
          border: $border;
          border-radius: rem(5);
          margin: 0 auto;
          div {
            &:before {
              pointer-events: none;
              content: '';
              position: absolute;
              height: rem(40);
              padding-left: rem(52);
              background: url(/static/username.png) no-repeat 18px center !important;
            }
            &.password:before {
              background: url(/static/password.png) no-repeat 18px center !important;
            }
            &.account input {
              border-bottom: $border;
              border-bottom-left-radius: rem(0);
              border-bottom-right-radius: rem(0);
            }
            &.password input {
              border-bottom: $border;
              border-top-left-radius: rem(0);
              border-top-right-radius: rem(0);
            }
          }
          input {
            @include fs($font-big);
            height: rem(45);
            padding-left: rem(50);
            margin: 0;
            width: 100%;
            display: block;
            border: 0;
            outline: none;
            border-radius: rem(5);
          }
        }
        .validate-message {
          position: absolute;
          top: rem(94);
          left: rem(25);
          width: rem(250);
          margin: 0 auto;
          @include fs($font-small);
          color: nth($font-color, 5);
        }
        .login_button {
          height: rem(40);
          line-height: rem(40);
          width: rem(250);
          margin: rem(25) auto rem(15) !important;
        }
        .login_help {
          @include ct;
          width: rem(250);
          margin: 0 auto;
          margin-bottom: rem(15);
          & > div {
            width: 50%;
            cursor: pointer;
            &:last-child {
              text-align: right;
            }
          }
        }
        &_code_panel {
          img {
            width: rem(180);
            height: rem(175);
            margin: rem(-10) auto 0;
          }
          div {
            height: rem(40);
            text-align: center;
            line-height: rem(40);
          }
        }
      }
    }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: rem(60);
      background: rgba(255, 255, 255, 0.9);
      @include ct;
      & > div {
        padding: 0 rem(20);
      }
      .footer-mobile {
        padding: 0;
        span {
          display: inline-block;
          text-align: left;
          width: rem(130);
          &:first-child {
            text-align: right;
          }
        }
      }
    }
  }
</style>
