import { deleteList, getList, ListType, updateList } from "./utils/utils.ts";
// @ts-ignore
import * as tfdf from "@tensorflow/tfjs-tfdf";
import { Tensor } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
// @ts-ignore
import { TFDFModel } from "@tensorflow/tfjs-tfdf";

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
        tfdf.setLocateFile(() => `chrome-extension://${ chrome.runtime.id }/inference.wasm`);
        tfdf.loadTFDFModel(`chrome-extension://${ chrome.runtime.id }/tfjs_model/model.json`).then((model: TFDFModel) => {
          model.executeAsync({
            "copied": tf.tensor(msg.copied, [1], 'int32'),
            "google_analytics": tf.tensor(msg.googleAnalytics, [1], 'int32'),
            "script_tag_count": tf.tensor(msg.scriptTagCount, [1], 'int32'),
            "external_link_percentage": tf.tensor(msg.externalLinkPercentage, [1]),
            "no_title": tf.tensor(msg.noTitle, [1], 'int32'),
            "same_page_link_count": tf.tensor(msg.samePageLink, [1], 'int32'),
            "iframe_tag_count": tf.tensor(msg.iframeTagCount, [1], 'int32'),
            "tag_count_in_head_tag": tf.tensor(msg.tagCountInHeadTag, [1], 'int32'),
            "no_domain_in_internal_link": tf.tensor(msg.noDomainInInternalLink, [1]),
            "invalid_kiyaku": tf.tensor(msg.invalidKiyaku, [1], 'int32'),
            "ip_address_in_link": tf.tensor(msg.ipAddressInLink, [1], 'int32'),
          }).then((result: Tensor) => sendResponse(result.dataSync()[0]));
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