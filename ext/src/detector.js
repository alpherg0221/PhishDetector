const sleep = (second) => new Promise(resolve => setTimeout(resolve, second));

const main = async () => {
    // Shadow DOM対策
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = () => this._attachShadow({ mode: "open" });

    // JSによるコンテンツ生成まで2秒待機
    await sleep(2000);

    // ページ内にpasswordの入力フォームがなければ処理終了
    if (!(await _isExistPasswordForm())) {
        console.log(`PhishDetector:NoPasswordForm:${ (performance.now() / 1000 - startTime).toFixed(digits) }`);
        return;
    }

    await chrome.runtime.sendMessage({
        type: "detect",
        ga: await _checkGoogleAnalytics(),
        copy: await _checkCopy(),
        script: await _checkScriptTagCount(),
        extLink: await _checkExtLink(),
    });
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
 * @returns {Promise<number>} GAコードがあれば1、なければ0
 * @private
 */
const _checkGoogleAnalytics = async () => {
    const GAFileName = "https://www.google-analytics.com/analytics.js";
    const GTMFileName = "https://www.googletagmanager.com/gtag/js";

    const srcText = document.documentElement.outerHTML;

    return (srcText.includes(GAFileName)) || (srcText.includes(GTMFileName)) ? 1 : 0;
}


/**
 *
 * @returns {Promise<number>} コピーの痕跡があれば1、なければ0
 * @private
 */
const _checkCopy = async () => {
    const HtmlAttr = "data-scrapbook-source";
    const HtmlComments = "saved from url";

    return (document.documentElement.hasAttribute(HtmlAttr)) || (document.documentElement.outerHTML.includes(HtmlComments)) ? 1 : 0;
}


/**
 *
 * @returns {Promise<number>} scriptタグの数
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
 * @returns {Promise<number>} 外部リンクの割合
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
        try {
            const link = aTag.getAttribute("href");

            // ハッシュが指定されていたら無視
            if (link === "" || link.startsWith("#")) continue;

            if (link.startsWith("http") || link.startsWith("//")) {
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
        } finally {
        }
    }

    return (external * 100 / (external + internal));
}

main().catch(e => console.log(e));