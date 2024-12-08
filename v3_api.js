function sendToBackground(event, data) {
    browser.runtime.sendMessage({event: event, data: data}, {})
        // .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}

function addMessageListener(listener) {
    browser.runtime.onMessage.addListener(listener);
}

async function forwardToActiveTab(message) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, message);
}

async function sendToActiveTab(event, data) {
    forwardToActiveTab({event: event, data: data});
}

function storageSet(k, v) {
    let o = {};
    o[k] = v;
    return browser.storage.local.set(o);
}

async function storageGet(k) {
    return await browser.storage.local.get([k]);
}

function uuid() {
    return crypto.randomUUID().replaceAll('-', '');
}