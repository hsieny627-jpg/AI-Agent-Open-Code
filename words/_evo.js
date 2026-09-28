/* words/_evo.js — ⏳ 單字時光機的產生器（使用者 2026-09-28 指定，第 6(4)E 點；資料在 _evo_data.js）
 *
 * 一個字一頁（<字>-evo.html，跟字卡放同一個資料夾），五幕：
 *   0 封面 ➜ ① 為什麼拼法變了（時光隧道）➜ ② 以前 ↔ 今天（字母對齊大對比）
 *   ➜ ③ 以前會唸、現在不唸的字母（或這個字真正有趣的地方）➜ 收尾
 * 每一幕都先猜再揭曉（故事頁樣板 _build_story.js 的 tpl），每一幕的「📖 出處」直接跳到那一幕自己的證據。
 *
 * 和 17 張字卡的禁令不衝突：words/CLAUDE.md「絕對不可違反」第 1 條管的是**字卡**（三幕不動）。
 * 時光機是獨立頁（跟 why.html 一樣），而且**不做字母逐格變形動畫**：時光隧道一站一張快照，
 * 動的是「年代」和「誰改的」；變了的字母只換顏色，不變形。
 */
const fs = require('fs'), path = require('path');
const { tpl } = require('./_build_story');
const { EVO } = require('./_evo_data');
const { ev, I } = require('./_sources');

const byW = {}; EVO.forEach(r => { byW[r.w] = r; });

/* 比較兩個拼法，回傳「新的那一個」每個字母有沒有變（去掉長音符號再比，ā ＝ a） */
const base = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function mark(prev, cur) {
  if (!prev) return esc(cur);
  const a = [...base(prev)], b = [...cur], bb = [...base(cur)], n = a.length, m = b.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    L[i][j] = a[i] === bb[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const keep = new Array(m).fill(false); let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === bb[j]) { keep[j] = true; i++; j++ } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++ }
  return b.map((c, k) => keep[k] || c === ' ' ? esc(c) : '<i class="evc">' + esc(c) + '</i>').join('');
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ago = y => y === '今天' ? '📱 今天' : '⏳ 大約 ' + y + ' 年前';

/* ① 時光隧道：一站一站跳出來（每一站 ＝ 一張快照 ＋ 年代 ＋ 那時候的語言） */
function tunnel(r) {
  const st = r.st;
  return '<div class="evtl">' + st.map((s, k) => {
    const last = k === st.length - 1;
    return (k ? '<span class="evar" style="animation-delay:' + (0.2 + k * 0.8 - 0.3).toFixed(1) + 's">➜</span>' : '') +
      '<span class="evn' + (last ? ' now' : '') + '" style="animation-delay:' + (0.2 + k * 0.8).toFixed(1) + 's">' +
      '<span class="evy">' + ago(s[1]) + '</span>' +
      '<b class="' + (last ? '' : 'nosay') + '">' + mark(k ? st[k - 1][0] : '', s[0]) + '</b>' +
      '<em>' + s[2] + '</em></span>';
  }).join('') + '</div>';
}

/* ② 大對比：以前一排、今天一排，一格一格對齊 */
function chart(r) {
  const toks = r.al.split(/\s+/).map(t => {
    const m = t.match(/^(.*?)([=>])(.*)$/); return { o: m[1], n: m[3], k: m[2] === '=' ? 's' : !m[1] ? 'a' : !m[3] ? 'd' : 'c' };
  });
  const top = toks.map((t, k) => '<span class="cl ' + t.k + '" style="animation-delay:' + (0.2 + k * 0.12).toFixed(2) + 's">' + (t.o ? esc(t.o) : '＋') + '</span>').join('');
  const bot = toks.map((t, k) => '<span class="cl ' + t.k + '" style="animation-delay:' + (1.3 + k * 0.28).toFixed(2) + 's">' + (t.n ? esc(t.n) : '✕') + '</span>').join('');
  return '<div class="evch"><span class="rl" style="animation-delay:.1s">' + ago(r.st[0][1]) + '</span><span class="rw nosay">' + top + '</span>' +
    '<span class="vs">VS</span>' +
    '<span class="rl now" style="animation-delay:1.2s">📱 今天</span><span class="rw">' + bot + '</span></div>' +
    '<div class="evkey"><span class="s">一樣</span><span class="c">換掉</span><span class="d">不見</span><span class="a">多出來</span></div>';
}
function chartLine(r) {
  const t = r.al.split(/\s+/).filter(x => !/=/.test(x)).map(x => x.replace('>', ' ➜ ').replace(/^ ➜ /, '＋ ').replace(/ ➜ $/, ' ✕'));
  return t.length ? '最大的不同：<b class="nosay">' + t.slice(0, 2).join('　') + '</b>' : '一模一樣！';
}

