
browser.action.onClicked.addListener((tab) => {
    browser.tabs.create({url: "config.html"});
});

console.log('cache init');
storageSet(GLOBAL.KEY_BIND_CACHE, 
    '{"COPY":{"code":"KeyD","altKey":true},"SWITCH_PREV":{"code":"Backquote","altKey":true},"SWITCH_NEXT":{"code":"Tab","altKey":true},"SEARCH":{"code":"KeyO","altKey":true}}');

addMessageListener((req, sender, resp) => {
    if (GLOBAL.KEY[req.method]) {
        // forwardToActiveTab(req);
        sendMessageToTab(sender.tab.id, req);
        return;
    }
    switch (req.method) {
        case GLOBAL.METHOD.TABS_HIS: 
        case GLOBAL.METHOD.TABS: 
            getTabs(req.data).then(res => {
                req.data = res;
                sendMessageToTab(sender.tab.id, req)
                // resp(req); ??
            });
            break;
        case GLOBAL.METHOD.GOTO_TAB: gotoTab(req.data); break;
        default: break;
    }
});

function storageSet(k, v) {
    let o = {};
    o[k] = v;
    return browser.storage.local.set(o);
}

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