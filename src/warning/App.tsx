import { DefaultButton, Stack, Text, ThemeProvider } from "@fluentui/react";
import "./App.css"

const App = () => {
  const isEnglish = window.navigator.language === "en";

  const closePage = () => chrome.runtime.sendMessage({ type: "close" });

  return (
    <>
      <ThemeProvider style={ {
        minHeight: "100vh",
        display: "grid",
        justifyItems: "center",
        backgroundColor: "#B3261E",
      } }>
        <Stack tokens={ { childrenGap: 20 } } style={ { paddingTop: "200px" } }>
          <Stack horizontal>
            <img src="/warning.svg" alt="WarnignIcon"/>
            <img src="/phishing.svg" alt="PhishingIcon"/>
          </Stack>
          <Text style={ { color: "#e9e9e9", fontSize: "2.5em" } }>
            { isEnglish ? "Phishing site detected" : "フィッシングサイトを検出しました" }
          </Text>
          <Text style={ { color: "#e9e9e9", fontSize: "1.25em" } }>
            <b>{ (new URL(location.href)).searchParams.get("url") }</b>
            { isEnglish ? " might steal your personally identifiable information." : " は機密情報を盗み取る疑いがあります" }
          </Text>
          {/*<Text style={ { color: "#e9e9e9", fontSize: "1.25em" } }>*/}
          {/*  検出理由：<b>{ (new URL(location.href)).searchParams.get("by") }</b>*/}
          {/*</Text>*/}
          {/*<Text style={ { color: "#e9e9e9", fontSize: "1.25em" } }>*/}
          {/*  検出時間：<b>{ (new URL(location.href)).searchParams.get("time") }</b> ms*/}
          {/*</Text>*/}
          <Stack horizontalAlign="center" style={ { paddingTop: 20 } }>
            <DefaultButton onClick={ closePage }>{ isEnglish ? "Close this page" : "ページを閉じる" }</DefaultButton>
          </Stack>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;