<template>
  <div class="vx-emojis">
    <div class="vx-emoji" v-for="emoji in emojis" @click="$emit('click',emoji)" :key="emoji.id">
      <img :src="url(emoji)" />
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      url(emoji) {
        return `/static/e/${emoji.url}`
      }
    },
    data() {
      return {
        emojis: [{ 'id': 1, 'phrase': '[微笑]', 'url': '001.png' }, { 'id': 2, 'phrase': '[撇嘴]', 'url': '002.png' }, { 'id': 3, 'phrase': '[色]', 'url': '003.png' }, { 'id': 4, 'phrase': '[发呆]', 'url': '004.png' }, { 'id': 5, 'phrase': '[得意]', 'url': '005.png' }, { 'id': 6, 'phrase': '[流泪]', 'url': '006.png' }, { 'id': 7, 'phrase': '[害羞]', 'url': '007.png' }, { 'id': 8, 'phrase': '[闭嘴]', 'url': '008.png' }, { 'id': 9, 'phrase': '[睡]', 'url': '009.png' }, { 'id': 10, 'phrase': '[大哭]', 'url': '010.png' }, { 'id': 11, 'phrase': '[尴尬]', 'url': '011.png' }, { 'id': 12, 'phrase': '[发怒]', 'url': '012.png' }, { 'id': 13, 'phrase': '[调皮]', 'url': '013.png' }, { 'id': 14, 'phrase': '[呲牙]', 'url': '014.png' }, { 'id': 15, 'phrase': '[惊讶]', 'url': '015.png' }, { 'id': 16, 'phrase': '[难过]', 'url': '016.png' }, { 'id': 17, 'phrase': '[酷]', 'url': '017.png' }, { 'id': 18, 'phrase': '[冷汗]', 'url': '018.png' }, { 'id': 19, 'phrase': '[抓狂]', 'url': '019.png' }, { 'id': 20, 'phrase': '[吐]', 'url': '020.png' }, { 'id': 21, 'phrase': '[偷笑]', 'url': '021.png' }, { 'id': 22, 'phrase': '[可爱]', 'url': '022.png' }, { 'id': 23, 'phrase': '[白眼]', 'url': '023.png' }, { 'id': 24, 'phrase': '[傲慢]', 'url': '024.png' }, { 'id': 25, 'phrase': '[饥饿]', 'url': '025.png' }, { 'id': 26, 'phrase': '[困]', 'url': '026.png' }, { 'id': 27, 'phrase': '[惊恐]', 'url': '027.png' }, { 'id': 28, 'phrase': '[流汗]', 'url': '028.png' }, { 'id': 29, 'phrase': '[憨笑]', 'url': '029.png' }, { 'id': 30, 'phrase': '[大兵]', 'url': '030.png' }, { 'id': 31, 'phrase': '[奋斗]', 'url': '031.png' }, { 'id': 32, 'phrase': '[咒骂]', 'url': '032.png' }, { 'id': 33, 'phrase': '[疑问]', 'url': '033.png' }, { 'id': 34, 'phrase': '[嘘]', 'url': '034.png' }, { 'id': 35, 'phrase': '[晕]', 'url': '035.png' }, { 'id': 36, 'phrase': '[折磨]', 'url': '036.png' }, { 'id': 37, 'phrase': '[衰]', 'url': '037.png' }, { 'id': 38, 'phrase': '[骷髅]', 'url': '038.png' }, { 'id': 39, 'phrase': '[敲打]', 'url': '039.png' }, { 'id': 40, 'phrase': '[再见]', 'url': '040.png' }, { 'id': 41, 'phrase': '[擦汗]', 'url': '041.png' }, { 'id': 42, 'phrase': '[抠鼻]', 'url': '042.png' }, { 'id': 43, 'phrase': '[鼓掌]', 'url': '043.png' }, { 'id': 44, 'phrase': '[糗大了]', 'url': '044.png' }, { 'id': 45, 'phrase': '[坏笑]', 'url': '045.png' }, { 'id': 46, 'phrase': '[左哼哼]', 'url': '046.png' }, { 'id': 47, 'phrase': '[右哼哼]', 'url': '047.png' }, { 'id': 48, 'phrase': '[哈欠]', 'url': '048.png' }, { 'id': 49, 'phrase': '[鄙视]', 'url': '049.png' }, { 'id': 50, 'phrase': '[委屈]', 'url': '050.png' }, { 'id': 51, 'phrase': '[快哭了]', 'url': '051.png' }, { 'id': 52, 'phrase': '[阴险]', 'url': '052.png' }, { 'id': 53, 'phrase': '[亲亲]', 'url': '053.png' }, { 'id': 54, 'phrase': '[吓]', 'url': '054.png' }, { 'id': 55, 'phrase': '[可怜]', 'url': '055.png' }, { 'id': 56, 'phrase': '[菜刀]', 'url': '056.png' }, { 'id': 57, 'phrase': '[西瓜]', 'url': '057.png' }, { 'id': 58, 'phrase': '[啤酒]', 'url': '058.png' }, { 'id': 59, 'phrase': '[篮球]', 'url': '059.png' }, { 'id': 60, 'phrase': '[乒乓]', 'url': '060.png' }, { 'id': 61, 'phrase': '[咖啡]', 'url': '061.png' }, { 'id': 62, 'phrase': '[饭]', 'url': '062.png' }, { 'id': 63, 'phrase': '[猪头]', 'url': '063.png' }, { 'id': 64, 'phrase': '[玫瑰]', 'url': '064.png' }, { 'id': 65, 'phrase': '[凋谢]', 'url': '065.png' }, { 'id': 66, 'phrase': '[嘴唇]', 'url': '066.png' }, { 'id': 67, 'phrase': '[爱心]', 'url': '067.png' }, { 'id': 68, 'phrase': '[心碎]', 'url': '068.png' }, { 'id': 69, 'phrase': '[蛋糕]', 'url': '069.png' }, { 'id': 70, 'phrase': '[闪电]', 'url': '070.png' }, { 'id': 71, 'phrase': '[炸弹]', 'url': '071.png' }, { 'id': 72, 'phrase': '[刀]', 'url': '072.png' }, { 'id': 73, 'phrase': '[足球]', 'url': '073.png' }, { 'id': 74, 'phrase': '[瓢虫]', 'url': '074.png' }, { 'id': 75, 'phrase': '[便便]', 'url': '075.png' }, { 'id': 76, 'phrase': '[月亮]', 'url': '076.png' }, { 'id': 77, 'phrase': '[太阳]', 'url': '077.png' }, { 'id': 78, 'phrase': '[礼物]', 'url': '078.png' }, { 'id': 79, 'phrase': '[拥抱]', 'url': '079.png' }, { 'id': 80, 'phrase': '[强]', 'url': '080.png' }, { 'id': 81, 'phrase': '[弱]', 'url': '081.png' }, { 'id': 82, 'phrase': '[握手]', 'url': '082.png' }, { 'id': 83, 'phrase': '[胜利]', 'url': '083.png' }, { 'id': 84, 'phrase': '[抱拳]', 'url': '084.png' }, { 'id': 85, 'phrase': '[勾引]', 'url': '085.png' }, { 'id': 86, 'phrase': '[拳头]', 'url': '086.png' }, { 'id': 87, 'phrase': '[差劲]', 'url': '087.png' }, { 'id': 88, 'phrase': '[爱你]', 'url': '088.png' }, { 'id': 89, 'phrase': '[NO]', 'url': '089.png' }, { 'id': 90, 'phrase': '[OK]', 'url': '090.png' }, { 'id': 91, 'phrase': '[爱情]', 'url': '091.png' }, { 'id': 92, 'phrase': '[飞吻]', 'url': '092.png' }, { 'id': 93, 'phrase': '[跳跳]', 'url': '093.png' }, { 'id': 94, 'phrase': '[发抖]', 'url': '094.png' }, { 'id': 95, 'phrase': '[怄火]', 'url': '095.png' }, { 'id': 96, 'phrase': '[转圈]', 'url': '096.png' }, { 'id': 97, 'phrase': '[磕头]', 'url': '097.png' }, { 'id': 98, 'phrase': '[回头]', 'url': '098.png' }, { 'id': 99, 'phrase': '[跳绳]', 'url': '099.png' }, { 'id': 100, 'phrase': '[挥手]', 'url': '100.png' }, { 'id': 101, 'phrase': '[激动]', 'url': '101.png' }, { 'id': 102, 'phrase': '[街舞]', 'url': '102.png' }, { 'id': 103, 'phrase': '[献吻]', 'url': '103.png' }, { 'id': 104, 'phrase': '[左太极]', 'url': '104.png' }, { 'id': 105, 'phrase': '[右太极]', 'url': '105.png' }]
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .vx-emojis {
    @include flex;
    @include jc(flex-start);
    @include ai(flex-start);
    @include wrap;
    .vx-emoji {
      padding: rem(2);
      cursor: pointer;
      &:hover {
        background: nth($background, 2)
      }
      img {
        width: rem(25);
        height: rem(25);
      }
    }
  }

</style>
