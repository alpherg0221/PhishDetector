import { getList, getUseAllowList, getUseBlockList, ListType } from "./utils/utils.ts";


chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  switch (msg.type) {
    case "detection":
      main(true).then(res => sendResponse(res));
      return true;
  }
});


const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second));


type ResFlag = "NoPasswordForm" | "Safe" | "Phish" | "_Phish"
type DetectBy = "RealTime" | "List";


export type Feature = {
  copied: number,
  googleAnalytics: number,
  scriptTagCount: number,
  externalLinkPercentage: number,
  noTitle: number,
  samePageLink: number,
  iframeTagCount: number,
  tagCountInHeadTag: number,
  noDomainInInternalLink: number,
  invalidKiyaku: number,
  ipAddressInLink: number,
}


type RetObj = {
  resFlag: ResFlag,
  classifierRes: ResFlag,
  url: string,
  copiedTime: string,
  classifierTime: string,
  detectBy: DetectBy,
  copied: number,
  ga: number,
  script: number,
  extLink: number,
  noTitle: number,
  samePageLink: number,
  iframe: number,
  tagCountInHead: number,
  noDomainInInternalLink: number,
  invalidKiyaku: number,
  ipAddressInLink: number,
}


declare global {
  interface Element {
    _attachShadow(init: ShadowRootInit): ShadowRoot;
  }
}


const main = async (noSleep: boolean) => {
  // BlockリストとAllowリストによる判定
  const useBlockList = await getUseBlockList();
  const useAllowList = await getUseAllowList();

  const allowList = await getList(ListType.Allow);
  const blockList = await getList(ListType.Block);
  const tmpList = await getList(ListType.Tmp).then(list => list.map(e => e.split("@")[0]));

  if (useAllowList && allowList.includes(location.hostname)) {
    return <RetObj>{
      resFlag: "Safe",
      classifierRes: "Safe",
      url: location.hostname,
      copiedTime: "0",
      classifierTime: "0",
      detectBy: "List",
    }
  }

  if (useBlockList && blockList.includes(location.hostname)) {
    return <RetObj>{
      resFlag: "Phish",
      classifierRes: "Phish",
      url: location.hostname,
      copiedTime: "0",
      classifierTime: "0",
      detectBy: "List",
    }
  }

  if (tmpList.includes(location.hostname)) {
    return <RetObj>{
      resFlag: "_Phish",
      classifierRes: "_Phish",
      url: location.hostname,
      copiedTime: "0",
      classifierTime: "0",
      detectBy: "List",
    }
  }

  // Shadow DOM対策
  // Element.prototype._attachShadow = Element.prototype.attachShadow;
  // Element.prototype.attachShadow = () => this._attachShadow({ mode: "open" });

  // 時間を表示する桁数
  const digits: number = 6
  // 時間計測開始
  const startTime: number = performance.now() / 1000;
  // 分類器の検出結果
  let classifierResFlag: ResFlag = "Safe";
  // 検出されたか判定するフラグ
  let resFlag: ResFlag = "Safe";

  // JSによるコンテンツ生成まで2秒待機
  if (!noSleep) await sleep(2000);

  // ページ内にpasswordの入力フォームがなければ処理終了
  if (!(await _existForm())) {
    resFlag = "NoPasswordForm";
  }


  // 各指標の値
  const copied: number = await _checkCopied();

  // コピーの痕跡の検出時間
  const copiedTime = (performance.now() / 1000 - startTime).toFixed(digits);

  const ga: number = await _checkGoogleAnalytics();
  const script: number = await _checkScriptTagCount();
  const extLink: number = await _checkExtLink();
  const noTitle: number = await _checkNoTitle();
  const samePageLink: number = await _checkSamePageLinkCount();
  const iframe: number = await _checkIframeTagCount();
  const tagCountInHead: number = await _checkCountInHeadTag();
  const noDomainInInternalLink: number = await _checkNoDomainInInternalLink();
  const invalidKiyaku: number = await _checkInvalidKiyaku();
  const ipAddressInLink: number = await _checkIpAddressInLink();

  if (resFlag !== "NoPasswordForm") {
    const features: Feature = {
      "copied": copied,
      "googleAnalytics": ga,
      "scriptTagCount": script,
      "externalLinkPercentage": extLink,
      "noTitle": noTitle,
      "samePageLink": samePageLink,
      "iframeTagCount": iframe,
      "tagCountInHeadTag": tagCountInHead,
      "noDomainInInternalLink": noDomainInInternalLink,
      "invalidKiyaku": invalidKiyaku,
      "ipAddressInLink": ipAddressInLink,
    };

    // 検出処理
    const result = await chrome.runtime.sendMessage({
      "type": "predict",
      "features": features,
    });

    if (result >= 0.5) {
      classifierResFlag = "Phish";
    } else {
      classifierResFlag = "Safe";
    }

    if (copied || classifierResFlag == "Phish") {
      resFlag = "Phish";
    } else {
      resFlag = "Safe";
    }
  }

  return <RetObj>{
    resFlag: resFlag,
    classifierRes: classifierResFlag,
    url: location.hostname,
    copiedTime: copiedTime,
    classifierTime: (performance.now() / 1000 - startTime).toFixed(digits),
    detectBy: "RealTime",
    copied: copied,
    ga: ga,
    script: script,
    extLink: extLink,
    noTitle: noTitle,
    samePageLink: samePageLink,
    iframe: iframe,
    tagCountInHead: tagCountInHead,
    noDomainInInternalLink: noDomainInInternalLink,
    invalidKiyaku: invalidKiyaku,
    ipAddressInLink: ipAddressInLink,
  }
}


