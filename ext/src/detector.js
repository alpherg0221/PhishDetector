const sleep = (second) => new Promise(resolve => setTimeout(resolve, second));

const main = async () => {
    // Shadow DOM対策
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = () => this._attachShadow({ mode: "open" });

    // 時間を表示する桁数
    const digits = 3
    // 時間計測開始
    const startTime = performance.now() / 1000;

    // JSによるコンテンツ生成まで2秒待機
    await sleep(2000);

    // ページ内にpasswordの入力フォームがなければ処理終了
    if (!(await _isExistPasswordForm())) {
        console.log(`PhishDetector:NoPasswordForm:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    if (await _checkGoogleAnalytics()) {
        console.log(`PhishDetector:GA:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    if (await _checkCopy()) {
        await _showDetectionPage("Copy", (performance.now() / 1000 - startTime).toFixed(digits));
        console.log(`PhishDetector:Copy:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    if (await _checkScriptTagCount()) {
        await _showDetectionPage("Script", (performance.now() / 1000 - startTime).toFixed(digits));
        console.log(`PhishDetector:Script:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    if (await _checkExtLink()) {
        await _showDetectionPage("ExtLink", (performance.now() / 1000 - startTime).toFixed(digits));
        console.log(`PhishDetector:ExtLink:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    console.log(`PhishDetector:Unknown:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
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
 *
 * @param {("Copy"|"Script"|"ExtLink")} detectBy
 * @param {string} time
 * @returns {Promise<void>}
 * @private
 */
const _showDetectionPage = async (detectBy, time) => {
    await chrome.runtime.sendMessage({
        type: "show", url: location.hostname, by: detectBy, time: time,
    });
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
const _checkCopy = async () => {
    const HtmlAttr = "data-scrapbook-source";
    const HtmlComments = "saved from url";

    return (document.documentElement.hasAttribute(HtmlAttr)) || (document.documentElement.outerHTML.includes(HtmlComments));
}


/**
 *
 * @returns {Promise<boolean>} scriptタグの数が11個以下ならTrue
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

    return (cnt <= 11);
}


/**
 *
 * @returns {Promise<boolean>} 外部リンクの割合が64%以上ならTrue
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
        const link = aTag.getAttribute("href");

        // ハッシュが指定されていたら無視
        if (link === "" || link.startsWith("#")) continue;

        if (link.startsWith("http") || link.startsWith("//")) {
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

    return ((external * 100 / (external + internal)) >= 64);
}

main().catch(e => console.error(e));