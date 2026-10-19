/* live/_common.js — ⚡ 現場任務：老師大螢幕（host.html）和學生平板（index.html）共用的東西。只寫 ES5。
   2026-10-18 第十一次（老師試用以後，需求檔 sentences/2026-10-16_C_需求與問題.md 第四節最下面「第十一次」）：
   ① **🏆 經典搶答 放第一個**（像 Kahoot：四個顏色＋形狀、答得愈快分數愈高、連對加分、每題公布長條圖＋前 5 名、最後頒獎台）；
      **🔥 挑戰題 分數 ✖2**：🔤 拼字（點大字母方塊）、🧩 排句子（點字卡）
   ② 另外 10 種「最好玩、最刺激、最精緻、最有新意、有正向教育啟發」重做：學生自己的英雄圖上場、會動的場景、全班合作／兩隊對抗／個人挑戰
   ③ 不用打遊戲號碼：每一班固定一個遊戲（0＋班級，例 402 班 ＝ 0402），學生登入 5 碼就自動進去；老師一鍵 QR Code
   ④ 每一種遊戲、登入方式都有 3 步「怎麼玩」動畫（HOW、LOGIN）
   ⑤ 老師 說 舊的 那個 詞 不好（有 不好 的 聯想）➜ 一律 寫「建立 遊戲」「結束 這一場」，畫面 上 不出現「房間」
   干擾（只有 10 種玩法有，經典搶答 沒有）：全部系統自動、不扣分、≦ 3 秒、沒有一種是學生自己挑人；每人每場最多 2 次；演完送 🛡；老師可以一鍵關掉 */
