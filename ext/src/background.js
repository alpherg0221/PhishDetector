chrome.runtime.onInstalled.addListener(async () => {
    await chrome.tabs.create({url: `./src/startup/index.html`})
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then(([currentTab]) => {
        switch (msg.type) {
            // 検出処理を実行
            case "detection":
                chrome.tabs.sendMessage(currentTab.id, {type: "detection"}).then(res => sendResponse(res));
                return true;
            // 警告ページを閉じる
            case "close":
                chrome.tabs.remove(currentTab.id).then();
                return true;
            // リストを開く
            case "list":
                chrome.tabs.create({url: `./src/list/index.html?listType=${msg.listType}`}).then();
                return true;
        }
    });
    return true;
});