/* ③ 不唸的字母：先亮起來（以前唸），再變灰（今天不唸） */
function silent(r) {
  const c = r.c, parts = c.m.split(/(\[[^\]]+\])/).filter(Boolean);
  const w = parts.map(p => p[0] === '[' ? '<i class="evm">' + esc(p.slice(1, -1)) + '</i>' : esc(p)).join('');
  const word = c.m.replace(/[\[\]]/g, '');
  return '<div class="evsl"><span class="sp evw" data-say="' + word.replace(/’/g, "'") + '">' + w + '</span></div>' +
    '<div class="evtw"><span class="evb old" style="animation-delay:.6s"><i>🔊 以前</i>' + c.was.replace(/^以前\s*/, '') + '</span>' +
    '<span class="evb now" style="animation-delay:2.6s"><i>🤫 今天</i>' + c.lost.replace(/^今天\s*/, '') + '</span></div>' +
    (c.cmp ? '<div class="evcmp" style="animation-delay:3.4s">' + require('./_world').flag(c.cmp[2]) +
      ' <span class="sp" data-say="' + c.cmp[1] + '" data-lang="' + c.cmp[0] + '">' + c.cmp[1] + '</span><em>' + c.cmp[3] + '</em></div>' : '');
}

/* 出處：每一幕自己的證據（id ＝ 這一幕），每一幕的第一條配一個秒懂動畫 */
function stepsV(list) {
  return '<div class="ev">' + list.map((s, k) => (k ? '<span class="ar" style="animation-delay:' + (0.3 + k * 0.7).toFixed(1) + 's">➜</span>' : '') +
    '<span class="st" style="animation-delay:' + (0.2 + k * 0.7).toFixed(1) + 's"><b' + (k === list.length - 1 ? ' class="new"' : '') + '>' + esc(s[0]) + '</b><em>' + s[1] + '</em></span>').join('') + '</div>';
}
function srcRows(r) {
  const out = [];
  const add = (key, rows, v) => rows.forEach((x, k) => {
    const row = k === 0 && v ? ev(x.t, x.s, x.d, v) : Object.assign({}, x);
    out.push(k === 0 ? I('evo-' + key, row) : row);
  });
  add('a', r.src.a, stepsV(r.st.map(s => [s[0], ago(s[1])])));
  add('b', r.src.b, stepsV([[r.st[0][0], ago(r.st[0][1])], [r.st[r.st.length - 1][0], '📱 今天']]));
  add('c', r.src.c, r.c ? stepsV([[r.c.m.replace(/[\[\]]/g, ''), '🔊 以前會唸'], [r.c.m.replace(/\[([^\]]+)\]/g, '·'), '🤫 今天不唸']]) : '');
  return out;
}

/* (b) 的猜猜看：以前怎麼拼？——錯的選項用別的字「以前的拼法」（固定挑，每次 build 一樣） */
function qB(r, k) {
  const others = EVO.filter(x => x.w !== r.w && x.st[0][0] !== r.st[0][0]).map(x => x.st[0][0]);
  const o = [r.st[0][0]]; let j = (k * 7 + 3) % others.length;
  while (o.length < 4) { const x = others[j % others.length]; if (o.indexOf(x) < 0) o.push(x); j += 11 }
  return { q: '<b>' + (r.show || r.w) + '</b> ' + ago(r.st[0][1]).replace('⏳ ', '') + '怎麼拼？', o: o.map(x => '<span class="nosay">' + esc(x) + '</span>') };
}

