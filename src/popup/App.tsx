import { Stack, Text, ThemeProvider, Toggle } from "@fluentui/react";
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
      } }>
        <Stack horizontalAlign="center" tokens={ { childrenGap: 20 } } style={ { paddingTop: "20px" } }>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={ { childrenGap: 20 } }>
            <img src="/icon/icon48.svg" alt="BrandIcon" width={ 36 } height={ 36 }/>
            <Text style={ { fontSize: "2em" } }>PhishDetector</Text>
          </Stack>

          <Text style={ { fontSize: "1.5em", fontWeight: "bold", paddingTop: 10 } }> 設定 </Text>
          <Toggle
            checked={ sendInfo }
            label={ <Text style={ {
              fontSize: "1em",
              fontWeight: "bolder"
            } }>検出時の情報を開発者に送信する</Text> }
            inlineLabel
            onText=" "
            offText=" "
            onChange={ async (_, checked) => {
              await setSendInfo(checked ?? false);
              updateSendInfo(await getSendInfo());
            } }/>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;