const _existForm = async () => {
  let passwdFormCnt = document.querySelectorAll('input[type="password"]').length;
  let textFormCnt = document.querySelectorAll('input[type="text"]').length;

  // iframe内のscriptタグも取得
  const iframes = document.querySelectorAll("iframe");
  for (const iframe of iframes) {
    try {
      passwdFormCnt += iframe.contentWindow!.document.querySelectorAll('input[type="password"]').length;
      textFormCnt += iframe.contentWindow!.document.querySelectorAll('input[type="text"]').length;
    } catch {
      /* empty */
    }
  }

  return (passwdFormCnt >= 1 || textFormCnt >= 5);
}


const _showDetectionPage = async (res: RetObj) => {
  if (res.detectBy === "List") {
    location.assign(
      `${chrome.runtime.getURL("src/warning/index.html")}?url=${ res.url }&resFlag=${ res.resFlag }&time=${ res.classifierTime }`
    );
  } else if (res.detectBy === "RealTime") {
    location.assign(
      `${chrome.runtime.getURL("src/warning/index.html")}?url=${ res.url }&resFlag=${ res.resFlag }&classifierRes=${ res.classifierRes }&classifierTime=${ res.classifierTime }&copiedTime=${ res.copiedTime }&ga=${ res.ga }&copied=${ res.copied }&script=${ res.script }&extLink=${ res.extLink }&noTitle=${ res.noTitle }&samePageLink=${ res.samePageLink }&iframe=${ res.iframe }&tagCountInHead=${ res.tagCountInHead }&noDomainInInternalLink=${ res.noDomainInInternalLink }&invalidKiyaku=${ res.invalidKiyaku }&ipAddressInLink=${ res.ipAddressInLink }`
    );
  }
}


const _checkCopied = async () => {
  const HtmlAttr: string = "data-scrapbook-source";
  const HtmlComments: string = "saved from url";
  const HtmlComments2: string = "Page Saved with SingleFile"

  if (document.documentElement.hasAttribute(HtmlAttr) || document.documentElement.outerHTML.includes(HtmlComments) || document.documentElement.outerHTML.includes(HtmlComments2)) {
    return 1;
  } else {
    return 0;
  }
}


const _checkGoogleAnalytics = async () => {
  const GAFileName: string = "https://www.google-analytics.com/analytics.js";
  const GTMFileName: string = "https://www.googletagmanager.com/gtag/js";

  const srcText = document.documentElement.outerHTML;

  if (srcText.includes(GAFileName) || srcText.includes(GTMFileName)) {
    return 1;
  } else {
    return 0;
  }
}


const _checkScriptTagCount = async () => {
  let cnt = document.querySelectorAll("script").length;

  // iframe内のscriptタグも取得
  const iframes = document.querySelectorAll("iframe")
  for (const iframe of iframes) {
    try {
      cnt += iframe.contentWindow!.document.querySelectorAll("script").length;
    } catch {
      /* empty */
    }
  }

  return cnt;
}


const _checkExtLink = async () => {
  const aTags = Array.from(document.querySelectorAll("a[href]"));
  // iframe内のaタグも取得
  const iframes = document.querySelectorAll("iframe")
  for (const iframe of iframes) {
    try {
      aTags.push(...iframe.contentWindow!.document.querySelectorAll("a[href]"));
    } catch {
      /* empty */
    }
  }

  let external = 0;
  let internal = 0;

  // aタグを外部リンクと内部リンクに分類
  for (const aTag of aTags) {
    let link = aTag.getAttribute("href")!;

    // ハッシュが指定されていたら無視
    if (link === "" || link.startsWith("#")) continue;

    if (link.startsWith("http") || link.startsWith("//")) {
      // //から始まるURLにhttpやhttpsを追加
      if (link.startsWith("//")) link = `${ location.protocol }${ link }`;

      let linkHostname = (new URL(link)).hostname;

      // linkのドメインでcookieを設定
      // eTLD+1が違うと設定されない
      while (true) {
        document.cookie = `pd_test_key=pd_test_value; domain=${ linkHostname };`;
        if (linkHostname.indexOf(".") === -1) break;
        linkHostname = linkHostname.substring(linkHostname.indexOf(".") + 1);
      }

      // cookieが設定されていればeTLD+1が同じ
      if (document.cookie.includes("pd_test_key=pd_test_value")) {
        internal++;
      } else {
        external++;
      }

      // cookieを消す
      linkHostname = (new URL(link)).hostname;
      while (true) {
        document.cookie = `pd_test_key=pd_test_value; domain=${ linkHostname }; max-age=0;`;
        if (linkHostname.indexOf(".") === -1) break;
        linkHostname = linkHostname.substring(linkHostname.indexOf(".") + 1);
      }
    } else {
      internal++;
    }
  }

  if (external + internal > 0) {
    return external * 100 / (external + internal);
  } else {
    return 0;
  }
}


