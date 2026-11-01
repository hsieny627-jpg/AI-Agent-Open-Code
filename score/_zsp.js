/* score/_zsp.js — 整句 中文 翻譯：詞 和 詞 中間 空 一格（2026-11-01 第三十八次 第 11-(6) 點）
 * 老師：「秒懂 動畫 以及 錯題 分析 中 的 中文 整句 翻譯，中文 字詞 和 中文 字詞 之間 請 空 一格。例：他 是 一位 老師」
 * ⚠ 跟 score/_dsp.js（學生 頁 的 中文「說明」不 空格，第三十五次）不 衝突：只有「整句 翻譯」空格，說明 照舊 不 空格。
 *   翻譯 的 元素 要 加 class="keepsp"（_dsp.js 不 動 它）。
 * 做法：最長 詞 優先（課本 第一冊 Topic 1、第三冊 Topic 1 會 出現 的 詞）；查不到 的 字 自己 一個 字；人名、英文、數字 照舊。
 *   ZSP('他是我的爺爺。') ➜ '他 是 我的 爺爺。'　ZSP('你叫什麼名字？') ➜ '你 叫 什麼 名字？' */
const W = ('我的 你的 他的 她的 我們 你們 他們 不是 是的 什麼 名字 幾歲 一位 一個 ' +
  '老師 學生 醫生 護理師 護士 農夫 廚師 爸爸 媽媽 爺爺 奶奶 祖父 祖母 外公 外婆 哥哥 姊姊 姐姐 弟弟 妹妹 叔叔 舅舅 伯伯 阿姨 姑姑 家人 朋友 ' +
  '高興 認識 謝謝 不客氣 早安 午安 晚安 哈囉 再見 進來 抱歉 對不起 遲到 沒關係 可以 幫忙 幫助 找不到 ' +
  '打開 闔上 關上 排隊 舉起 放下 安靜 起立 坐下 站起來 不要 說話 交談 奔跑 作業 時間 快一點 走吧 ' +
  '關掉 開燈 關燈 這是 這位 那是 不一樣 一樣 第一個 字母 小寫 大寫 ' +
  '十一 十二 十三 十四 十五 十六 十七 十八 十九 二十 三十 四十 ' +
  '一歲 二歲 兩歲 三歲 四歲 五歲 六歲 七歲 八歲 九歲 十歲 十一歲 十二歲 十三歲 十四歲 十五歲 十六歲 十七歲 十八歲 十九歲 二十歲 ' +
  '公車 鴨子 狐狸 貓熊 帽子 女王 公牛 兔子 窗戶 斑馬 鼻子 書桌 老虎 馬鈴薯 烏龜 海豚 番茄 桃子 香蕉 廂型車 螞蟻 袋子 貓咪 女孩 昆蟲 噴射機 風箏 獅子 猴子 ' +
  '溜溜球 背心 名牌 蛋糕 禮物 生日').split(/\s+/).filter(Boolean);
const CJK = '\\u3400-\\u9fff';
function SRC(W, CJK) {
  var D = {}, MX = 1; W.forEach(function (w) { D[w] = 1; if (w.length > MX) MX = w.length; });
  function seg(run) { var out = [], i = 0; while (i < run.length) { var k = Math.min(MX, run.length - i), hit = 1; for (; k > 1; k--) if (D[run.substr(i, k)]) { hit = k; break; } out.push(run.substr(i, hit)); i += hit; } return out.join(' '); }
  return function (s) { s = String(s == null ? '' : s); return s.replace(new RegExp('([' + CJK + '])[ \\u00a0]+(?=[' + CJK + '])', 'g'), '$1').replace(new RegExp('[' + CJK + ']+', 'g'), seg); };
}
const fix = SRC(W, CJK);
/* 網頁 用：window.ZSP(字串) */
const js = 'window.ZSP=(' + SRC.toString() + ')(' + JSON.stringify(W) + ',' + JSON.stringify(CJK) + ');';
module.exports = { W, fix, js };
