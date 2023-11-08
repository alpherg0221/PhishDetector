# Phishing Detector for Chrome Extension

## How to install

1. 本リポジトリの [Releases](https://github.com/alpherg0221/PhishDetector/releases) から`ext.zip`をダウンロードして展開
2. Google Chromeで右上のメニューボタン (︙) から 「拡張機能」 → 「拡張機能を管理」 を選び、拡張機能の管理画面を開く
   <img src="img/step2.png" width=720>
3. 右上にある「デベロッパーモード」を有効にする
   <img src="img/step3.png" width=720>
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、展開したディレクトリの中にある`ext`を選択
   <img src="img/step4-1.png" width=720>
   <img src="img/step4-2.png" width=720>

## How to use

パスワード入力フォームがあるページにアクセスすると、自動で検出処理を実行します。<br>
フィッシングサイトを検出すると、警告画面が表示されます。