var LV={
  GAMES:[
    {k:'classic',ic:'🏆',c1:'#7B3FE4',c2:'#E0389A',nm:'經典 搶答',d:'跟 Kahoot 一樣：看 大螢幕，點 平板 上 同樣 顏色 的 按鈕；答得 愈快 分數 愈高；🔥 挑戰題 ✖2',
      how:[['📺','看 大螢幕 的 題目'],['<span class="k4"><i class="c0"></i><i class="c1"></i><i class="c2"></i><i class="c3"></i></span>','點 平板 上 同樣 顏色＋形狀 的 按鈕'],['⚡','答對 ＋ 答得 快 ＝ 分數 高；🔥 挑戰題 分數 ✖2']]},
    {k:'boss',ic:'⚔️',c1:'#B71C1C',c2:'#FF6F00',nm:'全班 討伐 魔王',d:'全班 合作：答對 ＝ 你的 戰士 出招；全班 答對 8 成 ＝ 連擊 ✖1.5',
      how:[['🦸','答對 ＝ 你的 戰士 飛過去 出招'],['💥','裝備 愈強 ➜ 一擊 愈猛（10～30）'],['🤝','全班 答對 8 成 ＝ 全班 連擊 ✖1.5']],
      fx:{k:'roar',all:1,ic:'🐲',t:'魔王 怒吼！畫面 震動 一下',ms:1600}},
    {k:'race',ic:'🏎',c1:'#0D47A1',c2:'#00B8D4',nm:'極速 賽車',d:'個人 賽：答對 ＝ 往前 衝，愈快 衝 愈遠；連對 3 題 ＝ 🔥 氮氣 加速',
      how:[['🏎','你的 戰士 開 一台 賽車'],['⚡','答對 ＋ 答得 快 ＝ 衝 愈遠'],['🔥','連對 3 題 ＝ 氮氣 加速，超車！']],
      fx:{k:'smoke',ic:'💨',t:'前面 的 車 噴出 煙霧！1.5 秒 就 散',ms:1500}},
    {k:'tug',ic:'🪢',c1:'#1565C0',c2:'#C62828',nm:'拔河 大對決',d:'單號隊 vs 雙號隊：每一題 看 哪一隊 答對 的 比例 高，繩子 就 往 那邊 拉',
      how:[['🔵🔴','單號 一隊、雙號 一隊'],['📊','看 答對 的「比例」：人少 的 隊 也 公平'],['🪢','答對 比例 高 ＝ 繩子 拉 過來！']],
      fx:{k:'yank',ic:'🪢',t:'對手 猛 一拉！畫面 晃 一下',ms:1500}},
    {k:'map',ic:'🏰',c1:'#1B5E20',c2:'#FBC02D',nm:'領土 爭奪戰',d:'兩隊：答對 ＝ 搶 一塊地；地 搶光了 就 搶 對方 的；最後 地 多 的 隊 贏',
      how:[['🗺','40 塊 土地，一開始 沒有 人'],['✅','每一題 答對 的 比例 ＝ 搶到 幾塊（最多 4）'],['⚔️','搶光了 ➜ 搶 對方 的 地！']],
      fx:{k:'fog',ic:'🌫',t:'戰爭 迷霧！2 秒 就 散',ms:2000}},
    {k:'tower',ic:'🏔',c1:'#37474F',c2:'#4FC3F7',nm:'攻頂 挑戰',d:'個人 賽：答對 一題 ＝ 往上 爬 一段；經過 兩個 營地，看 誰 先 登頂',
      how:[['🧗','你的 戰士 從 山腳 出發'],['⛺','答對 ＝ 往上 爬；經過 營地 1、營地 2'],['🚩','答對 最多 ＝ 插旗 登頂！']],
      fx:{k:'snow',ic:'❄️',t:'暴風雪！2 秒 就 停',ms:2000}},
    {k:'pet',ic:'🥚',c1:'#4A148C',c2:'#FFD54A',nm:'全班 孵化 傳說寵物',d:'全班 合作：答對 愈多，龍蛋 裂 愈開 ➜ 孵出 傳說寵物 ➜ 再 長大 進化',
      how:[['🥚','全班 一顆 傳說 龍蛋'],['⚡','每一個人 答對 ＝ 灌 一點 能量'],['🐉','能量 滿 ➜ 孵出來、長大、進化！']],
      fx:{k:'pat',ic:'🥚',t:'龍蛋 在 動！點 3 下 安撫 它',ms:3000}},
    {k:'shoot',ic:'🎯',c1:'#880E4F',c2:'#FF5252',nm:'神射手',d:'個人 賽：答對 ＝ 射 一箭；答得 愈快 愈 靠近 紅心（紅心 ＝ 10 分 環）',
      how:[['🏹','答對 ＝ 射 一箭'],['⚡','答得 愈快 ＝ 愈 靠近 紅心'],['🎯','看 誰 正中 紅心 最多 次！']],
      fx:{k:'gust',ic:'🌬',t:'強風！答案 飄 一下',ms:2000}},
    {k:'treasure',ic:'🗝',c1:'#3E2723',c2:'#FFB300',nm:'全班 尋寶 探險',d:'全班 合作：答對 愈多 走 愈遠，打開 一路上 的 寶箱（裡面 是 商城 的 寶物 圖）',
      how:[['🗺','全班 一起 走 尋寶 地圖'],['✅','全班 答對 愈多 ＝ 走 愈遠'],['🎁','走到 寶箱 ＝ 打開，看 裡面 是 什麼 寶物！']],
      fx:{k:'lock',ic:'🔐',t:'寶箱 機關！答對 這一題 ＝ 多 ＋50',ms:2000}},
    {k:'surf',ic:'🌊',c1:'#01579B',c2:'#26C6DA',nm:'連勝 衝浪',d:'個人 賽：連對 愈多，浪 衝 愈高；答錯 也 沒關係，從 浪底 再 衝 上來',
      how:[['🏄','你的 戰士 站上 衝浪板'],['🔥','連對 愈多 ＝ 浪 愈高'],['🏆','看 誰 連勝 最長！']],
      fx:{k:'wave',all:1,ic:'🌊',t:'大浪 來了！全部 抓穩，答對 ＋50',ms:2000}},
    {k:'king',ic:'👑',c1:'#F57F17',c2:'#FFEB3B',nm:'王者 擂台',d:'前 3 名 站上 擂台；台下 答得 最快 的 ＝ 👊 挑戰者；台下 可以 按 📣 幫 台上 加油',
      how:[['👑','分數 前 3 名 ＝ 站上 擂台'],['👊','台下 答對 又 最快 ＝ 這一題 的 挑戰者'],['📣','台下 可以 幫 台上 加油（不扣分）']],
      fx:{k:'cheer',ic:'📣',t:'台下 可以 按 📣 幫 台上 加油！',ms:0}}],
  /* 學生 登入 方式（3 步動畫：大螢幕 等人 的 時候、學生 平板 第一頁） */
  LOGIN:[['📱','掃 QR Code'],['🔢','打 5 碼（班級 ＋ 座號）'],['✅','自動 進入 自己 班 的 遊戲']],
  /* QR Code（score/qr.js）：學生 平板 的 網址（大螢幕、老師看板、平板 右下角 都 用 這一個） */
  stuURL:function(){var u=String(location.href).split('#')[0].split('?')[0];return u.replace(/(host|index)\.html$/,'')},
  qr:function(u){try{var q=qrcode(0,'M');q.addData(u||LV.stuURL());q.make();return q.createSvgTag({cellSize:8,margin:2,scalable:true})}catch(e){return ''}},
  /* 步驟條（2026-10-19 第十三次 3(9)：秒懂 現在 做 什麼、等一下 做 什麼）：steps ＝ [[圖示, 字]…]，k ＝ 現在 第幾步 */
  stepsHTML:function(steps,k){return '<div class="stps">'+steps.map(function(s,i){return (i?'<b class="sar">➜</b>':'')+'<span class="stp'+(i<k?' done':i===k?' now':'')+'"><i>'+(i<k?'✔':s[0])+'</i><em>'+s[1]+'</em></span>'}).join('')+'</div>'},
  /* 四個 答案：顏色 ＋ 形狀（色弱 也 分得出來） */
  SHAPE:['<svg viewBox="0 0 40 40"><path d="M20 5L37 34H3Z" fill="#fff"/></svg>','<svg viewBox="0 0 40 40"><path d="M20 3L37 20L20 37L3 20Z" fill="#fff"/></svg>',
         '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#fff"/></svg>','<svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="3" fill="#fff"/></svg>'],
  /* 🎮 遊戲功能（10 種）：f ＝ 生效時送給老師大螢幕的記號（算分用）、n ＝ 接下來幾題 */
  FEAT:[
    {k:'pause',ic:'⏸',nm:'時間暫停',t:'下一題 多 5 秒',say:'時間 停止！',n:1},
    {k:'x2',ic:'✖2',nm:'分數兩倍',t:'接下來 3 題 分數 ✖2',say:'力量 加倍！',n:3},
    {k:'cut',ic:'✂',nm:'刪掉 2 個',t:'下一題 刪掉 2 個 錯的 答案',say:'看我的 劍！',n:1},
    {k:'zoom',ic:'🔍',nm:'題目放大',t:'接下來 3 題 題目 放大',say:'看清楚 一點！',n:3},
    {k:'shield',ic:'🛡',nm:'護盾',t:'下一次 答錯 不算 斷連對',say:'防護罩 開啟！',n:1},
    {k:'hint',ic:'💡',nm:'寵物提示',t:'下一題 寵物 給你 提示',say:'我來 幫你！',n:1},
    {k:'retry',ic:'🔁',nm:'雙重 機會',t:'下一題 可以 選 2 個 答案（對 一個 就算，分數 一半）',say:'給我 兩次 機會！',n:1},
    {k:'fire',ic:'🔥',nm:'超級連擊',t:'接下來 3 題 分數 ✖1.5',say:'火力 全開！',n:3},
    {k:'rocket',ic:'🚀',nm:'加速衝刺',t:'接下來 3 題 分數 ✖1.3',say:'衝 啊！',n:3},
    {k:'cheer',ic:'🎆',nm:'全班加油',t:'全班 一起 ＋（魔王 多扣 50 血、全班 遊戲 多 一點 能量）',say:'大家 一起 加油！',n:1}],
  /* 🎁 獎勵（10 種）：遊戲結束 老師大螢幕 一次 發（要老師密碼，送到成績系統的「角色」：平板改不了） */
  RW:[
    {k:'c2',ic:'🪙',nm:'金幣 ✖2',t:'這一場 拿到的 金幣 再多 一倍'},
    {k:'x2',ic:'⭐',nm:'經驗值 ✖2',t:'這一場 拿到的 經驗值 再多 一倍'},
    {k:'frag',ic:'💎',nm:'寶物碎片',t:'💎 一個 碎片 ＝ 20 金幣'},
    {k:'title',ic:'🏷',nm:'限定稱號',t:'拿到 稱號「⚡ 現場任務 勇者」'},
    {k:'emo',ic:'😎',nm:'戰士表情',t:'送你 寶物「😎 戰士表情」（有了 ＝ 40 金幣）'},
    {k:'fx',ic:'✨',nm:'登場特效',t:'送你 寶物「🎆 登場煙火」（有了 ＝ 40 金幣）'},
    {k:'snack',ic:'🍖',nm:'寵物零食',t:'寵物 多陪你 1 天（長大 快一點）'},
    {k:'medal',ic:'🏅',nm:'勳章',t:'戰神之路 多一個 🏅 勳章'},
    {k:'box',ic:'🎁',nm:'小寶箱',t:'打開 ＝ 30 金幣'},
    {k:'fw',ic:'🎇',nm:'大螢幕放煙火',t:'遊戲 結束 大螢幕 放你的 戰士 和 煙火（不放 名字）'}],
  /* 二～五選一的機率 */
  pickN:function(){var r=Math.random();return r<.4?2:r<.7?3:r<.9?4:5},
  shuf:function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a},
  game:function(k){for(var i=0;i<LV.GAMES.length;i++)if(LV.GAMES[i].k===k)return LV.GAMES[i];return LV.GAMES[0]},
  feat:function(k){for(var i=0;i<LV.FEAT.length;i++)if(LV.FEAT[i].k===k)return LV.FEAT[i];return null},
  img:function(base,id){return !id?'':base+'rpg/'+(/^s\d{4}$/.test(id)?'shop/'+id+'.jpg':(/^[bg]/.test(id)?'chars':/^w/.test(id)?'weapons':'pets')+'/'+id+'.jpg')},   /* s ＝ 🏪 商城的魔法武器、新寵物（2026-10-18） */
  /* 每一班 固定 一個 遊戲：0 ＋ 班級（402 ➜ 0402）。學生 登入 5 碼 就 知道 是 哪一個，不用 打 號碼 */
  room:function(cls){return '0'+String(cls).slice(0,3)},
  /* 遊戲 圖示：漸層 圓角 徽章（不是 只有 一個 emoji） */
  badge:function(k,cls){var g=LV.game(k);return '<span class="badge '+(cls||'')+'" style="--c1:'+g.c1+';--c2:'+g.c2+'"><span>'+g.ic+'</span></span>'},
  /* 「怎麼玩」3 步（2026-10-18 第十二次 老師 5：眼花撩亂、箭頭 轉來轉去 ➜ 不動 的、大大 的 編號 ① ② ③，一步 一行） */
  howHTML:function(steps,cls){return '<ol class="how '+(cls||'')+'">'+steps.map(function(s,i){return '<li class="hw"><b class="hn">'+(i+1)+'</b><span class="hi">'+s[0]+'</span><span class="ht">'+s[1]+'</span></li>'}).join('')+'</ol>'},
  /* 算分（老師大螢幕）：答對 100 ＋ 速度（最多 900）；連對 第 2 題起 ＋50、＋100…（最多 ＋250）；✖2、🔥 ✖1.5、🚀 ✖1.3；🔥 挑戰題 ✖2；🔁 再選一次答對 ＝ 一半 */
  score:function(ok,ms,dur,f,st){if(!ok)return 0;f=f||{};var s=100+Math.round(900*Math.max(0,1-ms/dur));if(st>1)s+=Math.min(250,50*(st-1));
    if(f.x2)s*=2;if(f.fire)s=Math.round(s*1.5);if(f.rocket)s=Math.round(s*1.3);if(f.chal)s*=2;if(f.rt)s=Math.round(s/2);return s},
  /* 拼字、排句子 對不對（不分大小寫、’ ＝ '、多的空白不算） */
  norm:function(s){return String(s||'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim().toLowerCase()},
  MAXFX:2, DUR:20000, DURCH:30000,
  /* ── 2026-10-18 第十二次：錯題分析（老師 8(7)：比照 遊戲 的 答錯頁，更 嚴謹 用心）── */
  ICON:{},
  ic:function(h){return String(h==null?'':h).replace(/§i:([^§]+)§/g,function(m,k){return LV.ICON[k]||''})},
  esc:function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')},
  /* 正確答案：每一個 英文 字 正下方 ＝ 它的 中文（ag）、整句 翻譯（az）。
     2026-10-19 第十三次 3(6)：最後 一行「💡 為什麼」刪掉（老師：看起來 像 廢話）；改成 動畫：字 一個一個 跳出來、中文 跟著 亮 */
  glHTML:function(r,big){var ag=r.ag||[],h='';
    if(ag.length)h='<div class="gls ani'+(big?' big':'')+'">'+ag.map(function(x,i){var p=/^[?.!,]$/.test(x[0]);return '<span class="gw'+(p?' gp':'')+'" data-gi="'+i+'" style="--i:'+i+'"><b>'+LV.esc(x[0])+'</b><i>'+LV.esc(x[1]||'')+'</i></span>'}).join('')+'</div>';
    else h='<div class="gls'+(big?' big':'')+'"><span class="gw"><b>'+LV.esc(r.ans||'')+'</b></span></div>';
    var z=r.az&&LV.norm(r.az)!==LV.norm(r.ae)&&!(ag.length===1&&ag[0][1]===r.az)?'<div class="glz">📖 整句：'+LV.esc(r.az)+'</div>':'';
    return h+z},
  /* 你選的 vs 正確 答案：逐字 比對（最長 共同 子序列），沒 對上 的 字 紅框（跟 遊戲 答錯頁 mDiff 一樣 的 作法） */
  diffHTML:function(you,ok){var A=String(you||'').split(/\s+/).filter(Boolean),B=String(ok||'').split(/\s+/).filter(Boolean),n=A.length,m=B.length,D=[],i,j;
    for(i=0;i<=n;i++){D.push([]);for(j=0;j<=m;j++)D[i].push(0)}
    for(i=n-1;i>=0;i--)for(j=m-1;j>=0;j--)D[i][j]=LV.norm(A[i])===LV.norm(B[j])?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
    var keep={};i=0;j=0;while(i<n&&j<m){if(LV.norm(A[i])===LV.norm(B[j])){keep[i]=1;i++;j++}else if(D[i+1][j]>=D[i][j+1])i++;else j++}
    return A.map(function(w,k){return keep[k]?LV.esc(w):'<s class="dx">'+LV.esc(w)+'</s>'}).join(' ')},
  /* 發音：預錄 的 美式 語音檔（au）；沒有 ＝ 瀏覽器 英文 語音。n 次、中間 停 0.8 秒；hl(第幾個字) ＝ 唸到 哪 亮到 哪（照 時間 估） */
  AE:null,
  stopSay:function(){try{if(LV.AE){LV.AE.pause();LV.AE.onended=null}speechSynthesis&&speechSynthesis.cancel()}catch(e){}clearTimeout(LV.ST)},
  say:function(src,text,n,done){LV.stopSay();n=n||1;var k=0;
    function one(){if(k>=n){if(done)done();return}k++;
      var next=function(){LV.ST=setTimeout(one,800)};
      if(src){try{LV.AE=LV.AE||new Audio();LV.AE.src=src;LV.AE.onended=next;var pr=LV.AE.play();if(pr&&pr.catch)pr.catch(function(){tts(next)});return}catch(e){}}
      tts(next)}
    function tts(next){try{var u=new SpeechSynthesisUtterance(String(text||'').replace(/[＿_]+/g,' '));u.lang='en-US';u.rate=.9;u.onend=next;speechSynthesis.speak(u)}catch(e){next()}}
    one()}
};
