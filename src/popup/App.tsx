import { FontIcon, PrimaryButton, Stack, Text, ThemeProvider, Toggle } from "@fluentui/react";
import { getSendInfo, setSendInfo } from "../utils/utils.ts";
import { useEffect, useState } from "react";

const App = () => {
  const isEnglish = window.navigator.language === "en";
  const [sendInfo, updateSendInfo] = useState(false);

  // 検出漏れの報告
  const reportFN = async () => {
    const formData = new FormData();
    const data = Object.fromEntries(new URLSearchParams(location.search)); // TODO:データの取得
    formData.append("type", "FP");
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    await fetch("https://www.az.lab.uec.ac.jp/~ywatanabe/PhishingDetector/api/info.php", {
      mode: "cors",
      method: "POST",
      body: formData,
    });
  }

  useEffect(() => {
    getSendInfo().then(v => updateSendInfo(v));
  }, []);

  return (
    <>
      <ThemeProvider style={ {
        minHeight: "100vh",
        display: "grid",
        justifyItems: "center",
      } }>
        <Stack horizontalAlign="center" tokens={ { childrenGap: 50 } } style={ { paddingTop: "20px" } }>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={ { childrenGap: 20 } }>
            <img src="/icon/icon48.svg" alt="BrandIcon" width={ 36 } height={ 36 }/>
            <Text style={ { fontSize: "2em" } }>PhishDetector</Text>
          </Stack>

          <PrimaryButton onClick={ reportFN }>
            { isEnglish ? "Report this page as phishing" : "このページをフィッシングとして報告" }
          </PrimaryButton>

          <Stack horizontalAlign="center" tokens={ { childrenGap: 10 } }>
            <Text style={ { fontSize: "1.5em", fontWeight: "bold" } }> 設定 </Text>
            <Toggle
              checked={ sendInfo }
              label={
                <Stack horizontal verticalAlign="center">
                  <FontIcon iconName="Send" style={ { paddingLeft: 26, fontSize: 20, fontWeight: "bolder" } }/>
                  <Text style={ {
                    fontSize: "1em",
                    fontWeight: "bolder",
                    paddingLeft: 26
                  } }>検出時の情報を開発者に送信する</Text>
                </Stack>
              }
              inlineLabel
              onText=" "
              offText=" "
              onChange={ async (_, checked) => {
                await setSendInfo(checked ?? false);
                updateSendInfo(await getSendInfo());
              } }
            />
          </Stack>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;