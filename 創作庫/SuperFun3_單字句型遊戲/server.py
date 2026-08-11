# -*- coding: utf-8 -*-
"""一鍵啟動：把遊戲變成學生掃 QR code 就能玩的網頁伺服器"""
import sys, os, socket, webbrowser
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
PORT = 8000

def get_lan_ip():
    """找出電腦在區域網路(Wi-Fi)的 IP"""
    for target in ("8.8.8.8", "1.1.1.1"):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect((target, 80))
            ip = s.getsockname()[0]
            s.close()
            if ip and not ip.startswith("127."):
                return ip
        except Exception:
            pass
    return socket.gethostbyname(socket.gethostname())

def make_qr(url, out_path):
    try:
        import qrcode
        img = qrcode.make(url)
        img.save(out_path)
        return True
    except Exception as e:
        print("QR 產生失敗：", e)
        return False

def main():
    ip = get_lan_ip()
    url = "http://%s:%d/" % (ip, PORT)

    # 每次都重新產生 QR code（IP 如果變了，圖也會自動更新）
    qr_path = os.path.join(HERE, "QR_code.png")
    make_qr(url, qr_path)

    os.chdir(HERE)
    from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

    print("=" * 55)
    print("  Super Fun 3 英語遊戲伺服器 已啟動！")
    print("=" * 55)
    print("  給學生掃描的 QR code 圖：")
    print("    " + qr_path)
    print("  網址：", url)
    print("  （學生 iPad 連同一個 Wi-Fi，掃 QR 即可玩）")
    print("  要停止：直接關閉這個視窗即可")
    print("=" * 55)
    ThreadingHTTPServer(("0.0.0.0", PORT), SimpleHTTPRequestHandler).serve_forever()

if __name__ == "__main__":
    try:
        main()
    except OSError as e:
        print("啟動失敗：", e)
        print("可能是 8000 埠被佔用，請關閉其他程式後重試。")
        input("按 Enter 結束...")
    except KeyboardInterrupt:
        print("\n已停止。")
