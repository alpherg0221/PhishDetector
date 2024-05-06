chrome.runtime.onInstalled.addListener(async () => {
    await chrome.tabs.create({url: `./src/startup/index.html`})
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then(([currentTab]) => {
        switch (msg.type) {
            case "detection":
                chrome.tabs.sendMessage(currentTab.id, {type: "detection"}).then(res => sendResponse(res));
                return true;
            // 警告ページを閉じる
            case "close":
                chrome.tabs.remove(currentTab.id).then();
                return true;
        }
    });
    return true;
});