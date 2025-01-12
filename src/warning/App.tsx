import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Stack,
  Text,
  ThemeProvider
} from "@fluentui/react";
import "./App.css"
import { useEffect, useState } from "react";
import {
  deleteList,
  getSendInfo,
  getUseAllowList,
  getUseBlockList,
  ListType,
  reportToFirenze,
  setList
} from "../utils/utils.ts";

const App = () => {
  const isEnglish = window.navigator.language === "en";
  const [useAllowList, updateUseAllowList] = useState(false);
  const [hiddenDialog, setHiddenDialog] = useState(true);

  // 誤検出の報告
  const reportFP = async () => {
    const data = Object.fromEntries(new URLSearchParams(location.search));
    await reportToFirenze("FP", data);

    // 報告したらダイアログを出す
    setHiddenDialog(false);
  }

  // フィッシングページへのアクセス (警告無視時と誤検出報告後)
  const accessPage = async () => {
    const data = Object.fromEntries(new URLSearchParams(location.search));

    // AllowリストにURLを追加
    if (useAllowList) await setList(ListType.Allow, data.url);
    // BlockリストからURL (検出時に追加されていたもの) を削除
    await deleteList(ListType.Block, data.url);
    // TmpリストにURLを追加
    const currentTabId = (await chrome.tabs.getCurrent())?.id;
    await setList(ListType.Tmp, `${ data.url }@${ Date.now() + 300000 }@${ currentTabId }`);

    history.go(-1);
  }

  // 警告ページを閉じる
  const closePage = () => chrome.runtime.sendMessage({ type: "close" });

  useEffect(() => {
    const data = Object.fromEntries(new URLSearchParams(location.search));

    // 検出の報告 (許可されている場合のみ)
    getSendInfo().then(async (res) => {
      if (res) {
        await reportToFirenze("Detect", data);
      }
    });

    // Blockリストに追加
    getUseBlockList().then(v => {
      if (v) {
        setList(ListType.Block, data.url).then();
      }
    });
    getUseAllowList().then(v => updateUseAllowList(v));
  }, []);

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
          {/*<Text style={ { color: "#e9e9e9", fontSize: "1.25em" } }>*/ }
          {/*  検出理由：<b>{ (new URL(location.href)).searchParams.get("by") }</b>*/ }
          {/*</Text>*/ }
          <Text style={ { color: "#e9e9e9", fontSize: "1.25em" } }>
            検出時間：<b>{ (new URL(location.href)).searchParams.get("classifierTime") }</b> ms
          </Text>
          <Stack horizontal horizontalAlign="center" style={ { paddingTop: 20 } } tokens={ { childrenGap: 20 } }>
            <DefaultButton onClick={ reportFP }>
              { isEnglish ? "Report a false positive" : "誤検出を報告" }
            </DefaultButton>
            <DefaultButton onClick={ accessPage }>
              { isEnglish ? "Access this page" : "ページにアクセスする" }
            </DefaultButton>
            <DefaultButton onClick={ closePage }>
              { isEnglish ? "Close this page" : "ページを閉じる" }
            </DefaultButton>
          </Stack>
        </Stack>
        <Dialog
          hidden={ hiddenDialog }
          dialogContentProps={ {
            type: DialogType.normal,
            title: isEnglish ? "False positive reported" : "誤検出を報告しました",
            subText: isEnglish ? "Thank you for your cooperation" : "ご協力ありがとうございました"
          } }
          modalProps={ {
            isBlocking: true,
            styles: { main: { width: 450 } }
          } }
        >
          <DialogFooter>
            <PrimaryButton onClick={ accessPage } text={ isEnglish ? "Back to page" : "ページに戻る" }/>
          </DialogFooter>
        </Dialog>
      </ThemeProvider>
    </>
  )
}

export default App;