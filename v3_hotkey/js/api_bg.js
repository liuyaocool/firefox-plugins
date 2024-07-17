function addMessageListener(listener) {
    browser.runtime.onMessage.addListener((req, sender, resp) => {
        listener(req, sender, resp);
    });
}

function getTabs() {
    return browser.tabs.query({
        "lastFocusedWindow": true
    });
}

function gotoTab(tabId) {
    browser.tabs.update(tabId, { active: true });
}

function sendMessageToTab(tabId, message) {
    browser.tabs.sendMessage(tabId, message);
}

async function forwardToActiveTab(message) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, message);
}