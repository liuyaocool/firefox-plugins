function sendToBackground(method, data) {
    browser.runtime.sendMessage({method: method, data: data}, {})
        // .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}

/**
 * @param {*} listener function(method, data, sender, resp)
 */
function addMessageListener(listener) {
    browser.runtime.onMessage.addListener(
        (req, sender, resp) => listener(req.method, req.data, sender, resp)
    );
}

async function sendMessageToTab(tabId, method, data) {
    return await browser.tabs.sendMessage(tabId, {method: method, data: data});
}

async function sendToActiveTab(method, data) {
    let tab = await getActiveTab();
    return await sendMessageToTab(tab.id, method, data);
}

async function getActiveTab() {
    return (await browser.tabs.query({ active: true, lastFocusedWindow: true }))[0];
}

function storageSet(k, v) {
    let o = {};
    o[k] = v;
    return browser.storage.local.set(o);
}

async function storageGet(k) {
    return (await browser.storage.local.get([k]))[k];
}

function uuid() {
    return crypto.randomUUID().replaceAll('-', '');
}

function getSourceUrl(path) {
    return browser.runtime.getURL(path); 
}