function page(r, k, o) {
  const show = r.show || r.w, now = r.st[r.st.length - 1];
  const S = [
    { emoji: '⏳', mid: '<span class="evbig sp" data-say="' + show.replace(/’/g, "'") + '">' + esc(show) + '</span>',
      lines: ['坐上時光機，看 <b>' + esc(show) + '</b>（' + r.zh + '）<b>以前</b>長什麼樣子'] },
    { tag: '① 為什麼拼法變了？', q: r.a.q && { q: r.a.q, o: r.a.o }, src: 'evo-a', say: show,
      h: tunnel(r), lines: r.a.l },
    { tag: '② 以前 ↔ 今天', q: qB(r, k), src: 'evo-b', say: show,
      h: chart(r), lines: [chartLine(r)] },
    r.c ? { tag: '③ 以前會唸，今天不唸', q: { q: r.c.q, o: r.c.o }, src: 'evo-c', say: show, h: silent(r), lines: r.c.l }
        : { tag: '③ ' + r.fun.t, q: { q: r.fun.q, o: r.fun.o }, src: 'evo-c', say: show, h: r.fun.h, lines: r.fun.l },
    { emoji: '🧠', mid: '<span class="nosay evold">' + esc(r.st[0][0]) + '</span> <span class="evar2">➜</span> <span class="evbig2">' + esc(show) + '</span>',
      lines: [ago(r.st[0][1]) + ' ➜ 📱 今天', '記住故事，<b>拼字就記得住</b>'] }
  ];
  return Object.assign({}, o, {
    file: r.w + '-evo.html', title: show + ' 的時光機', topic: '⏳ 單字時光機', big: 1, css: CSS,
    srcRows: srcRows(r), S,
    fwd: { href: r.w + '.html', label: '🃏 回到字卡' }
  });
}

/* 把 list 這幾個字的時光機寫進 dir（home／whome／font 跟那一組單字一樣） */
function write(dir, words, o) {
  const out = [];
  words.forEach((w, k) => { const r = byW[w]; if (!r) return;
    fs.writeFileSync(path.join(dir, r.w + '-evo.html'), tpl(page(r, k, o)), 'utf8'); out.push(r.w + '-evo.html') });
  return out;
}
const has = w => !!byW[w];

