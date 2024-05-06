chrome.runtime.onInstalled.addListener(async () => {
    await chrome.tabs.create({url: `./src/startup/index.html`})
});

chrome.runtime.onMessage.addListener(async (msg) => {
    const [currentTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    switch (msg.type) {
        // ページにアクセス
        // case "show":
        //     await chrome.tabs.update(
        //         currentTab.id,
        //         {url: `./src/warning/index.html?url=${location.hostname}&ga=${msg.ga}&copy=${msg.copied}&script=${msg.script}&extLink=${msg.extLink}&time=${msg.time}`}
        //     );
        //     break
        // 警告ページを閉じる
        case "close":
            await chrome.tabs.remove(currentTab.id);
            break;
    }
});