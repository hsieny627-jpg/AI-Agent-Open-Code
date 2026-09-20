/* sentences/_build.js — 一次重建整個句型網站
 * node sentences/_build.js
 */
['_build_home', '_build_cards', '_build_quiz', '_build_games'].forEach(m => require('./' + m));
