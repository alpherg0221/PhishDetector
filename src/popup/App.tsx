import {
  DefaultButton,
  FontIcon,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  ThemeProvider,
  Toggle
} from "@fluentui/react";
import { getSendInfo, ListType, reportToFirenze, setList, setSendInfo } from "../utils/utils.ts";
import { useEffect, useState } from "react";

const App = () => {
  const isEnglish = window.navigator.language === "en";
  const [sendInfo, updateSendInfo] = useState(false);
  const [detected, setDetected] = useState("");
  const [detectRes, setDetectRes] = useState<{ [p: string]: string }>({});
  const [showMsgBar, setShowMsgBar] = useState(false);

  // 検出漏れの報告
  const reportFN = async () => {
    await reportToFirenze("FN", detectRes);

    await setList(ListType.Block, detectRes.url);

    setShowMsgBar(true);
  }

  useEffect(() => {
    getSendInfo().then(v => updateSendInfo(v));
    chrome.runtime.sendMessage({ type: "detection" }).then(res => {
      setDetected(res.resFlag);
      setDetectRes(res);
    });
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

          <Stack horizontal horizontalAlign="center">
            <Text style={ { fontSize: "1.5em" } }>
              { `${ isEnglish ? "Phishing Status" : "判定結果" } : ${ detected }` }
            </Text>
          </Stack>

          <PrimaryButton onClick={ reportFN }>
            { isEnglish ? "Report this page as phishing" : "このページをフィッシングとして報告" }
          </PrimaryButton>

          <Stack horizontalAlign="center" tokens={ { childrenGap: 20 } }>
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
                  } }>
                    { isEnglish ? "検出時の情報を開発者に送信する" : "検出時の情報を開発者に送信する" }
                  </Text>
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

            <DefaultButton iconProps={ { iconName: "OpenInNewTab" } } onClick={
              async () => await chrome.runtime.sendMessage({ type: "list", listType: "Block" })
            }> Block list </DefaultButton>

            <DefaultButton iconProps={ { iconName: "OpenInNewTab" } } onClick={
              async () => await chrome.runtime.sendMessage({ type: "list", listType: "Allow" })
            }> Allow list </DefaultButton>
          </Stack>

          { showMsgBar &&
              <MessageBar
                  messageBarType={ MessageBarType.success }
                  isMultiline={ false }
                  onDismiss={ () => setShowMsgBar(false) }
              > Thank you for reporting </MessageBar>
          }
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;