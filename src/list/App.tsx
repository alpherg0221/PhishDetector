import { Stack, Text, ThemeProvider } from "@fluentui/react";
import { useEffect } from "react";

const App = () => {
  const listType = (new URLSearchParams(location.search)).get("listType");

  useEffect(() => {
    if (listType !== "Block" && listType !== "Allow") {
      chrome.runtime.sendMessage({type: "close"}).then();
    }
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
            <Text style={ { fontSize: "2.5em" } }>PhishDetector for Chrome Extension</Text>
          </Stack>

          <Text style={ { fontSize: "2em", fontWeight: "bold", paddingTop: 25 } }> { listType } List </Text>

        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;