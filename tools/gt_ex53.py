# tools/gt_ex53.py — 2026-11-14 第五十三次（老師 第五十二次 第 6 點：成長測驗 字母 聽寫 的 音檔 可以 100% 用 老師 給 的）
#   從 老師 給 的 113、114 年 聽力 錄音（原始 檔 在 老師 Google 雲端硬碟，見 ref/README.md 01、02）剪 出 字母（每 個 字母 錄音 裡 唸 3 次，取 第 1 次）
#   時間 ＝ 雲端 電腦 聽寫（Whisper）找 的；F／S 用 聲音 頻率 分（F 高頻 0.19、S 0.7）。錄音 裡 沒有 的 i、o、w 繼續 用 網站 的 語音。
#   輸出 g3mid/audio/ex/<字母>.mp3（音量 一致、前後 留 0.12 秒、淡入 淡出）
# 用法：python3 tools/gt_ex53.py <113.mp3> <114.mp3>
import sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
SR = 22050; OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'g3mid', 'audio', 'ex'); os.makedirs(OUT, exist_ok=True)
A113 = {'a': 12.35, 'z': 48.10, 'e': 68.35, 'c': 87.50, 'h': 107.55, 'j': 126.90, 'k': 147.05, 'x': 166.75, 'm': 186.25, 'p': 205.65, 'q': 224.95,
        't': 245.50, 'r': 265.35, 'g': 293.65, 'v': 314.10, 'b': 333.90}
A114 = {'n': 144.70, 'f': 243.90, 's': 282.95, 'y': 302.30, 'u': 322.15, 'd': 342.20, 'l': 391.10}
def load(src, a):
    b = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(a - 0.5), '-t', '2.2', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy()
def cut(y):
    w = int(SR * 0.01); e = np.array([np.sqrt(np.mean(y[i:i + w] ** 2)) for i in range(0, len(y) - w, w)])
    pk = int(np.argmax(e)); th = 0.06 * e[pk]; a = pk; b = pk
    while a > 0 and (e[max(0, a - 18):a] > th).any(): a -= 1
    while b < len(e) - 1 and (e[b + 1:b + 19] > th).any(): b += 1   # 中間 停 0.18 秒 以內 也 接 上（H ＝ ay…ch、X ＝ e…ks）
    z = y[max(0, a * w - int(SR * 0.12)):min(len(y), (b + 1) * w + int(SR * 0.12))].copy()
    n = int(SR * 0.03); z[:n] *= np.linspace(0, 1, n); m = int(SR * 0.06); z[-m:] *= np.linspace(1, 0, m)
    zz = z[np.abs(z) > 0.05 * np.abs(z).max()]; z = z / (np.sqrt(np.mean(zz ** 2)) + 1e-9) * 0.09
    return np.clip(z, -0.98, 0.98)
if __name__ == '__main__':
    for src, M in ((sys.argv[1], A113), (sys.argv[2], A114)):
        for c, a in M.items():
            z = cut(load(src, a)); T.mp3(z, SR, os.path.join(OUT, c + '.mp3')); print(c, round(len(z) / SR, 2), end='  ')
    print()
