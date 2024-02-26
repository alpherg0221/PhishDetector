chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    switch (message.type) {
        // IDを返す
        case "id":
            sendResponse(chrome.runtime.id)
            break;
        // 警告ページを表示する
        case "show":
            await chrome.tabs.create({
                url: `./src/warning/index.html?url=${ message.url }&by=${ message.by }&time=${ message.time }`,
                index: currentTab.index,
            });
            await chrome.tabs.remove(currentTab.id)
            break;
        // 警告ページを閉じる
        case "close":
            await chrome.tabs.remove(currentTab.id);
            break;
    }
})