const CSS = `
/* ⏳ 單字時光機（2026-09-28） */
.evbig{font-size:clamp(40px,min(13vh,9vw),128px);font-weight:700;color:#FFD24A;letter-spacing:.02em;line-height:1.1}
.evtl{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:clamp(6px,1vw,12px);max-width:100%}
.evn{display:flex;flex-direction:column;align-items:center;gap:3px;background:linear-gradient(180deg,#1C160C,#0E0B06);
 border:2px solid #5A4520;border-radius:18px;padding:clamp(6px,1.1vh,12px) clamp(10px,1.4vw,18px);
 opacity:0;animation:evIn .55s cubic-bezier(.2,1.4,.4,1) both}
.evn .evy{font-size:clamp(15px,2.3vh,22px);color:#E0B868;font-weight:700;white-space:nowrap}
.evn b{font-size:clamp(24px,min(5vh,4.6vw),48px);color:#F2E6C8;font-family:Georgia,"Times New Roman",serif;font-weight:700;line-height:1.15;white-space:nowrap}
.evn em{font-style:normal;font-size:clamp(14px,2vh,19px);color:#A89A7C;white-space:nowrap}
.evn.now{background:linear-gradient(180deg,#0B1D2A,#06121A);border-color:#3F8FC8;box-shadow:0 0 26px rgba(90,169,255,.35)}
.evn.now .evy{color:#8FD0FF}.evn.now b{color:#FFFFFF;font-family:inherit}.evn.now em{color:#8FB4CC}
.evc{font-style:normal;color:#FFD24A;text-shadow:0 0 12px rgba(255,210,74,.7)}
.evar{font-size:clamp(22px,3.4vh,34px);color:#6B7B88;opacity:0;animation:evIn .4s ease both}
.evch{display:grid;grid-template-columns:auto auto;align-items:center;justify-content:center;column-gap:clamp(10px,1.6vw,20px);row-gap:clamp(4px,.8vh,10px)}
.evch .rl{font-size:clamp(16px,2.5vh,24px);font-weight:700;color:#E0B868;white-space:nowrap;opacity:0;animation:evIn .4s ease both}
.evch .rl.now{color:#8FD0FF}
.evch .rw{display:flex;gap:clamp(4px,.6vw,8px)}
.evch .cl{min-width:1.3em;text-align:center;font-size:clamp(30px,min(6vh,5.6vw),56px);font-weight:700;border-radius:12px;
 padding:.06em .18em;border:2px solid;opacity:0;animation:evIn .45s cubic-bezier(.2,1.4,.4,1) both;white-space:nowrap}
.evch .cl.s{color:#7CF0B0;border-color:#1F6B45;background:#0B2217}
.evch .cl.c{color:#FFD24A;border-color:#7A5F12;background:#221A05}
.evch .cl.d{color:#FF7B7B;border-color:#7A2424;background:#240B0B}
.evch .cl.a{color:#8FD0FF;border-color:#24557A;background:#08182A}
.evch .rw.nosay .cl{font-family:Georgia,"Times New Roman",serif}
.evch .vs{grid-column:1/-1;justify-self:center;font-size:clamp(20px,3.2vh,32px);font-weight:700;color:#FF5A5A;letter-spacing:.2em;
 animation:evVs 1s ease-in-out 1s both}
@keyframes evVs{0%{opacity:0;transform:scale(2.2)}40%{opacity:1;transform:scale(.9)}70%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
.evkey{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;font-size:clamp(15px,2.2vh,21px);font-weight:700}
.evkey span{border-radius:99px;padding:2px 12px;border:2px solid}
.evkey .s{color:#7CF0B0;border-color:#1F6B45}.evkey .c{color:#FFD24A;border-color:#7A5F12}
.evkey .d{color:#FF7B7B;border-color:#7A2424}.evkey .a{color:#8FD0FF;border-color:#24557A}
.evsl{font-size:clamp(64px,min(13vh,14vw),128px);font-weight:700;line-height:1.1}
.evsl .evw{border-bottom:0}
.evm{font-style:normal;animation:evMute 3.2s ease-in-out .3s both}
@keyframes evMute{0%{color:#FFFFFF;text-shadow:0 0 30px #FFD24A}35%{color:#FFD24A;text-shadow:0 0 30px #FFD24A;transform:scale(1.2)}
 70%{color:#FFD24A;text-shadow:none}100%{color:#8C8C8C;text-shadow:none}}
.evm{display:inline-block}
.evtw{display:flex;flex-direction:column;gap:clamp(4px,.8vh,10px);align-items:center}
.evb{font-size:clamp(18px,2.9vh,28px);line-height:1.4;border-radius:14px;padding:4px 16px;opacity:0;animation:evIn .5s ease both}
.evb i{font-style:normal;font-weight:700;margin-right:.5em;padding:0 .4em;border-radius:8px}
.evb.old i{background:#5A4520;color:#FFE9B0}.evb.now i{background:#24557A;color:#E6F2FF}
.evb.old{background:#1C160C;border:1px solid #5A4520;color:#F2E6C8}
.evb.now{background:#0B1D2A;border:1px solid #3F8FC8;color:#E6F2FF}
.evcmp{display:flex;align-items:center;gap:10px;font-size:clamp(26px,4.6vh,44px);font-weight:700;color:#7CF0B0;opacity:0;animation:evIn .5s ease both}
.evcmp svg{height:1em;width:auto}
.evcmp em{font-style:normal;font-size:.55em;color:#A8B8C4}
.evsp{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:clamp(8px,1.4vw,18px)}
.evsp .two,.evsp .c1{display:flex;flex-direction:column;align-items:center;gap:2px;background:#0C0C0C;border:2px solid #2E2E2E;border-radius:16px;
 padding:clamp(6px,1vh,12px) clamp(12px,1.6vw,20px);opacity:0;animation:evIn .5s cubic-bezier(.2,1.4,.4,1) both}
.evsp .two:nth-child(2){animation-delay:.5s}.evsp .two:nth-child(3){animation-delay:1s}.evsp .two:nth-child(4){animation-delay:1.5s}.evsp .two:nth-child(5){animation-delay:2s}
.evsp .two b,.evsp .c1{font-size:clamp(28px,min(5.4vh,5.2vw),50px);font-weight:700;color:#F2F2F2}
.evsp .two em,.evsp .c1 em{font-style:normal;font-size:clamp(15px,2.2vh,21px);color:#A8B8C4;font-weight:400}
.evsp .ar{font-size:clamp(22px,3.4vh,34px);color:#6B7B88}
.evr{font-style:normal;color:#FFD24A}
.evno{font-style:normal;color:#FF7B7B}
.evold{font-family:Georgia,"Times New Roman",serif;font-size:clamp(34px,6vh,58px);color:#E0B868}
.evar2{font-size:clamp(28px,4.6vh,44px);color:#6B7B88}
.evbig2{font-size:clamp(40px,7.4vh,72px);color:#FFFFFF;font-weight:700}
@keyframes evIn{0%{opacity:0;transform:translateY(12px) scale(.85)}100%{opacity:1;transform:none}}
.reduce .evn,.reduce .evar,.reduce .evch *,.reduce .evb,.reduce .evcmp,.reduce .evsp *{animation:none!important;opacity:1!important}
.reduce .evm{animation:none!important;color:#8C8C8C}`;

module.exports = { write, has, byW, page };
