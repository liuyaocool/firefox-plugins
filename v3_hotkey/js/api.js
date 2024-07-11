const GLOBAL = {
    METHOD: {
        TABS: "tabs",
        GOTO_TAB: "goto_tab" 
    }
}


function addMessageListener(listener) {
    browser.runtime.onMessage.addListener((req, sender, resp) => {
        listener(req, sender, resp);
    });
}

function sendToBackground(method, data) {
    browser.runtime.sendMessage({method: method, data: data}, {});
}

// ============================= background api =============================
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