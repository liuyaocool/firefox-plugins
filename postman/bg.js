browser.browserAction.onClicked.addListener((tab) => {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        // func: openConfig,
        files: ["inject.js"]
    });
});