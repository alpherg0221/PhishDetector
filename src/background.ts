import {deleteList, getList, ListType, updateList} from "./utils/utils.ts";
import {InferenceSession, Tensor, TypedTensor} from "onnxruntime-web";

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
      case "predict":
        InferenceSession.create(chrome.runtime.getURL("onnx_model/lightgbm.onnx")).then(async session => {
          const featuresFloat32: Float32Array = Float32Array.from(Object.values(msg.features));
          const featuresTensor: TypedTensor<"float32"> = new Tensor(featuresFloat32, [1, 11]);

          const result = await session.run({ X: featuresTensor });
          const label = Number(result.label.data[0]);
          const probability = Number(result.probabilities.data[1]);

          if (label === 0) {
            console.log("Legitimate");
          } else if (label === 1) {
            console.log("Phishing");
          }

          sendResponse(probability);
        });
    }
  });
  return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  deleteList(ListType.Tmp, String(tabId), true).then();
});

const createAlarm = async () => {
  if (await chrome.alarms.get("checkTmp") === undefined) {
    await chrome.alarms.create("checkTmp", { periodInMinutes: 0.5 })
  }
}

createAlarm().then();