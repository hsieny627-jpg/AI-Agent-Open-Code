/* rpg/_petsnd.js — 🐾 每一隻寵物 的 叫聲（2026-10-20 第十五次 老師 C17 第 3 題 ＝「真的動物用錄音」）
 * 真的動物 ＝ [錄音檔 rpg/snd/名字.mp3, 音量, 速度]（出處、授權 rpg/snd/CREDITS.md；檔案不在 ＝ 自動用電腦做的叫聲）
 * 神獸（龍、獨角獸、麒麟、鳳凰、獅鷲、史萊姆、機器、岩漿巨人、深海巨龍…沒有真的聲音）＝ ['syn', 種類]（rpg/_life_rt.js 的 RPSND.pet）
 * 兔子、六角恐龍 真的 幾乎 不會 叫 ➜ 電腦做的 小小 吱吱聲 */
module.exports = {
  p01: ['syn', 'dragon'], p02: ['fox', .8], p03: ['dog', .7], p04: ['syn', 'unicorn'], p05: ['syn', 'phoenix'], p06: ['syn', 'squeak'], p07: ['panda', .8],
  p08: ['cat', .8], p09: ['owl', .9], p10: ['syn', 'slime'], p11: ['syn', 'bird'], p12: ['syn', 'squeak'], p13: ['wolf', .7], p14: ['kitten', .8], p15: ['deer', .8],
  p16: ['wolf', .7, .85], p17: ['tiger', .8], p18: ['syn', 'bigdragon'], p19: ['syn', 'robot'], p20: ['syn', 'kirin'], p21: ['syn', 'phoenix'], p22: ['leopard', .8],
  p23: ['syn', 'rumble'], p24: ['syn', 'rumble'], p25: ['snake', .8], p26: ['fox', .8, .9], p27: ['bear', .8], p28: ['hawk', .7], p29: ['lion', .8], p30: ['bull', .8],
  s0801: ['fox', .8, 1.1], s0802: ['syn', 'slime'], s0803: ['syn', 'unicorn'], s0804: ['syn', 'dragon'], s0805: ['syn', 'bird'], s0806: ['syn', 'phoenix'], s0807: ['syn', 'robot'],
  s0808: ['syn', 'squeak'], s0809: ['deer', .8, 1.1], s0810: ['lion', .7, 1.3], s0811: ['syn', 'bigdragon'], s0812: ['tiger', .8, .9], s0813: ['syn', 'phoenix'], s0814: ['fox', .8, .95],
  s0815: ['syn', 'sea'], s0816: ['wolf', .7, .8], s0817: ['syn', 'kirin'], s0818: ['syn', 'rumble'], s0819: ['syn', 'phoenix'], s0820: ['syn', 'bigdragon']
};
