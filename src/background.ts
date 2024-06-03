import { getList, ListType, updateList } from "./utils/utils.ts";

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.tabs.create({ url: `./src/startup/index.html` })
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "checkTmp") {
    getList(ListType.Tmp).then(list => {
      // "domain_expire" の "現在時刻 - expire" が負 (現在時刻がexpireより前) ならリストに残す
      const filtered = list.filter(v => Date.now() - parseInt(v.split("@")[1]) < 0);
      updateList(ListType.Tmp, filtered).then();
    });
  }
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([currentTab]) => {
    switch (msg.type) {
      case "detection":
        chrome.tabs.sendMessage(currentTab.id!, { type: "detection" }).then(res => sendResponse(res));
        return true;
      case "close":
        chrome.tabs.remove(currentTab.id!).then();
        return true;
      case "list":
        chrome.tabs.create({ url: `./src/list/index.html?listType=${ msg.listType }` }).then();
        return true;
    }
  });
  return true;
});

const createAlarm = async () => {
  if (await chrome.alarms.get("checkTmp") === undefined) {
    await chrome.alarms.create("checkTmp", {periodInMinutes: 0.5})
  }
}

createAlarm().then();