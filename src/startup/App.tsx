import { PrimaryButton, Stack, Text, ThemeProvider, Toggle } from "@fluentui/react";
import { getSendInfo, setSendInfo } from "../utils/utils.ts";
import { useEffect, useState } from "react";

const App = () => {
  const [sendInfo, updateSendInfo] = useState(false);
  useEffect(() => {
    getSendInfo().then(v => updateSendInfo(v));
  }, []);

  return (
    <>
      <ThemeProvider style={ {
        minHeight: "100vh",
        display: "grid",
        justifyItems: "center",
        backgroundColor: "#e9e9e9"
      } }>
        <Stack horizontalAlign="center" tokens={ { childrenGap: 20 } } style={ { paddingTop: "50px" } }>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={ { childrenGap: 20 } }>
            <img src="/icon/icon48.svg" alt="BrandIcon" width={ 48 } height={ 48 }/>
            <Text style={ { fontSize: "2.5em" } }>PhishDetector</Text>
          </Stack>

          <Text style={ { fontSize: "2em", fontWeight: "bold", paddingTop: 25 } }> 使用方法 </Text>
          <Stack horizontalAlign="center">
            <Text style={ { fontSize: "1.5em" } }>
              パスワード入力フォームがあるページにアクセスすると、自動で検出処理を実行します。
            </Text>
            <Text style={ { fontSize: "1.5em" } }>フィッシングサイトを検出すると、警告画面が表示されます。</Text>
          </Stack>

          <Text style={ { fontSize: "2em", fontWeight: "bold", paddingTop: 25 } }> 設定 </Text>
          <Toggle
            checked={ sendInfo }
            label={ <Text style={ {
              fontSize: "1.5em",
              fontWeight: "bolder"
            } }>検出精度向上のため、検出時の情報を開発者に送信する</Text> }
            inlineLabel
            onText=" "
            offText=" "
            onChange={ async (_, checked) => {
              await setSendInfo(checked ?? false);
              updateSendInfo(await getSendInfo());
            } }/>

          <PrimaryButton onClick={ () => chrome.runtime.sendMessage({ type: "close" }) }>
            設定を保存してページを閉じる
          </PrimaryButton>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;