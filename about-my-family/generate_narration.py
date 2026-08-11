# 用 Edge-TTS 生成 About My Family 旁白（12 頁，每頁 中講解+英示範 合成一檔）
# 執行：python generate_narration.py
import asyncio
import os
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

BASE = Path(__file__).parent
OUT = BASE / "assets" / "narration"
OUT.mkdir(parents=True, exist_ok=True)

ZH_VOICE = "zh-TW-HsiaoChenNeural"
EN_VOICE = "en-US-JennyNeural"
ZH_RATE = "-8%"
EN_RATE = "-6%"
ZH_PITCH = "+2Hz"


def find_ffmpeg():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    base = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages"
    for p in sorted(base.glob("**/ffmpeg.exe"), key=lambda x: -len(str(x))):
        os.environ["PATH"] = str(p.parent) + os.pathsep + os.environ["PATH"]
        return str(p)
    raise SystemExit("找不到 ffmpeg")


FFMPEG = find_ffmpeg()

# (頁, 中文講解, 英文示範 or None)
SCRIPT = [
    (1, "你認識自己所有的家人嗎？如果用英文，你要怎麼介紹他們？今天四分鐘，我們一起學會！", None),
    (2, "先學家人單字。爸爸，father，也可以叫 dad。媽媽，mother，也叫 mom。哥哥弟弟，brother。姊姊妹妹，sister。爺爺，grandfather。奶奶，grandmother。也可以叫 grandpa 和 grandma。",
     "father, mother, brother, sister, grandpa, grandma."),
    (3, "再學職業。老師，teacher。學生，student。醫生，doctor。護士，nurse。農夫，farmer。廚師，cook。",
     "teacher, student, doctor, nurse, farmer, cook."),
    (4, "想知道他是誰，用 Who's he？他是我爸爸。問女生，用 Who's she？她是我媽媽。",
     "Who's he? He's my dad. Who's she? She's my mother."),
    (5, "猜猜他的職業，用 Is he a doctor？他是醫生嗎？是的話說，Yes, he is。不是的話說，No, he isn't. He's a nurse。",
     "Is he a doctor? Yes, he is. No, he isn't. He's a nurse."),
    (6, "記住兩個小原則：男生用 he，女生用 she。He's，是 he is 的縮寫。",
     "He's. She's. He is."),
    (7, "現在，把它變成一篇小作文，About My Family。第一句，This is my。這是我的誰。第二句，He's，或是 She's。他的職業。再來，He likes。他喜歡什麼。還有，I like。我喜歡什麼。空格可以從單字牆裡選。",
     "This is my. He's a. She's a. He likes. I like."),
    (8, "看一個範例。My name is Kim。這是我弟弟。他是學生。他喜歡藍色，但是我喜歡黃色。",
     "My name is Kim. This is my brother. He's a student. He likes blue, but I like yellow."),
    (9, "換你試試看。他是誰？他是我爸爸。猜猜看他的職業，他是農夫嗎？不，他不是。他是老師。",
     "Who's he? He's my father. Is he a farmer? No, he isn't. He's a teacher."),
    (10, "再試一個。她是護士嗎？是的，她是。她是我媽媽，也是一位老師。",
     "Is she a nurse? Yes, she is."),
    (11, "今天學了三件事：家人單字、職業單字、還有 Who's he 和 Who's she 的問句。帶走一句話。",
     "This is my family!"),
    (12, "回家任務：用今天學的句子，用英文跟爸爸媽媽介紹你的家人。試試看，你一定可以！", None),
]


async def synth(text, voice, rate, path, pitch=None):
    kwargs = dict(rate=rate)
    if pitch:
        kwargs["pitch"] = pitch
    c = edge_tts.Communicate(text, voice, **kwargs)
    await c.save(str(path))


async def make_page(i, zh, en):
    zh_path = OUT / f"page-{i:02d}-zh.mp3"
    en_path = OUT / f"page-{i:02d}-en.mp3"
    final = OUT / f"page-{i:02d}.mp3"

    for attempt in range(3):
        try:
            await synth(zh, ZH_VOICE, ZH_RATE, zh_path, ZH_PITCH)
            break
        except Exception as e:
            print(f"  zh retry {i} ({attempt+1}): {e}")
            await asyncio.sleep(2)

    if en:
        for attempt in range(3):
            try:
                await synth(en, EN_VOICE, EN_RATE, en_path)
                break
            except Exception as e:
                print(f"  en retry {i} ({attempt+1}): {e}")
                await asyncio.sleep(2)

    if en and en_path.exists():
        # 在純英文檔名目錄內合成（GOTCHAS E-3：避免中文路徑）
        cmd = [FFMPEG, "-y",
               "-i", f"page-{i:02d}-zh.mp3",
               "-i", f"page-{i:02d}-en.mp3",
               "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1",
               "-c:a", "libmp3lame", "-q:a", "2", f"page-{i:02d}.mp3"]
        subprocess.run(cmd, cwd=OUT, check=True)
        en_path.unlink(missing_ok=True)
    else:
        zh_path.rename(final)
    print(f"OK page-{i:02d}.mp3")


async def main():
    for i, zh, en in SCRIPT:
        await make_page(i, zh, en)
    print("All done.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    asyncio.run(main())
