# Phishing Detector for Chrome Extension

## インストール方法

1. 本リポジトリの [Releases](https://github.com/alpherg0221/PhishDetector/releases) から`ext.zip`をダウンロードして展開
2. Google Chromeで右上のメニューボタン (︙) から 「拡張機能」 → 「拡張機能を管理」 を選び、拡張機能の管理画面を開く
   ![step2.png](img/step2-ja.png)
3. 右上にある「デベロッパーモード」ボタンを押して、デベロッパーモードを有効にする
   ![step3.png](img/step3-ja.png)
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、展開したディレクトリの中の`ext`を選択
   ![step4-1.png](img/step4-1-ja.png)
   ![step4-2.png](img/step4-2-ja.png)

## 使用方法

パスワード入力フォームがあるページにアクセスすると、自動で検出処理を実行します。<br>
フィッシングサイトを検出すると、警告画面が表示されます。