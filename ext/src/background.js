importScripts("./pyodide/pyodide.js");
importScripts("./pyodide/pyodide.asm.js");

let _pycode = "";
let _pyodide;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const [currentTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    switch (message.type) {
        // IDを返す
        case "detect":
            if (_pyodide !== undefined) {
                _pyodide.runPython(
                    _pycode
                        .replace("# feature_ga", `ga = ${message.ga}`)
                        .replace("# feature_copy", `copy = ${message.copy}`)
                        .replace("# feature_script", `script = ${message.script}`)
                        .replace("# feature_extLink", `extLink = ${message.extLink}`)
                )
            }
            break;
        // 警告ページを表示する
        case "show":
            await chrome.tabs.create({
                url: `./src/warning/index.html?url=${message.url}&by=${message.by}&time=${message.time}`,
                index: currentTab.index,
            });
            await chrome.tabs.remove(currentTab.id)
            break;
        // 警告ページを閉じる
        case "close":
            await chrome.tabs.remove(currentTab.id);
            break;
    }
});

const init = async () => {
    const _modelZip = await fetch("./python/model.zip").then(res => res.arrayBuffer());
    _pycode = await fetch("./python/detect.py").then(res => res.text());
    _pyodide = await loadPyodide({indexURL: "./pyodide"});

    await _pyodide.loadPackage("pandas");
    await _pyodide.loadPackage("scikit-learn");
    _pyodide.unpackArchive(_modelZip, "zip");

    console.log("init done!");
}

init();