const _checkNoTitle = async () => {
  let title_tag = document.querySelector("title");

  if (title_tag === null || title_tag.text === "") {
    return 1;
  } else {
    return 0;
  }
}


const _checkSamePageLinkCount = async () => {
  const invalidHrefs = ["", "#", "#nothing", "#null", "#void", "#doesnotexist", "#whatever"];

  const hrefs = [...document.querySelectorAll("a[href]")].map(e => e.getAttribute("href")!);
  const href_dict: { [hrefs: string]: number } = {};

  for (const href in hrefs) {
    if (invalidHrefs.includes(href.toLowerCase()) || href.toLowerCase().startsWith("javascript")) {
      continue;
    }
    href_dict[href] = (href_dict[href] || 0) + 1;
  }

  let max = 0;
  for (const href of hrefs) {
    if (max < href_dict[href]) max = href_dict[href];
  }
  return max;
}


const _checkIframeTagCount = async () => {
  return document.querySelectorAll("iframe").length;
}


const _checkCountInHeadTag = async () => {
  return document.querySelector("head")!.childElementCount;
}


const _checkNoDomainInInternalLink = async () => {
  const hrefs = [...document.querySelectorAll("*[href]")].map(e => e.getAttribute("href")!);
  const srcs = [...document.querySelectorAll("*[src]")].map(e => e.getAttribute("src")!);
  const links = [...hrefs, ...srcs];

  let internal = 0;
  let internal_rel = 0;

  // aタグを外部リンクと内部リンクに分類
  for (let link of links) {
    if (link.startsWith("http") || link.startsWith("//")) {
      // //から始まるURLにhttpやhttpsを追加
      if (link.startsWith("//")) link = `${ location.protocol }${ link }`;
      let linkHostname = (new URL(link)).hostname;

      // linkのドメインでcookieを設定
      // eTLD+1が違うと設定されない
      while (true) {
        document.cookie = `pd_test_key=pd_test_value; domain=${ linkHostname };`;
        if (linkHostname.indexOf(".") === -1) break;
        linkHostname = linkHostname.substring(linkHostname.indexOf(".") + 1);
      }

      // cookieが設定されていればeTLD+1が同じ
      if (document.cookie.includes("pd_test_key=pd_test_value")) {
        internal++;
      }

      // cookieを消す
      linkHostname = (new URL(link)).hostname;
      while (true) {
        document.cookie = `pd_test_key=pd_test_value; domain=${ linkHostname }; max-age=0;`;
        if (linkHostname.indexOf(".") === -1) break;
        linkHostname = linkHostname.substring(linkHostname.indexOf(".") + 1);
      }
    } else {
      internal++;
      internal_rel++;
    }
  }

  if (internal > 0) {
    return internal_rel / internal;
  } else {
    return 0;
  }
}


const _checkInvalidKiyaku = async () => {
  const kiyakuTags = [...document.querySelectorAll<HTMLAnchorElement>("a")]
    .filter(e => e.text.includes("規約") || e.text.includes("プライバシーポリシー"));

  const kiyakuValid = kiyakuTags
    .filter(e => e.hasAttribute("href"))
    .filter(e => !e.getAttribute("href")!.startsWith("#"));

  if (kiyakuTags.length === kiyakuValid.length) {
    return 1;
  } else {
    return 0;
  }
}


const _checkIpAddressInLink = async () => {
  const ipAddrRegex = /^.*((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]).*$/g;

  const hrefs = [...document.querySelectorAll("*[href]")].map(e => e.getAttribute("href")!);
  const srcs = [...document.querySelectorAll("*[src]")].map(e => e.getAttribute("src")!);
  const links = [...hrefs, ...srcs];
  const matchLink = links.map(link => ipAddrRegex.test(link));

  if (matchLink.length > 0) {
    return 1;
  } else {
    return 0;
  }
}


const mutationObserver = () => {
  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName.toLowerCase() === "input") {
          main(true).then(async (res) => {
            if (res.resFlag === "Phish") {
              await _showDetectionPage(res);
            }
          });
        }
      });
    });
  });
  observer.observe(targetNode, config);
}


mutationObserver();


const exec = setInterval(async () => {
  main(true).then(async (res) => {
    // 検出済みflagが立っていたら警告ページを表示
    switch (res.resFlag) {
      case "Phish":
        await _showDetectionPage(res);
        break;
      case "_Phish":
        clearInterval(exec);
        break;
    }
  }).catch(e => console.info(e));
}, 500)
