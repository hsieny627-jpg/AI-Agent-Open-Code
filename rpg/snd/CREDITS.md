# 🐾 寵物 叫聲 的 錄音（出處、授權）— 2026-10-20 第十五次

全部 來自 Wikimedia Commons，授權 都是 **公有領域（Public domain）或 CC0**：可以 自由 使用、不用 署名（這裡 還是 寫清楚 出處）。
轉檔：`ffmpeg` 剪 最大聲 的 1～3 秒、淡入淡出、音量 統一（-16 LUFS）、mp3 96 kbps。

| 檔案 | 用在 | 原始檔 | 授權 |
|---|---|---|---|
| wolf.mp3 | 狼：Frost Wolf p13、Armored Cyber Wolf p16（放慢）、Obsidian Cyber Wolf s0816 | https://commons.wikimedia.org/wiki/File:Wolf_howls.ogg | Public domain |
| bear.mp3 | 熊：Obsidian Armor Bear p27 | https://commons.wikimedia.org/wiki/File:Yellowstone_sound_library_-_Grizzly_Bear_vocalizations_-_001.mp3（美國 黃石國家公園 錄音） | Public domain（美國 政府 作品） |
| hawk.mp3 | 猛禽：Wind Speed Raptor p28 | https://commons.wikimedia.org/wiki/File:Yellowstone_sound_library_-_Bald_Eagle_-_001.mp3（黃石國家公園 白頭海鵰） | Public domain（美國 政府 作品） |
| cat.mp3 | 貓：Shadow Kitten p08 | https://commons.wikimedia.org/wiki/File:Meow_of_a_pleading_cat.oga | Public domain |
| kitten.mp3 | 小貓：Fortune Cat p14 | https://commons.wikimedia.org/wiki/File:Maullido_de_gata_hembra_joven.ogg | CC0 |

**還沒有 錄音、暫時 用 電腦 做 的 相近 叫聲**（Wikimedia 這幾天 一直 擋 下載：429 Too Many Requests）：
狗（p03）、狐狸（p02 p26 s0801 s0814）、貓頭鷹（p09）、熊貓（p07）、鹿（p15 s0809）、老虎（p17 s0812）、豹（p22）、獅子（p29 s0810）、蛇（p25）、牛（p30）。
找到 公有領域／CC0 的 錄音 ➜ 存成 `rpg/snd/名字.mp3`（名字 照 `rpg/_petsnd.js`）、這裡 加一列 ➜ `node rpg/_build.js` 自動 換成 錄音。
候選（已經 查到 是 公有領域，還沒 下載 成功）：熊貓 https://commons.wikimedia.org/wiki/File:Giant_panda_twittering.ogg
