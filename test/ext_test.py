import asyncio
import csv
import os
import pandas as pd
import winsound

from playwright.async_api import async_playwright, ConsoleMessage, Error

path_to_extension = os.path.join(os.getcwd(), "../ext")  # 拡張機能のパス

url_set = set()


async def main() -> None:
    async with async_playwright() as playwright:
        # ブラウザを起動
        context = await playwright.chromium.launch_persistent_context(
            user_data_dir=os.path.join(os.getcwd(), "tmp/playwright"),
            channel="chrome",
            headless=False,
            args=[
                f"--disable-extensions-except={path_to_extension}",
                f"--load-extension={path_to_extension}",
                "--disable-blink-features=AutomationControlled"
            ],
            ignore_https_errors=True,
            java_script_enabled=True,
            locale="ja"
        )

        with open("result.csv", "w") as f:
            f.write(f"TrancoRank,TrancoURL,LoginURL,検出理由,検出時間(sec)\n")

        # 2023/11/09 15:10に取得した日本の上位100件のリスト
        with open("list.csv") as f:
            reader = csv.reader(f)
            for line in reader:
                # URLが空ならアクセスしない
                if line[2] == "":
                    continue

                # 確認済みならアクセスしない
                if line[2] in url_set:
                    with open("result.csv", "a") as f2:
                        f2.write(f"{line[0]},{line[1]},{line[2]},,\n")
                    continue

                # 確認済みURLに現在のURLを追加
                url_set.add(line[2])

                page = await context.new_page()

                # consoleの出力イベント発生時に、検出理由と検出時間を読み取って保存するイベントハンドラを追加
                page.on("console", lambda msg: save_result(line[0], line[1], line[2], msg))

                try:
                    await page.goto(line[2])
                    await page.wait_for_timeout(5000)
                    await page.close()
                except Error as e:
                    print(f"Failed to access '{line[2]}'")


# 検出理由と検出時間を保存する関数
async def save_result(tranco_rank: str, tranco_url, login_url: str, msg: ConsoleMessage) -> None:
    # PhishDetectorの出力でなければ処理なし
    if not msg.text.startswith("PhishDetector"):
        return

    text = msg.text.split(':')
    with open("result.csv", mode="a") as f:
        # "TrancoRank,TrancoURL,LoginURL,検出理由,検出時間(ms)"のCSV形式で書き込み
        f.write(f"{tranco_rank},{tranco_url},{login_url},{text[1]},{text[2]}\n")


def show_result():
    df = pd.read_csv("./result.csv")

    blue = "\033[34m"
    end = "\033[0m"

    print("========================================")
    print(f"{blue}データセット概要{end}")
    print(f"URL総数 : {len(df)}")
    print(f"ログインURL総数 : {len(df.drop_duplicates(subset='LoginURL'))}")
    print(f"平均検出時間 : {round(df['検出時間(sec)'].mean(), 3)}")
    print("========================================")
    print(f"{blue}検出理由{end}")
    print(f"Unknown : {len(df[df['検出理由'] == 'Unknown'])}")
    print(f"Copy : {len(df[df['検出理由'] == 'Copy'])}")
    print(f"GA : {len(df[df['検出理由'] == 'GA'])}")
    print(f"Script : {len(df[df['検出理由'] == 'Script'])}")
    print(f"ExtLink : {len(df[df['検出理由'] == 'ExtLink'])}")
    print("========================================")


if __name__ == '__main__':
    # テスト実行
    asyncio.run(main())

    # 結果の表示
    show_result()

    # 処理終了の合図
    winsound.Beep(500, 500)
