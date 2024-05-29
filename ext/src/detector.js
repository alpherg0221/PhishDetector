chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    switch (msg.type) {
        case "detection":
            main(true).then(res => sendResponse(res));
            return true;
    }
});


const sleep = (second) => new Promise(resolve => setTimeout(resolve, second));


/**
 * @returns {Promise<{resFlag: "NoPasswordForm"|"Safe"|"Phish"|"Unknown", url: string, ga: boolean, copied: boolean, script: number, extLink: number, time: string, detectBy: "Indicator" | "List"}>}
 * @param noSleep {boolean}
 */
const main = async (noSleep) => {
    // BlockリストとAllowリストによる判定
    /**
     * @type {boolean}
     */
    const useBlockList = await chrome.storage.local.get(["useBlockList"]).then(res => res.useBlockList ?? false);
    /**
     * @type {boolean}
     */
    const useAllowList = await chrome.storage.local.get(["useAllowList"]).then(res => res.useAllowList ?? false);
    /**
     * @type {string[]}
     */
    const allowList = await chrome.storage.local.get(["Allowlist"]).then(res => res.Allowlist ?? []);
    /**
     * @type {string[]}
     */
    const blockList = await chrome.storage.local.get(["Blocklist"]).then(res => res.Blocklist ?? []);
    /**
     * @type {string[]}
     */
    const tmpList = await chrome.storage.local.get(["Tmplist"]).then(res => res.Tmplist ?? []).then(list => list.map(e => e.split("@")[0]));

    if (useAllowList && allowList.includes(location.hostname)) {
        return {
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
        return {
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
        return {
            resFlag: "Unknown",
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
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = () => this._attachShadow({mode: "open"});

    // 時間を表示する桁数
    const digits = 3
    // 時間計測開始
    const startTime = performance.now() / 1000;
    // 検出されたか判定するフラグ
    /**
     * @type {"NoPasswordForm"|"Safe"|"Phish"|"Unknown"}
     */
    let resFlag = "Unknown";
    // 各指標の値
    /**
     * @type {boolean}
     */
    let ga;
    /**
     * @type {boolean}
     */
    let copied;
    /**
     * @type {number}
     */
    let script;
    /**
     * @type {number}
     */
    let extLink;

    // JSによるコンテンツ生成まで2秒待機
    if (!noSleep) await sleep(2000);

    // ページ内にpasswordの入力フォームがなければ処理終了
    if (!(await _isExistPasswordForm())) {
        console.log(`PhishDetector:NoPasswordForm:${(performance.now() / 1000 - startTime).toFixed(digits)}`);
        resFlag = "NoPasswordForm";
    }

    ga = await _checkGoogleAnalytics();
    if (ga) {
        if (resFlag !== "NoPasswordForm") resFlag = "Safe";
        console.log(`PhishDetector:GA:${(performance.now() / 1000 - startTime).toFixed(digits)}`);
    }

    copied = await _checkCopied();
    if (copied) {
        if (resFlag !== "NoPasswordForm") resFlag = "Phish";
        console.log(`PhishDetector:Copy:${(performance.now() / 1000 - startTime).toFixed(digits)}`);
    }

    script = await _checkScriptTagCount();
    if (script <= 11) {
        if (resFlag !== "NoPasswordForm") resFlag = "Phish";
        console.log(`PhishDetector:Script:${(performance.now() / 1000 - startTime).toFixed(digits)}`);
    }

    extLink = await _checkExtLink();
    if (extLink >= 64) {
        if (resFlag !== "NoPasswordForm") resFlag = "Phish";
        console.log(`PhishDetector:ExtLink:${(performance.now() / 1000 - startTime).toFixed(digits)}`);
    }

    return {
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


/**
 *
 * @returns {Promise<boolean>} input[type="password"]があればTrue
 * @private
 */
const _isExistPasswordForm = async () => {
    let cnt = document.querySelectorAll('input[type="password"]').length;

    // iframe内のscriptタグも取得
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
        try {
            cnt += iframe.contentWindow.document.querySelectorAll('input[type="password"]').length;
        } catch {
            /* empty */
        }
    }

    return (cnt >= 1);
}


/**
 * @param {string} resFlag
 * @param {string} detectBy
 * @param {boolean} ga
 * @param {boolean} copied
 * @param {number} script
 * @param {number} extLink
 * @param {string} time
 * @returns {Promise<void>}
 * @private
 */
const _showDetectionPage = async (resFlag, detectBy, ga, copied, script, extLink, time) => {
    location.assign(`chrome-extension://${chrome.runtime.id}/src/warning/index.html?url=${location.hostname}&resFlag=${resFlag}&detectBy=${detectBy}&ga=${ga}&copied=${copied}&script=${script}&extLink=${extLink}&time=${time}`)
}


/**
 *
 * @returns {Promise<boolean>} GAコードがあればTrue
 * @private
 */
const _checkGoogleAnalytics = async () => {
    const GAFileName = "https://www.google-analytics.com/analytics.js";
    const GTMFileName = "https://www.googletagmanager.com/gtag/js";

    const srcText = document.documentElement.outerHTML;

    return (srcText.includes(GAFileName)) || (srcText.includes(GTMFileName));
}


/**
 *
 * @returns {Promise<boolean>} コピーの痕跡があればTrue
 * @private
 */
const _checkCopied = async () => {
    const HtmlAttr = "data-scrapbook-source";
    const HtmlComments = "saved from url";

    return (document.documentElement.hasAttribute(HtmlAttr)) || (document.documentElement.outerHTML.includes(HtmlComments));
}


/**
 *
 * @returns {Promise<number>} scriptタグの数が11個以下ならTrue
 * @private
 */
const _checkScriptTagCount = async () => {
    let cnt = document.querySelectorAll("script").length;

    // iframe内のscriptタグも取得
    const iframes = document.querySelectorAll("iframe")
    for (const iframe of iframes) {
        try {
            cnt += iframe.contentWindow.document.querySelectorAll("script").length;
        } catch {
            /* empty */
        }
    }

    return cnt;
}


/**
 *
 * @returns {Promise<number>} 外部リンクの割合が64%以上ならTrue
 * @private
 */
const _checkExtLink = async () => {

    const aTags = Array.from(document.querySelectorAll("a[href]"));
    // iframe内のaタグも取得
    const iframes = document.querySelectorAll("iframe")
    for (const iframe of iframes) {
        try {
            aTags.push(...iframe.contentWindow.document.querySelectorAll("a[href]"));
        } catch {
            /* empty */
        }
    }

    let external = 0;
    let internal = 0;

    // aタグを外部リンクと内部リンクに分類
    for (const aTag of aTags) {
        let link = aTag.getAttribute("href");

        // ハッシュが指定されていたら無視
        if (link === "" || link.startsWith("#")) continue;

        if (link.startsWith("http") || link.startsWith("//")) {
            // //から始まるURLにhttpやhttpsを追加
            if (link.startsWith("//")) link = `${location.protocol}${link}`;

            let linkHostname = (new URL(link)).hostname;

            // linkのドメインでcookieを設定
            // eTLD+1が違うと設定されない
            while (true) {
                document.cookie = `pd_test_key=pd_test_value; domain=${linkHostname};`;
                if (linkHostname.indexOf(".") === -1) break;
                linkHostname = linkHostname.substring(linkHostname.indexOf(".") + 1);
            }

            // cookieが設定されていればeTLD+1が同じ
            if (document.cookie.includes("pd_test_key=pd_test_value")) {
                internal++;
                console.log(`internal : ${link}`);
            } else {
                external++;
                console.log(`external : ${link}`);
            }

            // cookieを消す
            linkHostname = (new URL(link)).hostname;
            while (true) {
                document.cookie = `pd_test_key=pd_test_value; domain=${linkHostname}; max-age=0;`;
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
    const config = {childList: true, subtree: true};

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName.toLowerCase() === "input" && node.type === "password") {
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