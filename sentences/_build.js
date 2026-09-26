/* sentences/_build.js — 一次重建整個句型網站
 * node sentences/_build.js
 */
['_build_home', '_build_cards', '_build_quiz', '_build_games', '_build_world'].forEach(m => require('./' + m));   /* _build_world：2026-09-26 句型環遊世界 */
