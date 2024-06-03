import { getList, getUseAllowList, getUseBlockList, ListType } from "./utils/utils.ts";

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  switch (msg.type) {
    case "detection":
      main(true).then(res => sendResponse(res));
      return true;
  }
});


const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second));


type ResFlag = "NoPasswordForm" | "Safe" | "Phish" | "Unknown" | "_Phish"
type DetectBy = "Indicator" | "List";


type RetObj = {
  resFlag: ResFlag,
  url: string,
  ga: boolean,
  copied: boolean,
  script: number,
  extLink: number,
  time: string,
  detectBy: DetectBy,
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
      url: location.hostname,
      ga: false,
      copied: false,
      script: 0,
      extLink: 0,
      time: "0",
      detectBy: "List",
    }
  }

  if (useBlockList && blockList.includes(location.hostname)) {
    return <RetObj>{
      resFlag: "Phish",
      url: location.hostname,
      ga: false,
      copied: false,
      script: 0,
      extLink: 0,
      time: "0",
      detectBy: "List",
    }
  }

  if (tmpList.includes(location.hostname)) {
    return <RetObj>{
      resFlag: "_Phish",
      url: location.hostname,
      ga: false,
      copied: false,
      script: 0,
      extLink: 0,
      time: "0",
      detectBy: "List",
    }
  }

  // Shadow DOM対策
  // Element.prototype._attachShadow = Element.prototype.attachShadow;
  // Element.prototype.attachShadow = () => this._attachShadow({ mode: "open" });

  // 時間を表示する桁数
  const digits: number = 3
  // 時間計測開始
  const startTime: number = performance.now() / 1000;
  // 検出されたか判定するフラグ
  let resFlag: ResFlag = "Unknown";
  // 各指標の値
  let ga: boolean;
  let copied: boolean;
  let script: number;
  let extLink: number;

  // JSによるコンテンツ生成まで2秒待機
  if (!noSleep) await sleep(2000);

  // ページ内にpasswordの入力フォームがなければ処理終了
  if (!(await _isExistPasswordForm())) {
    console.log(`PhishDetector:NoPasswordForm:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
    resFlag = "NoPasswordForm";
  }

  // 各指標をチェック
  ga = await _checkGoogleAnalytics();
  if (ga) {
    if (resFlag !== "NoPasswordForm") resFlag = "Safe";
    console.log(`PhishDetector:GA:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
  }

  copied = await _checkCopied();
  if (copied) {
    if (resFlag !== "NoPasswordForm") resFlag = "Phish";
    console.log(`PhishDetector:Copy:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
  }

  script = await _checkScriptTagCount();
  if (script <= 11) {
    if (resFlag !== "NoPasswordForm") resFlag = "Phish";
    console.log(`PhishDetector:Script:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
  }

  extLink = await _checkExtLink();
  if (extLink >= 64) {
    if (resFlag !== "NoPasswordForm") resFlag = "Phish";
    console.log(`PhishDetector:ExtLink:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
  }

  return <RetObj>{
    resFlag: resFlag,
    url: location.hostname,
    ga: ga,
    copied: copied,
    script: script,
    extLink: extLink,
    time: (performance.now() / 1000 - startTime).toFixed(digits),
    detectBy: "Indicator",
  }
}


const _isExistPasswordForm = async () => {
  let cnt = document.querySelectorAll('input[type="password"]').length;

  // iframe内のscriptタグも取得
  const iframes = document.querySelectorAll("iframe");
  for (const iframe of iframes) {
    try {
      cnt += iframe.contentWindow!.document.querySelectorAll('input[type="password"]').length;
    } catch {
      /* empty */
    }
  }

  return (cnt >= 1);
}


const _showDetectionPage = async (resFlag: ResFlag, detectBy: DetectBy, ga: boolean, copied: boolean, script: number, extLink: number, time: string) => {
  location.assign(`chrome-extension://${ chrome.runtime.id }/src/warning/index.html?url=${ location.hostname }&resFlag=${ resFlag }&detectBy=${ detectBy }&ga=${ ga }&copied=${ copied }&script=${ script }&extLink=${ extLink }&time=${ time }`)
}


const _checkGoogleAnalytics = async () => {
  const GAFileName: string = "https://www.google-analytics.com/analytics.js";
  const GTMFileName: string = "https://www.googletagmanager.com/gtag/js";

  const srcText = document.documentElement.outerHTML;

  return (srcText.includes(GAFileName)) || (srcText.includes(GTMFileName));
}


const _checkCopied = async () => {
  const HtmlAttr: string = "data-scrapbook-source";
  const HtmlComments: string = "saved from url";

  return (document.documentElement.hasAttribute(HtmlAttr)) || (document.documentElement.outerHTML.includes(HtmlComments));
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
        console.log(`internal : ${ link }`);
      } else {
        external++;
        console.log(`external : ${ link }`);
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

  return (external * 100 / (external + internal));
}


const mutationObserver = () => {
  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName.toLowerCase() === "input" && (node as HTMLInputElement).type === "password") {
          main(true).then(async (res) => {
            if (res.resFlag === "Phish") {
              await _showDetectionPage(res.resFlag, res.detectBy, res.ga, res.copied, res.script, res.extLink, res.time);
            }
          });
        }
      });
    });
  });
  observer.observe(targetNode, config);
}


mutationObserver();


main(false).then(async (res) => {
  // 検出済みflagが立っていたら警告ページを表示
  if (res.resFlag === "Phish") {
    await _showDetectionPage(res.resFlag, res.detectBy, res.ga, res.copied, res.script, res.extLink, res.time);
  }
}).catch(e => console.error(e));