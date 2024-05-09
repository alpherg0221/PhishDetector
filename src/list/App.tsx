import {
  IconButton,
  List,
  Stack,
  Text,
  ThemeProvider
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { deleteList, getList, ListType } from "../utils/utils.ts";

const App = () => {
  // const isEnglish = window.navigator.language === "en";
  const listType = ListType[(new URLSearchParams(location.search)).get("listType") as keyof typeof ListType];
  const [list, updateList] = useState<string[]>([]);

  useEffect(() => {
    if (listType !== ListType.Allow && listType !== ListType.Block) {
      chrome.runtime.sendMessage({ type: "close" }).then();
    } else {
      getList(listType).then(res => updateList(res));
    }
  }, []);

  return (
    <>
      <ThemeProvider style={ {
        minHeight: "100vh",
        display: "grid",
        justifyItems: "center",
      } }>
        <Stack horizontalAlign="center" tokens={ { childrenGap: 20 } } style={ { paddingTop: "50px" } }>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={ { childrenGap: 20 } }>
            <img src="/icon/icon48.svg" alt="BrandIcon" width={ 24 } height={ 24 }/>
            <Text style={ { fontSize: "1.5em" } }>PhishDetector</Text>
          </Stack>

          <Text style={ { fontSize: "2.5em", fontWeight: "bold" } }> { listType } List </Text>

          <List items={ list } onRenderCell={ (item) => (
            <Stack
              horizontal
              horizontalAlign="end"
              verticalAlign="center"
              tokens={ { childrenGap: 10, padding: 5 } }
              style={ { borderBottom: "1px solid #999999" } }
            >
              <div style={ { height: 32, width: 32 } }/>
              <Text style={ { fontSize: "1em", height: "32px", lineHeight: "32px" } }>{ item }</Text>
              <IconButton iconProps={ { iconName: "Cancel" } } onClick={ async () => {
                await deleteList(listType, item ?? "");
                updateList(await getList(listType));
              } }/>
            </Stack>
          ) }/>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App;